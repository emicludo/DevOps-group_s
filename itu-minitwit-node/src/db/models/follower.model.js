const { DataTypes } = require('sequelize');

  // We export a function that defines the model.
  // This function will automatically receive as parameter the Sequelize connection object.
  module.exports = (sequelize) => {
    sequelize.define('follower', {
      // The following specification of the 'id' attribute could be omitted
      // since it is the default.
      who_id: {
        type: DataTypes.INTEGER
      },
      whom_id: {
        type: DataTypes.INTEGER
      }
    });
  };