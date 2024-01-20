const path = require('path');
const express = require('express')
const cors = require('cors')
const app = express()
const port = 8080
const ec2detailsFile = (path.join(__dirname,'public','ec2details.txt'))
messageString = { test : 'Up'  } 

app.use(express.static('public'));

if (process.env.NODE_ENV === 'local' ) {
  console.log("LOCAL") ; 
  console.log("StartType: " + process.env.NODE_ENV )
  console.log("File Path: " + ec2detailsFile)
  const cors = require('cors') ;

  var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

  app.get("/", cors(corsOptions), (req, res)  => {
    res.status(200).json(messageString);
  });
  
  app.get("/ec2", cors(corsOptions), (req, res) => {
    res.sendFile(ec2detailsFile) ;
  }); 
}


if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'ami' ) {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}
if (process.env.NODE_ENV === 'prod') {
  app.use(express.errorHandler());
}

if (process.env.NODE_ENV !== 'local' ) {
  app.get("/", (req, res)  => {
    res.status(200).json(messageString);
  });
  
  app.get("/ec2", (req, res) => {
    res.sendFile(ec2detailsFile) ;
  }); 
}






  
app.options('*', (req,res) => {
    res.send(200);
})

app.get('/', (req, res) => {
  console.log("Get Default")
  res.send("Default PAGE NOT FOUND");
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})       
