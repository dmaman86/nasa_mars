const config = require("./config");
const Sequelize = require("sequelize");

const { database, username, password } = config.db;

const sequelize = new Sequelize(
    database, username, password, {
        host: config.db.host,
        dialect: 'postgres',
        ssl: true
    }
);

module.exports = sequelize;