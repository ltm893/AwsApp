const path = require('path');
const express = require("express");
const bodyParser = require('body-parser') ;
// const bikeRoutes = require('./routes/bikes') ; 
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()) ; 
// app.use(express.static(path.join(__dirname,'public')));
app.use(express.static('public'));

/*
export COGPOOLID=us-east-2_J3VcJodcg
export COGCLIENTID=80legu21bg26r2l5d66hcvofd

(async function getClientId(){

  var foo = await require("./cogDetails");
  console.log(foo);
})();
*/

app.get("/", (req, res) => {
  const helper = require("./cogDetails");

  helper.getClientId().then((result) => {
    console.log(result)
  })
  
  res.sendFile(path.join(__dirname, './public/index_apps.html'));

});


app.use((req, res, next ) => {
  res.status(404).send('<h1>Page not Found</h1>') ; 
}) ; 

; 

// set port, listen for requests
// const PORT = process.env.PORT || 8080;
const PORT = 3000 ; 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});