const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Latest = sequelize.define('latest', {
    latest_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        autoIncrement: false
    },
},{
    tableName: 'latest',
    timestamps: false
  })


module.exports = Latest;