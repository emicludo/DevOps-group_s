const database = require('../db/dbService')

//Utils
var logger = require('../logger/logger');

// Get all users
async function getAllUsers() {
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

async function addUser(username) {
  return new Promise((resolve, reject) => {
    const body = {
      username: username,
      email: username.replace(" ", "+") + '@itu.dk',
      pw_hash: "1234"
    };
    database.add('user', body, function (err, response) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        logger.log('info', { message: "Creating user to fix the database" });
        resolve(response);
      }
    });
  });
}

module.exports = { getAllUsers, addUser };
