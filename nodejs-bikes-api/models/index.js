const dbConfig = require("../db.config.js");
console.log(dbConfig)
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: 1,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});
console.log(sequelize)

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Bike = require("./bike.model.js")(sequelize, Sequelize);
db.Brand = require("./brand.model.js")(sequelize, Sequelize);
db.Category = require("./category.model.js")(sequelize, Sequelize);
db.Customer = require("./customer.model.js")(sequelize, Sequelize);
db.Stock = require("./stock.model.js")(sequelize, Sequelize);
db.Store = require("./store.model.js")(sequelize, Sequelize);
db.Staff = require("./staff.model.js")(sequelize, Sequelize);
db.Order = require("./order.model.js")(sequelize, Sequelize);
db.Orderitems = require("./orderitems.model.js")(sequelize, Sequelize);
module.exports = db;