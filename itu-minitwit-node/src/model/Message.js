const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const User = require('./User');

const Message = sequelize.define('message', {
    message_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pub_date: {
        type: DataTypes.INTEGER,
    },
    flagged: {
        type: DataTypes.INTEGER,
    }
},{
    tableName: 'message',
    timestamps: false
  })

Message.belongsTo(User, { foreignKey: 'author_id', as: 'user' });

module.exports = Message;