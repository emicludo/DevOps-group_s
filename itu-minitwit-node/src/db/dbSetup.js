const { Sequelize } = require('sequelize');

// Sequelize constructor
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql'
  });

// const modelDefiners = [
// 	require('./models/follower-model'),
// 	require('./models/message-model'),
// 	require('./models/user-model')
// ];

// for (const modelDefiner of modelDefiners) {
// 	modelDefiner(sequelize);
// }

module.exports = sequelize;