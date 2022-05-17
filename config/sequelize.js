const config = require("./config");
const Sequelize = require("sequelize");

require('dotenv').config({path: 'variables.env'});

const { database, username, password, host, dialect } = config.db;
let sequelize;

if(process.env.NODE_ENV === 'production'){
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialectOptions:{
            ssl: true
        }
    });
}else{
    sequelize = new Sequelize(
        database, username, password, {
            host: host,
            dialect: dialect,
            ssl: true
        }
    )
}
/*const sequelize = new Sequelize(
    database, username, password, {
        host: host,
        dialect: dialect,
        ssl: true
    }
);*/

module.exports = sequelize;
