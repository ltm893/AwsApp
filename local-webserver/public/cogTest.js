const testCogAuthBtn = document.getElementById('testCogAuthButton')
    const clickCogAuthEventHandler = () => {
      redirectForAuthCode() ; 
    }
    
testCogAuthBtn.addEventListener('click', clickCogAuthEventHandler, true);