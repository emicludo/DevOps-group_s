const database = require('../db/dbService')

module.exports = class GetAllUsers {

  // Get all users
  async getAllUsers() {
    return new Promise((resolve, reject) => {
      database.all('SELECT * FROM user', [], (err, rows) => {
        if (err) {
          reject(err, null);
        } else {
          resolve(rows, null);
        }
      });
    })
  }
}
