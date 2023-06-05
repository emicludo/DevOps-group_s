const database = require('../db/dbService');
const User = require('./User');

// Get all users
module.exports = class GetAllUsers {
  
  async getAllUsers() {
    try {
      const users = await User.findAll({
        attributes: ['user_id', 'username', 'email', 'pw_hash'],
      })
      return users;
    } catch (err) {
      return err;
    }
  }
}