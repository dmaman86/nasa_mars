const Sequelize = require('sequelize');
require('dotenv').config({path: 'variables.env'});

module.exports = {
  db:{
    dialect: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
  }
};
