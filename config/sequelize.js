const config = require("./config");
const Sequelize = require("sequelize");

const { database, username, password } = config.db;

const sequelize = new Sequelize(
    database, username, password, {
        host: config.db.host,
        dialect: config.db.dialect
    }
);

module.exports = sequelize;