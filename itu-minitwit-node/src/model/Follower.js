const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const User = require('./User');

const Follower = sequelize.define('follower', {
    who_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    whom_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: User,
            key: 'user_id'
        }
    },
})

Follower.belongsTo(User, { foreignKey: 'who_id', as: 'who' });
Follower.belongsTo(User, { foreignKey: 'whom_id', as: 'whom' });

module.exports = Follower;