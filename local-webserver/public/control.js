
const envSelect = document.getElementById('envSelect');

const selectEnvEventHandler = async (event) => {
    console.log(event)
    let envType = event.srcElement.value;
    let redirectString = 'http://localhost:3000/envType/'
    if (envType === 'ami') {
        redirectString += "ami"
    }
    else if (envType === 'dev') {
        redirectString += 'dev'
    }
    else if (envType === 'prod') {     
        redirectString += 'prod'
    }
    else {
        return false;
    }
   window.location.replace(redirectString);
}  

envSelect.addEventListener('change', selectEnvEventHandler, true);
