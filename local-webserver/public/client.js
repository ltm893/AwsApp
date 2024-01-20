
    let token, tokenType, expires ;
    const testEnv = '23gl9qb0ia4e564c5e4kdmo9tj' ; 
    const authHost = 'https://ami-dliv.auth.us-east-2.amazoncognito.com/oauth2/token' ;
    const authCodeHost = 'https://ami-dliv.auth.us-east-2.amazoncognito.com/oauth2/authorize?' ;
    const clientId = '23gl9qb0ia4e564c5e4kdmo9tj';
	const redirectAuthCode = 'http://localhost:3000/cogTest' ; 
    const redirectAuthToken = 'http://localhost:3000/cogAuthToken' ;

    
    window.onload = () => {
        checkIncoming() ; 
    };

    const checkIncoming = () => {
        const host = window.location.host;
        const pathname = window.location.pathname;
        const search = window.location.search;
        const hash = window.location.hash;
        console.log("Token", token)
        console.log("expires ", expires)
        console.log("host", host)
        console.log("path", pathname )
        console.log("search", search)
        console.log("hash", hash)

        
        const urlParams = new URLSearchParams(search);
        const authCode = urlParams.get('code') ; 
        if(authCode) {
            // window.history.replaceState({}, document.title);
            console.log("authcode", authCode)
            getOAuthToken(authCode)
        }
        else {
            redirectForAuthCode()
        }
        
    }

    const redirectForAuthCode = () => {
        const authCodeUrl = authCodeHost + new URLSearchParams({
            response_type: 'code',
            client_id: clientId,
            redirect_uri: redirectAuthCode,
            scope: "email" 
            }) ;
            window.location.href = authCodeUrl ; 
    
    } 

    const getOAuthToken =  (authCode) => {
        if(authCode) {
            fetch(authHost , {
            method: 'POST',  
            body: 'grant_type=authorization_code&code=' + authCode + '&client_id=' + clientId + '&redirect_uri=' + redirectAuthCode ,
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
                console.log("Token: " + token);
                const str = 'https://ami.apps.dliv.com' ;
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
                        document.getElementById('displayCogApi').contentWindow.document.body.innerHTML = data.title ; 
                    }).catch(function (err) {
                        console.log('something went wrong', err);
                    });
                
            })
        }
        else {
            alert("No authorization code")
        }
    }

    const getDlivApps = () => {
        console.log("Fetching Dliv")
        console.log(token)
        console.log(tokenType)
        fetch( 'https://ami.apps.dliv.com'  , { 
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
            document.getElementById('displayCogApi').contentWindow.document.body.innerHTML = data.title ; 
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
    