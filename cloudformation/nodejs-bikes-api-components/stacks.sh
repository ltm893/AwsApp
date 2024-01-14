#!/bin/bash
set -eo pipefail
PROFILENAME=todd
S3Bucket=s3://dlivcom-bikes-api-code
S3Opt=$S3Bucket/opt
S3Service=$S3Bucket/service
S3Scripts=$S3Bucket/scripts
ENV_PARMS=(InstanceProfile SecurityGroups ImageBuilder Components Mysql Dns)
IMAGEBUILDSTACK=ImageBuilder-ami
DBNAME=bikesdb
DBSECRET=-BikesDbSecret


set_network_params() {
     # loop through jq query of cli result
    for i in $(cat stackConfig.json | jq -r --arg jq_env_name $1 ' .[] | select(.env) | .env | map(select(.EnvironmentName == $jq_env_name ))[] | @base64 '); do
        _jq() {
        echo ${i} | base64 --decode | jq -r  ${1}
        }
        NETPARAMS=( --parameters ParameterKey=EnvironmentName,ParameterValue=$(_jq '.EnvironmentName') ParameterKey=VpcCIDR,ParameterValue=$(_jq '.VpcCIDR')) 
        NETPARAMS+=(ParameterKey=PublicSubnet1CIDR,ParameterValue=$(_jq '.PublicSubnet1CIDR') ParameterKey=PublicSubnet2CIDR,ParameterValue=$(_jq '.PublicSubnet2CIDR'))
        NETPARAMS+=(ParameterKey=PrivateSubnet1CIDR,ParameterValue=$(_jq '.PrivateSubnet1CIDR') ParameterKey=PrivateSubnet2CIDR,ParameterValue=$(_jq '.PrivateSubnet2CIDR'))
    done        
}

copy_to_s3 () {
    datecmd "Zipping: "  "../../simpleApp"
    cd ../..
    zip -r s3out/opt/simpleApp.zip simpleApp
    datecmd  "Uploading s3out/opt to "  $S3Opt
    aws s3 cp s3out/opt $S3Opt --profile $PROFILENAME --recursive
    datecmd  "Uploading s3out/service to "  $S3Service
    aws s3 cp s3out/service $S3Service --profile $PROFILENAME --recursive
    datecmd  "Uploading s3out/scripts to " $S3Scripts
    aws s3 cp s3out/scripts $S3Scripts --profile $PROFILENAME --recursive
    cd - 
}

create_pipeline() {
    STACK_ENV_NAME=$1
    PIPELINEID=`aws cloudformation describe-stack-resources --stack-name $IMAGEBUILDSTACK --profile $PROFILENAME   | jq -r  '.StackResources | map(select(.LogicalResourceId == "BikesApiPipeline")) | map(.PhysicalResourceId)[0] '`
    datecmd "RunnningPipeline: "  $PIPELINEID
    BUILDVER=`aws imagebuilder start-image-pipeline-execution --profile $PROFILENAME --image-pipeline $PIPELINEID | jq -r '.imageBuildVersionArn'`
    datecmd "BuildVer: " $BUILDVER
    KEEPBUILDCHECKING=yes
    BUILDCHECK=1
    #  $BUILDSTATTUS FAILED
    until [  $KEEPBUILDCHECKING = "no" ] ;
        do
            BUILDSTATTUS=` aws imagebuilder get-image --profile $PROFILENAME --image-build-version-arn $BUILDVER  | jq -r '.image.state.status'`
            if [ $BUILDSTATTUS = "AVAILABLE" ] ; then 
              datecmd "Build Status: " $BUILDSTATTUS 
              KEEPBUILDCHECKING=no
              udpate_parameter_store "AMIID" $STACK_ENV_NAME $BUILDVER
              # ./runEc2NodeApiDevAmi.sh
            else
                datecmd "On BUILDCHECK: "  $BUILDCHECK
                datecmd "Build Status: " $BUILDSTATTUS 
                ((BUILDCHECK=BUILDCHECK+1))
                sleep 60
            fi
    done
}

udpate_parameter_store() {
    if [[ "$1" == "AMIID" ]] ; then
        AMIID=`aws imagebuilder get-image --profile $PROFILENAME --image-build-version-arn $3 | jq -r  '.image.outputResources.amis[0].image'`
        datecmd "AMIID: "  $AMIID
        echo `aws ssm  put-parameter --name /EC2/$2/nodejsAmiId --type String --value $AMIID  --overwrite --profile $PROFILENAME`
    fi 
    if [[ "$1" == "RDS" ]] ; then
        HOSTNAME=`aws rds  describe-db-instances --profile todd | jq -r  --arg jq_dbname $2$DBNAME '.DBInstances[] | select(.DBName == $jq_dbname) | .Endpoint.Address  ' `
        datecmd "AMIID: "  $HOSTNAME
        echo `aws ssm  put-parameter --name /rds/$2/bikestore/host --type String --value $HOSTNAME  --overwrite --profile $PROFILENAME`
    fi
    if  [[ "$1" == "SECRETARN" ]] ; then
        SECRETARN=`aws secretsmanager list-secrets --profile $PROFILENAME | jq -r --arg jq_dbsecret $2$DBSECRET '.SecretList[] | select (.Name == $jq_dbsecret) | .ARN' `
        datecmd "SECRETARN: " $SECRETARN
        echo `aws ssm  put-parameter --name /rds/$2/bikestore/secretarn --type String --value $SECRETARN  --overwrite --profile $PROFILENAME`
    fi

} 

datecmd() {
   arr=("$@")
   now=`date +"%Y-%m-%dT%H:%M:%S%:z"`
   echo $now ${arr[*]}
}

create_stack_jq() {
    STACK_ENV_NAME=$1
    TAGS='Key=Env,Value='$STACK_ENV_NAME
    
    if [[ "$STACK_ENV_NAME" == "ami" ]] ; then
        copy_to_s3
    fi
    set_network_params $STACK_ENV_NAME

     # loop through jq query of cli result
    for i in $(cat stackConfig.json | jq -r '.[]   | @base64 '); do
        _jq() {
            echo ${i} | base64 --decode | jq -r  ${1}
        } 

        if [[ "$STACK_ENV_NAME" != "ami" ]]   &&  [[ $(_jq '.name') == "ImageBuilder" ]] ; then
            continue
        fi
     

        STACKNAME=$(_jq '.name')'-'$STACK_ENV_NAME
        COMMANDSTRING=(aws cloudformation create-stack --profile $PROFILENAME --stack-name $STACKNAME --tags $TAGS --template-body $(_jq '.template'))

        if [[ $(_jq '.iamcapabilities') != null ]] ; then
            COMMANDSTRING+=(--capabilities $(_jq '.iamcapabilities') )
        fi
        if  [[ $(_jq '.name') == "Network" ]] ; then
            COMMANDSTRING+=( "${NETPARAMS[@]}")
        fi
        if [[ $(echo ${ENV_PARMS[@]} | fgrep -w $(_jq '.name')  ) ]] ; then
            COMMANDSTRING+=(--parameters ParameterKey=EnvironmentName,ParameterValue=$STACK_ENV_NAME)
            if  [[ $(_jq '.name') == "Components" ]] ; then
                COMMANDSTRING+=(ParameterKey=AmiId,ParameterValue=/EC2/$STACK_ENV_NAME/nodejsAmiId)
            fi
        fi

        datecmd "${COMMANDSTRING[@]}"
        "${COMMANDSTRING[@]}"
         
        COMMANDSTRING=(aws cloudformation wait stack-create-complete --profile $PROFILENAME --stack-name $STACKNAME  )
        datecmd "${COMMANDSTRING[@]}"
        "${COMMANDSTRING[@]}"

        if [[ "$STACKNAME" == "ImageBuilder-ami" ]]  ; then
            create_pipeline $STACK_ENV_NAME
        fi

        if [[ $(_jq '.name')  == "Mysql" ]]  ; then
            udpate_parameter_store "RDS" $STACK_ENV_NAME
            udpate_parameter_store "SECRETARN" $STACK_ENV_NAME
        fi

    done
}



delete_stack_jq () {
    
    STACK_ENV_NAME=$1
   
    # loop through jq query of cli result
    for i in $(aws cloudformation describe-stacks  --profile todd | jq -r --arg jq_env_name $STACK_ENV_NAME '.Stacks[] |  select(.Tags[] | length > 0) | select(.Tags[].Key == "Env" and .Tags[].Value == $jq_env_name ) | @base64 ' ); do
        _jq() {
            echo ${i} | base64 --decode | jq -r  ${1}
        }

        COMMANDSTRING=( aws cloudformation delete-stack --stack-name $(_jq '.StackName') --profile $PROFILENAME )
        datecmd "${COMMANDSTRING[@]}"
        "${COMMANDSTRING[@]}"

        COMMANDSTRING=( aws cloudformation wait stack-delete-complete --stack-name $(_jq '.StackName') --profile $PROFILENAME )
        datecmd "${COMMANDSTRING[@]}"
        "${COMMANDSTRING[@]}"
    done
}

# Needs 2 inputs $1 create or delete or runpipeline $2 env of ami or dev or prod
# ami will make a new AMI and update parameter storee with AmiId for ami env. For dev or prod to use AMI update Parameter store manually
if [[ "$1" == "create" ]] || [[ "$1" == "delete" ]] || [[ "$1" == "runpipeline" ]] ; then
     datecmd  "Starting" $1 
    if [[ "$2" == "ami" ]] || [[ "$2" == "dev" ]] || [[ "$2" == "prod" ]] ; then
        if [[ "$1" == "create" ]] ;  then
            create_stack_jq $2
        elif [[ "$1" == "delete" ]]  ;  then
            delete_stack_jq $2
        elif [[ "$1" == "runpipeline" ]]  ;  then
            create_pipeline $2
        fi
    else
        echo "Environment Required ami or dev or prod"
    fi
else
  echo "create or delete or runpipeline required argument"
fi
    

