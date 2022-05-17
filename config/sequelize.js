const config = require("./config");
const Sequelize = require("sequelize");

const { database, username, password } = config.db;

const sequelize = new Sequelize(
    database, username, password, {
        host: config.db.host,
        dialect: config.db.dialect,
        native: true,  //adding this maybe breaks on hobby dyno
        ssl: true, 
        dialectOptions: {
            ssl: {
                require: true, // This will help you. But you will see nwe error
                rejectUnauthorized: false // This line will fix new error
            }
        }
    }
);

module.exports = sequelize;