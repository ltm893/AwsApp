"use strict" ; 
const path = require('path');
const { writeFile } = require('node:fs/promises');
const awsCli = require('aws-cli-js');

const js1 = (testEnv,clientId) => {
    let jsText = `
    let token, tokenType, expires ; 
    const authHost = 'https://`
    jsText += testEnv ; 
    jsText += `-dliv.auth.us-east-2.amazoncognito.com/oauth2/token' ; 
    const authCodeHost = 'https://`
    jsText  += testEnv ;
    jsText += `-dliv.auth.us-east-2.amazoncognito.com/oauth2/authorize?' ;
    const clientId = '`
    jsText  += clientId + "';\n\t" ;
    jsText  += `const RedirectUrl1 = 'http://localhost:3000' ; 

    const redirectForAuthCode = () => {
        const authCodeUrl = authCodeHost + new URLSearchParams({
            response_type: 'code',
            client_id: clientId,
            redirect_uri: RedirectUrl1,
            scope: "email" 
            }) ;
            window.location.href = authCodeUrl ; 
    
    } 

    const getOAuthToken =  (authCode) => {
        if(authCode) {
            fetch(authHost , {
            method: 'POST',  
            body: 'grant_type=authorization_code&code=' + authCode + '&client_id=' + clientId + '&redirect_uri=' + RedirectUrl1 ,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            }).then(function (resp) {
                // Return the response as JSON
                return resp.json();
            }).then(function (data) { 
                // const params = window.location.search;
                // params.delete("code")
                token = data.access_token;
                tokenType = data.token_type;
                expires = new Date().getTime() + (data.expires_in * 1000);
                console.log(token);
                
                const str = 'https://apps.dliv.com' ; 
                const url = new URL(str);
                const request = new Request(url, {
                     method: 'GET',
                     headers: {
                        'Authorization': data.token_type + ' ' + data.access_token,
                        'Accept': 'application/json'
		            } 
                });
                fetch(request)
                    .then(function (resp) {
                        console.log(resp)
                        return resp.json();
                    }).then(function (data) {
                        console.log('data', data);
                    }).catch(function (err) {
                        console.log('something went wrong', err);
                    });
                
            })
        }
        else {
            alter("No authorization code")
        }
    }

    const getDlivApps = () => {
        console.log("Fetching Dliv")
        console.log(token)
        console.log(tokenType)
        fetch('https://apps.dliv.com', {
            mode: "no-cors",
            headers: {
                'Authorization': tokenType + ' ' + token,
                'Content-Type': 'application/x-www-form-urlencoded',
                'access-control-request-method': 'POST',
                'access-control-request-headers': 'X-Requested-With'
            }
           
        }).then(function (resp) {
            // Return the API response as JSON
            console.log(resp)
            return resp.json();
        }).then(function (data) {
            // Log the pet data
            console.log('from apps', data);
        }).catch(function (err) {
           console.log('something went wrong callinbg apps ', err);
        });

    }

    const makeCall = function () {
        // If current token is invalid, get a new one
        if (!expires || expires - new Date().getTime() < 1) {
            console.log('new call');
            redirectForAuthCode() ; 
        }
        // Otherwise, get pets
        console.log('from cache');
        getDlivApps()
    }
   
    const appsBtnElement = document.getElementById("getAppsBtn");
    appsBtnElement.addEventListener("click",redirectForAuthCode);
    const displayApp = document.getElementById("displayApps");

    `
    return jsText ;
   
}



const writeJsFile = async (text) => {
    const jsFile = path.join(__dirname, 'public/client.js') ;
    const result = await writeFile(  jsFile, text);
    return
}

module.exports = {
    makeCogJsFile: async (testEnv) => {
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
            const clientId = poolClientData.UserPoolClients.find(poolClients => poolClients.UserPoolId == poolId).ClientId;
           console.log(clientId)
          //  return clientId
          const jsText = js1(testEnv, clientId) ; 
          const writeResult = await writeJsFile(jsText) ;
          return "OK" ; 
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
