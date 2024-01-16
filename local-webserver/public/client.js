
    let token, tokenType, expires ; 
    const authHost = 'https://dev-dliv.auth.us-east-2.amazoncognito.com/oauth2/token' ; 
    const authCodeHost = 'https://dev-dliv.auth.us-east-2.amazoncognito.com/oauth2/authorize?' ;
    const clientId = '71v8mi36sdpbfhmd4n0r40894o';
	const RedirectUrl1 = 'http://localhost:3000' ; 

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
                const str = 'https://dev.apps.dliv.com';
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
        const url ='https://dev.apps.dliv.com';

        console.log("Fetching Dliv")
        console.log(token)
        console.log(tokenType)
        fetch( url , { 
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

    