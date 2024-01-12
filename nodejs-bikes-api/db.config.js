const dotenv = require('dotenv');
const path = require('path');
console.log(__dirname, `${process.env.NODE_ENV}.env`)
dotenv.config({
    path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`)
});


module.exports = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_NAME,
    dialect: process.env.DB_dialect,
    pool: {
      max: 5,
      min: 1,
      acquire: process.env.DB_poolacquire,
      idle: process.env.DB_poolidle
    }
  };
