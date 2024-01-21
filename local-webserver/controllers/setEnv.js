"use strict" ; 

const path = require('path');
const publicPath = path.resolve(__dirname, "..","public"); 
const cogTestHtml = path.join(publicPath, "cogTest.html");

const jsFileMaker = require("../service/cogDetails");

module.exports = {
    setEnv: (req, res) => {
       console.log("setEnvCalled")
        const testEnv = req.params.envId
        jsFileMaker.makeCogJsFile(testEnv).then((result) => {
            console.log(result) ; 
            if(result) {
                res.redirect('/cogTest');
            }
            else {
                res.end("oops " + result) ;
            }
          }) 
    },
    cogTest: async (req, res) => {
        res.sendFile(cogTestHtml) ;
    }
}


/*

,
    cogAuthCode: (req, res) => {
        res.sendFile(cogTestHtml) ;
    },
    cogAuthTest: (req, res) => {
        res.sendFile(cogTestHtml) ;
    }
*/
