const path = require('path');
const express = require("express");
const bodyParser = require('body-parser') ;
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()) ; 
//app.use(express.static(path.join(__dirname,'public')));
app.use(express.static('public'));

const envTypeRoutes = require('./routes/envTypes') ;

 

app.get("/", (req, res) => { 
 // res.sendFile(path.join(__dirname, '.index.html'));
 res.sendFile('index.html');
});

/*
app.get('/envType/:envId', function(req, res) {
  res.send("envId is set to " + req.params.envId);
});

// GET /p/5
// tagId is set to 5
*/

app.use('/',envTypeRoutes) ; 

app.use((req, res, next ) => {

  res.status(404).send('<h1>Page not Found</h1>') ; 
}) ; 



// set port, listen for requests
// const PORT = process.env.PORT || 8080;
const PORT = 3000; 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
