

module.exports = {
    getClientId: async () => {
        const awsCli = require('aws-cli-js');
        const Aws = awsCli.Aws;
        const profileName = "todd"
        const cogPoolidCommand = 'cognito-idp list-user-pools --max-results 5 --profile ' +  profileName ;  
        const aws = new Aws();
        try {
            const poolIdResults = await aws.command(cogPoolidCommand);
            poolResultsData = poolIdResults.object ; 
            const poolId = poolResultsData.UserPools.find(pool => pool.Name == 'dev-bikes-apigateway').Id ;
            // console.log(poolId);
            const cogClientId = 'cognito-idp list-user-pool-clients  --user-pool-id=' + poolId + ' --profile  ' +  profileName
            const poolClientResults = await aws.command(cogClientId);
            poolClientData = poolClientResults.object ;
            const clientId = poolClientData.UserPoolClients.find(poolClients => poolClients.UserPoolId == poolId).ClientId;
           // console.log(clientId)
            return clientId
        } catch (err) {
            console.error(err)
        }
    }
}











/*module.exports = (async function getClientId (){
    //some async initiallizers
    //e.g. await the db module that has the same structure like this
     // var db = await require("./db");
     // var foo = "bar";
    const awsCli = require('aws-cli-js');
    const Aws = awsCli.Aws;
    const profileName = "todd"
    const cogPoolidCommand = 'cognito-idp list-user-pools --max-results 5 --profile ' +  profileName ;  
    const aws = new Aws();
    const poolIdResults = await aws.command(cogPoolidCommand);
    poolResultsData = poolIdResults.object ; 
    const poolId = poolResultsData.UserPools.find(pool => pool.Name == 'dev-bikes-apigateway').Id ;
     //resolve the export promise
     return {
      poolId
     };
   })()

*/









/*

const awsCli = require('aws-cli-js');
const Aws = awsCli.Aws;
const profileName = "todd"
const cogPoolidCommand = 'cognito-idp list-user-pools --max-results 5 --profile ' +  profileName ;  
const aws = new Aws();
const getPoolId = async () => {
//async function getPoolId() {
    try {
        const poolIdResults = await aws.command(cogPoolidCommand);
        poolResultsData = poolIdResults.object ; 
        const poolId = poolResultsData.UserPools.find(pool => pool.Name == 'dev-bikes-apigateway').Id ;
        console.log(poolId);
        const cogClientId = 'cognito-idp list-user-pool-clients  --user-pool-id=' + poolId + ' --profile  ' +  profileName
        const poolClientResults = await aws.command(cogClientId);
        poolClientData = poolClientResults.object ;
        const clientId = poolClientData.UserPoolClients.find(poolClients => poolClients.UserPoolId == poolId).ClientId;
        console.log(clientId)
        return clientId
    } catch (err) {
        console.error(err)
    }
}

getPoolId() ;

*/
