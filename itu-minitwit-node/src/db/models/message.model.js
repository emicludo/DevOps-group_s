const Sequelize = require('sequelize');
const sequelize = require("../dbSetup")

const Message = sequelize.define('message', {
  message_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  author_id:{
    type:Sequelize.INTEGER, 
    allowNull: false,
  },
  text: {
    type: Sequelize.STRING, 
    allowNull: false,
  },
  pub_date: {
    type: Sequelize.BIGINT
  }, 
  flagged: {
    type: Sequelize.INTEGER
  }, 
});

module.exports = Message;