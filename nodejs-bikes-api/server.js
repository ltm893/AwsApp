const path = require('path');
const express = require("express");

const bodyParser = require('body-parser') ;
const bikeRoutes = require('./routes/bikes') ; 
const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};



app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()) ; 
// app.use(express.static(path.join(__dirname,'public')));
app.use(express.static('public'));

app.get("/", (req, res) => {
  // res.sendFile(path.join(__dirname, './public/bikes/bikes.html'));
});

app.use('/api',bikeRoutes) ; 

app.use((req, res, next ) => {
  res.status(404).send('<h1>Page not Found</h1>') ; 
}) ; 

const db = require("./models");

db.sequelize.sync({ force: true })
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

db.Brand.hasOne(db.Bike) ; 
db.Bike.belongsTo(db.Brand) ; 
db.Category.hasOne(db.Bike);
db.Bike.belongsTo(db.Category);
db.Bike.hasMany(db.Stock);
db.Stock.belongsTo(db.Bike);
db.Store.hasOne(db.Stock);
db.Stock.belongsTo(db.Store);
db.Customer.hasOne(db.Order) ; 
db.Order.belongsTo(db.Customer) ;
db.Order.belongsTo(db.Store) ; 
db.Order.belongsTo(db.Staff) ;
db.Store.hasMany(db.Order) ; 
db.Staff.hasMany(db.Order) ; 
db.Order.belongsToMany(db.Bike, { through: db.Orderitems });
db.Bike.hasMany(db.Order) ; 

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});