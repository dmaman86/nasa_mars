'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');

const Picture = sequelize.define('Picture', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_user: Sequelize.INTEGER,
  id_photo_nasa: Sequelize.INTEGER,
  url_picture: {
    type: Sequelize.STRING,
    unique: true
  },
  earth_date: Sequelize.STRING,
  sol: Sequelize.STRING,
  camera: Sequelize.STRING,
  mission: Sequelize.STRING
}, {});

module.exports = Picture;

/*const Sequelize = require('sequelize');
const db = require('../config/config');

const Pictures = db.define('Pictures', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_user: Sequelize.INTEGER,
  id_photo_nasa: Sequelize.INTEGER,
  url_picture: {
    type: Sequelize.STRING,
    unique: true
  },
  earth_date: Sequelize.STRING,
  sol: Sequelize.STRING,
  camera: Sequelize.STRING,
  mission: Sequelize.STRING
}, {});

module.exports = Pictures;*/