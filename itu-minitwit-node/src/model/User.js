const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
//const Message = require('./Message');
const Follower = require('./Follower');

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

  /* User.hasMany(Message, { foreignKey: 'author_id' }); */

  User.belongsToMany(User, { as: 'Followers', through: Follower, foreignKey: 'who_id' });
  User.belongsToMany(User, { as: 'Following', through: Follower, foreignKey: 'whom_id' });

module.exports = User;