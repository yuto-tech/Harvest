'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Fanding = loader.database.define('fand', {
  titleID: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  image: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  sumview: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  giveweek: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  send00:{
    type: Sequelize.INTEGER,
    allowNull: false
  },
  explanation: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  updatedat: {
    type: Sequelize.DATE,
    allowNull: false
  }
}, {
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        fields: ['createdBy']
      }
    ]
  });

module.exports = Fanding;