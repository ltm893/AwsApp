"use strict" ; 

const path = require('path');
const publicPath = path.resolve(__dirname, "..","public"); 
const cogTestHtml = path.join(publicPath, "cogTest.html");

const jsFileMaker = require("../service/cogDetails");

module.exports = {
    setEnv: (req, res) => {
        const testEnv = req.params.envId
        jsFileMaker.makeCogJsFile(testEnv).then((result) => {
            console.log(result) ; 
            if(result) {
            // res.send('{"success" : "File Made Successfully", "status" : 200}');
                res.redirect('/cogTest');
            }
            else {
                res.end("oops " + result) ;
            }
          }) 
    },
    cogTest: (req, res) => {
        res.sendFile(cogTestHtml) ;
    }
}