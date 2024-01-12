#!/bin/bash
set -eo pipefail
SERVERDIR=`pwd`/
STACKNAME=ImageBuilderPipeline
STACKTEMPLATE=file://ImageBuilder.yaml
PROFILENAME=todd
S3Bucket=s3://dlivcom-bikes-api-code
S3Opt=$S3Bucket/opt
S3Service=$S3Bucket/service
S3Scripts=$S3Bucket/scripts


datecmd() {
   now=`date +"%Y-%m-%dT%H:%M:%S%:z"`
   echo "$now $1 $2"
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

create_stack() {
    echo 'Dir: ' $SERVERDIR
    copy_to_s3
    datecmd "Starting: " $1
    STACKID=`aws cloudformation create-stack --profile $PROFILENAME --stack-name $1  --template-body $2  | jq -r '.StackId'`
    aws cloudformation wait stack-create-complete --profile $PROFILENAME --stack-name $1
    datecmd "CF stackId: "  $STACKID
    create_pipeline
}

create_pipeline() {
    PIPELINEID=`aws cloudformation describe-stack-resources --stack-name $STACKNAME --profile $PROFILENAME   | jq -r  '.StackResources | map(select(.LogicalResourceId == "BikesApiPipeline")) | map(.PhysicalResourceId)[0] '`
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
              udpate_parameter_store $BUILDVER
              # ./runEc2NodeApiDevAmi.sh
            else
                datecmd "On BUILDCHECK: "  $BUILDCHECK
                datecmd "Build Status: " $BUILDSTATTUS 
                ((BUILDCHECK=BUILDCHECK+1))
                sleep 60
            fi
    done
}

delete_stack() {
    aws cloudformation delete-stack --stack-name $1 --profile $PROFILENAME 
    aws cloudformation wait stack-delete-complete --stack-name $1 --profile $PROFILENAME 
    datecmd "$1 stack delete complete"
}

udpate_parameter_store() {
    AMIID=`aws imagebuilder get-image --profile $PROFILENAME --image-build-version-arn $1 | jq -r  '.image.outputResources.amis[0].image'`
    datecmd "AMIID: "  $AMIID
    echo `aws ssm  put-parameter --name /EC2/dev/nodejsAmiId --type String --value $AMIID  --overwrite --profile $PROFILENAME`
}

if [ $1 = "create" ] || [  $1 = "delete" ]; then
    datecmd  $1 $STACKNAME
   
else
  echo "create or delete required argument"
fi


if [ $1 = "create" ]; then
   create_stack $STACKNAME  $STACKTEMPLATE
fi

if [ "$1" == "delete" ]; then
    datecmd  $1 $STACKNAME
    delete_stack $STACKNAME
    
fi
