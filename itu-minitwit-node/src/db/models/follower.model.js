const Sequelize = require('sequelize');
const sequelize = require("../dbSetup")

const Follower = sequelize.define('follower', {
  who_id: {
    type: Sequelize.INTEGER
  },
  whom_id: {
    type: Sequelize.INTEGER
  }
});

module.exports = Follower; 