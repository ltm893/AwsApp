
console.log("testEnv: " + testEnv)
let cognitoToken, cognitoTokenType;

  if (testEnv !== 'local') {

    const checkIncoming = () => {
        const search = window.location.search;
        const urlParams = new URLSearchParams(search);
        const authCode = urlParams.get('code') ; 
        if(authCode) {
            console.log("authcode", authCode)
            getOAuthToken(authCode) ; 
        }
        else {
            redirectForAuthCode() ;    
        } 
    }

    const redirectForAuthCode = () => {
      const authCodeUrl = authCodeHost + new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        redirect_uri: redirectAuthCode,
        scope: "email"
      });
      console.log(authCodeUrl)
      window.location.href = authCodeUrl;
    }

    const getOAuthToken = (authCode) => {
      if (authCode) {
        fetch(authHost, {
          method: 'POST',
          body: 'grant_type=authorization_code&code=' + authCode + '&client_id=' + clientId + '&redirect_uri=' + redirectAuthCode,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(function (resp) {
          return resp.json();
        }).then(function (data) {
          cognitoToken = data.access_token;
          cognitoTokenType = data.token_type;
          console.log("Token: " + cognitoToken);
        }).catch(function (err) {
          console.log('something went wrong callinbg apps ', err);
        });
      }
      else {
        alert("No authorization code")
      }
    }
    window.onload = checkIncoming()  ; 
  }

  const fetchIt = async (urlStr, route, testEnv) => {
    const fetchHeader = new Headers();
    fetchHeader.append('Accept', 'application/json');

    if (testEnv !== 'local') {
      fetchHeader.append('Authorization', cognitoTokenType + ' ' + cognitoToken);
    }

    const request = new Request(urlStr + route, {
      method: 'GET',
      headers: fetchHeader
    });

    console.log(request)

    if (route == '') {
      try {
        const response = await fetch(request);
        data = await response.json();
        result = data.test
        responseDiv.innerHTML = "/ is: " + result;
      }
      catch(err) {
        console.log(err)
        return false
      }
    }

    if (route == 'ec2') {
      try {
        const responseEc2 = await fetch(request);
        dataEc2 = await responseEc2.text();
        const textArray = dataEc2.split("\n")
        const html_array = textArray.map((t) => {
          return  '<div>' + t + '</div>'
        });
        html_array.unshift('<div>ec2Details</div>')
        responseEc2Div.innerHTML = html_array.join("")
      }
      catch(err) {
        console.log(err)
        return false
      }
    }
  }

  const checkBaseBtn = document.getElementById("checkBaseBtn");
  checkBaseBtn.addEventListener("click", function () {
    responseDiv.innerHTML = "";
    fetchIt(urlStr, '', testEnv);
  });


  const checkEc2Btn = document.getElementById("checkEc2Btn");
  checkEc2Btn.addEventListener("click", function () {
    responseEc2Div.innerHTML = "";
    fetchIt(urlStr, 'ec2', testEnv);
  });

  const responseDiv = document.getElementById("responseDiv");
  const responseEc2Div = document.getElementById("responseEc2Div");

  const pickEnvBtn = document.getElementById("pickEnvBtn");
  pickEnvBtn.addEventListener("click", function () {
        window.location.href = "http://localhost:3000"
  });

  const messageDiv = document.getElementById("messageDiv") ;
  messageDiv.innerHTML = testEnv ; 


 

  