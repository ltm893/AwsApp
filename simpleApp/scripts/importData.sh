#!/bin/bash

aws s3 cp s3://ltm893-mysql-bike-loads/load-bikes.sql /input
SECRETID=`aws ssm get-parameter --name /rds/bikestore/secretarn --region us-east-2 | jq -r ."Parameter.Value"`
TPASS=`aws secretsmanager get-secret-value --secret-id $SECRETID --query "SecretString" --output text --region us-east-2 | jq -r ."password"`
mysql -h $RDSHOST --port 3306 -u admin -p$TPASS < /input/load-bikes.sql 
