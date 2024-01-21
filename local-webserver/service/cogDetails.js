"use strict" ; 
const path = require('path');
const { writeFile } = require('node:fs/promises');
const awsCli = require('aws-cli-js');

const js1 = (testEnv,clientId) => {
    console.log(testEnv) ; 
    let jsText = `
        testEnv = '${testEnv}' ; `

    if(testEnv !== 'local') {
        jsText +=`
        urlStr ='https://${testEnv}.apps.dliv.com/' ;
        authHost = 'https://${testEnv}-dliv.auth.us-east-2.amazoncognito.com/oauth2/token' ; 
        authCodeHost = 'https:/${testEnv}-dliv.auth.us-east-2.amazoncognito.com/oauth2/authorize?' ; 
        clientId =  '${clientId}' ; 
        redirectAuthCode = 'http://localhost:3000/cogTest' ; `
    }    
    if(testEnv === 'local') {
        jsText += `urlStr ='http://localhost:8080/' ;`
    }

    return jsText ;
}



const writeJsFile = async (text) => {
    const jsFile = path.join(__dirname, '../public/clientEnv.js') ;
    const result = await writeFile(  jsFile, text);
    return
}

module.exports = {
    makeCogJsFile: async (testEnv) => {
        let clientId ;
        if(testEnv !== 'local') {
            const poolName = testEnv + '-bikes-apigateway' ;
            console.log("testEnv: " +  testEnv)
            const Aws = awsCli.Aws;
            const profileName = "todd"
            const cogPoolidCommand = 'cognito-idp list-user-pools --max-results 5 --profile ' +  profileName ;  
            const aws = new Aws();
            try {
                const poolIdResults = await aws.command(cogPoolidCommand);
                const poolResultsData = poolIdResults.object ; 
                const poolId = poolResultsData.UserPools.find(pool => pool.Name == poolName).Id ;
                console.log(poolId);
                const cogClientId = 'cognito-idp list-user-pool-clients  --user-pool-id=' + poolId + ' --profile  ' +  profileName
                const poolClientResults = await aws.command(cogClientId);
                const poolClientData = poolClientResults.object ;
                clientId = poolClientData.UserPoolClients.find(poolClients => poolClients.UserPoolId == poolId).ClientId;
                console.log(clientId)
            } catch (err) {
                console.error(err)
            }
        }
        const jsText = js1(testEnv, clientId) ; 
        const writeResult = await writeJsFile(jsText) ;
        return true ; 
    }
}
