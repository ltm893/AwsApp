#!/bin/bash

 
RDSHOST=`aws ssm get-parameter --name /rds/bikestore/host --region us-east-2 | jq -r ."Parameter.Value"`
echo "export RDSHOST=$RDSHOST" >> /home/ec2-user/.bashrc'
chmod 755 /home/ec2-user/scripts/getRdsHostname.sh