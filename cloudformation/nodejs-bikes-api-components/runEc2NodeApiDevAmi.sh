#!/bin/bash
set -eo pipefail
PROFILENAME=todd
AMIID=`aws ssm  get-parameter --name /EC2/dev/nodejsAmiId --profile $PROFILENAME | jq -r .Parameter.Value` 

SUBNETID=`aws cloudformation describe-stack-resources --stack-name Network --profile $PROFILENAME \
  | jq -r  '.StackResources | map(select(.LogicalResourceId == "PrivateSubnet1")) | map(.PhysicalResourceId)[0] '`

SECURITYGRP=`aws cloudformation describe-stack-resources --stack-name SecurityGroups --profile $PROFILENAME \
 | jq -r  '.StackResources| map(select(.LogicalResourceId == "InstanceSecurityGroup")) | map(.PhysicalResourceId)[0] '`
 
echo 'AMID: ' $AMIID
echo 'SUBNETID: ' $SUBNETID
echo 'SECURITYGRP: ' $SECURITYGRP

aws ec2 run-instances --image-id $AMIID  \
                      --count 1 \
                      --instance-type t3.micro \
                      --key-name Sys0 \
                      --security-group-ids $SECURITYGRP \
                      --subnet-id $SUBNETID \
                      --iam-instance-profile Name=ami-Nodejs4MysqlInstanceRole \
                      --region us-east-2 \
                      --profile $PROFILENAME \
                      --user-data file://ud.txt
 