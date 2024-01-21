#!/bin/bash
set -eo pipefail

TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"`
INSTANCEID=`curl -H "X-aws-ec2-metadata-token: $TOKEN" -v http://169.254.169.254/latest/meta-data/instance-id`
ENVHOSTTYPE=`aws ec2 describe-tags --filters "Name=key,Values=ENVHOSTTYPE" | jq -r --arg jq_iid $INSTANCEID '.Tags[] | select(.Key == "ENVHOSTTYPE" and .ResourceId == $jq_iid).Value '`
INSTANCETYPE=`curl -H "X-aws-ec2-metadata-token: $TOKEN" -v http://169.254.169.254/latest/meta-data/instance-type`
INSTANCEPROFILEARN=`curl -H "X-aws-ec2-metadata-token: $TOKEN" -v http://169.254.169.254/latest/meta-data/iam/info | jq -r '.InstanceProfileArn'`
echo 'INSTANCEID: ' $INSTANCEID
echo 'ENVHOSTTYPE: '  $ENVHOSTTYPE
echo 'INSTANCETYPE: ' $INSTANCETYPE
echo 'INSTANCEPROFILEARN: ' $INSTANCEPROFILEARN
