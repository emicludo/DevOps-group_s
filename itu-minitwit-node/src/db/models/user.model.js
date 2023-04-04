  const { DataTypes } = require('sequelize');

  module.exports = (sequelize) => {
    sequelize.define('user', {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username:{
        type:DataTypes.STRING, 
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING, 
        allowNull: false,
      },
      pw_hash: {
        type: DataTypes.STRING, 
        allowNull: false,
      }
    });
  };