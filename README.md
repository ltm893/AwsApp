# AwsApp
* Cognito Protected API
* Network Load Balancer
* EC2 ASG running custom AMI with nodejs API server
* RDS Mysql
* Custom Dns

## Install
* Create Parameter Stores with dummy values
  * /EC2/ami/nodejsAmiId, /EC2/dev/nodejsAmiId, /EC2/prod/nodejsAmiId
  * /rds/ami/bikestore/host, /rds/dev/bikestore/host, /rds/prod/bikestore/host
  * /rds/ami/bikestore/secretarn, /rds/dev/bikestore/secretarn, /rds/prod/bikestore/secretarn
* Create s3://<YOURBUCKET>
    * With opt, script, and service perfixes
    * Update cloudformation variables with s3 details
* Update AMI in ImageBuilder.yaml template for additonal software
    * cd to cloudformation
    * run ./stacks.sh create ami
    * Update Parameter store dev and prod for different AMIs
    * Rds hostanme and secretarn will update with stacks.sh
* Test data is at s3://ltm893-mysql-bike-loads/load-bikes.sql
* Login to EC2 with Session Manager and load test data as ec2-user ~/scripts/loadImport.sh

## Testing
* Connito with local node webserver
   * cd local-webserver/
   * npm start
   * Makes call to APIs built with cloudformation templates 
   * To test locally cd ~/simpleApp
   * npm run local 




