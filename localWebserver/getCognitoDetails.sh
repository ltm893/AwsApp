#!/bin/bash
set -eo pipefail
PROFILENAME=todd
APPENV=dev
POOLNAME=-bikes-apigateway
APPCOGPOOLNAME=$APPENV$POOLNAME


 COGPOOLNAME=`aws  cognito-idp list-user-pools --max-results 5 --profile $PROFILENAME | jq -r --arg jq_pool_name $APPCOGPOOLNAME '.UserPools[] | select(.Name==$jq_pool_name) |.Id' `
 echo "COGPOOLNAME: " $COGPOOLNAME


COGCLIENTID=`aws cognito-idp list-user-pool-clients  --user-pool-id=us-east-2_rs8QC7V8B --profile $PROFILENAME