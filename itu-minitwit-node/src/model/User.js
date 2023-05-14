const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
//const Follower = require('./Follower');

const User = sequelize.define('user', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pw_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
},{
    tableName: 'user',
    timestamps: false
  })

  /* User.belongsToMany(User, { 
    through: Follower,
    as: 'Following', 
    foreignKey: 'whom_id',
    otherKey: 'who_id'
  });

  User.belongsToMany(User, { 
    through: Follower,
    as: 'Followers', 
    foreignKey: 'who_id',
    otherKey: 'whom_id'
  }); */

module.exports = User;