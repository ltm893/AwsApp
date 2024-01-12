#!/bin/bash
set -eo pipefail

datecmd() {
   arr=("$@")
   now=`date +"%Y-%m-%dT%H:%M:%S%:z"`
   echo $now ${arr[*]}
}


for i in $(aws cloudformation describe-stacks  --profile todd | jq -r  '.Stacks | map_values(select(.Tags[].Key == "Env" and .Tags[].Value == "DEV" )) | @base64 ' ); do
    _jq() {
        echo ${i} | base64 --decode | jq -r  ${1}
    }

   
    echo " $(_jq '.StackName' ) "

done


exit 




TEST=AMI
for i in $(cat stackConfig.json | jq -r --arg jq_env_name $TEST ' .[] | select(.env) | .env | map(select(.EnvironmentName == $jq_env_name ))[] | @base64 '); do
    _jq() {
     echo ${i} | base64 --decode | jq -r  ${1}
    }

    NETPARAMS=( --parameters ParameterKey=EnvironmentName,ParameterValue=$(_jq '.EnvironmentName') ParameterKey=VpcCIDR,ParameterValue=$(_jq '.VpcCIDR')) 
    NETPARAMS+=(ParameterKey=PublicSubnet1CIDR,ParameterValue=$(_jq '.PublicSubnet1CIDR') ParameterKey=PublicSubnet2CIDR,ParameterValue=$(_jq '.PublicSubnet2CIDR'))
    NETPARAMS+=(ParameterKey=PrivateSubnet1CIDR,ParameterValue=$(_jq '.PrivateSubnet1CIDR') ParameterKey=PrivateSubnet2CIDR,ParameterValue=$(_jq '.PrivateSubnet2CIDR'))

    #datecmd  "${NETPARAMS[@]}"
done


for i in $(cat stackConfig.json | jq -r ' reverse | .[]  | @base64 '); do
    _jq() {
        echo ${i} | base64 --decode | jq -r  ${1}
    }

    echo " $(_jq '.name' ) "

done





for i in $(cat stackConfig.json | jq -r --arg jq_env_name ${ENV_NAME} ' .[] | select(.env) | .env | map(select(.EnvironmentName == $jq_env_name ))[] | @base64 '); do
    _jq() {
     echo ${i} | base64 --decode | jq -r  ${1}
    }
   
      # echo " $(_jq '.PrivateSubnet2CIDR')  "
done






