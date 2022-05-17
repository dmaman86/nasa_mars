const config = require("./config");
const Sequelize = require("sequelize");

const { database, username, password, host, dialect } = config.db;

const sequelize = new Sequelize(
    database, username, password, {
        host: host,
        dialect: dialect,
        ssl: true
    }
);

module.exports = sequelize;
