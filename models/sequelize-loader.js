'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  process.env.HEROKU_POSTGRESQL_RED_URL || 'postgres://postgres:postgres@localhost/web_app',
  {
    operatorsAliases: false
  });

module.exports = {
  database: sequelize,
  Sequelize: Sequelize
};