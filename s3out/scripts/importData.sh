#!/bin/bash
set -eo pipefail
echo 'Getting RDS Hostname'
HOSTENV=`aws ec2 describe-tags | jq -r '.Tags | map(select(.Key =="ENVHOST" and  .ResourceType=="instance"))[0] | .Value '`
echo 'Downloading from s3'
aws s3 cp s3://ltm893-mysql-bike-loads/load-bikes.sql /input
SECRETID=`aws ssm get-parameter --name /rds/$HOSTENV/bikestore/secretarn --region us-east-2 | jq -r ."Parameter.Value"`
HOST=`aws ssm get-parameter --name /rds/$HOSTENV/bikestore/host --region us-east-2 | jq -r ."Parameter.Value" `
TPASS=`aws secretsmanager get-secret-value --secret-id $SECRETID --query "SecretString" --output text --region us-east-2 |jq -r ."password"`
echo 'making input file'
#mysql -h $HOST --port 3306 -u admin -p$TPASS -e "CREATE DATABASE "$HOSTENV"bikesdb"
echo "use " $HOSTENV"bikesdb" > /input/server-load-file
cat /input/load-bikes.sql >> /input/server-load-file
echo 'loading bikes data'
mysql -h $HOST --port 3306 -u admin -p$TPASS < /input/server-load-file
echo 'counting table rows'
echo "use " $HOSTENV"bikesdb" > /input/dbCounts.sql
cat /home/ec2-user/scripts/dbCounts.sql >> /input/dbCounts.sql
mysql -h $HOST --port 3306 -u admin -p$TPASS < /input/dbCounts.sql