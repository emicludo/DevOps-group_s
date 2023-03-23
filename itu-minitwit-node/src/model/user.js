const database = require('../db/dbService')

// Get all users
async function getAllUsers () {
  return new Promise((resolve, reject) => {
    database.all('SELECT * FROM user', [], (err, rows) => {
      if (err) {
        reject(err, null)
      } else {
        resolve(rows, null)
      }
    })
  })
}

module.exports = getAllUsers
