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
  const body = {
    username: username,
    email: username + '@itu.dk',
    pw_hash: "1234"
  };
  database.add('user', body, function (err, response) {
    if (err) {
      if (err) {
        reject(err, null);
      } else {
        console.log("Creating user to fix the database")
        logger.log('info', { message: "Creating user to fix the database" });
        resolve(rows, null);
      }
    }
  });
}

module.exports = { getAllUsers, addUser };