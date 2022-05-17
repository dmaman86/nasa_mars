const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');

const User = require('./User');
const Picture = require('./Picture');

module.exports = {
    sequelize,
    User,
    Picture
}