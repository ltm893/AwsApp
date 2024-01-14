#!/bin/bash
set -eo pipefail
PROFILENAME=todd
APPENV=dev
POOLNAME=-bikes-apigateway
APPCOGPOOLNAME=$APPENV$POOLNAME


 COGPOOLID=`aws  cognito-idp list-user-pools --max-results 5 --profile $PROFILENAME \
 | jq -r --arg jq_pool_name $APPCOGPOOLNAME '.UserPools[] | select(.Name==$jq_pool_name) |.Id' `
 export COGPOOLID=$COGPOOLID
 echo "COGPOOLID: " $COGPOOLID


COGCLIENTID=` aws cognito-idp list-user-pool-clients  --user-pool-id=us-east-2_J3VcJodcg --profile todd \
| jq -r --arg jq_poolid $COGPOOLID '.UserPoolClients[] | select(.UserPoolId == $jq_poolid) | .ClientId '`
export COGCLIENTID=$COGCLIENTID
echo "COGCLIENTID" $COGCLIENTID