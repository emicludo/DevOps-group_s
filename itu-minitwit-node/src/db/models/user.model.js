const Sequelize = require('sequelize');
const sequelize = require("../dbSetup")

const User = sequelize.define('user', {
  user_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username:{
    type: Sequelize.STRING, 
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING, 
    allowNull: false,
  },
  pw_hash: {
    type: Sequelize.STRING, 
    allowNull: false,
  }
});

module.exports = User;