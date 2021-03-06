"use strict";
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DATABASE_URL || "postgres://postgres:postgres@localhost/web_app",
  {
    operatorsAliases: false,
    dialectOptions: {
      ssl: true,
    },
  }
);

module.exports = {
  database: sequelize,
  Sequelize: Sequelize,
};
