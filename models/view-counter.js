'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Counter = loader.database.define('counter', {
  viewID: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },
  titleID: {
    type: Sequelize.STRING,
    allowNull: false
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
}, 
{
    freezeTableName: true,
    timestamps: false
  });

module.exports = Counter;