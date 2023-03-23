const database = require('../db/dbService')

// Get followers of a user
async function getFollowersFromUser (userid, limit) {
  return new Promise((resolve, reject) => {
    const query = `SELECT user.username FROM user
                   INNER JOIN follower ON follower.whom_id=user.user_id
                   WHERE follower.who_id=?
                   LIMIT ?`

    const limitParsed = parseInt(limit) || 1000
    database.all(query, [userid, limitParsed], (err, rows) => {
      if (err) {
        reject(err, null)
      }
      const filteredFllws = []
      for (const fllw of rows) {
        filteredFllws.push(fllw.username)
      }
      const response = { follows: filteredFllws }
      resolve(response.follows, null)
    })
  })
}

module.exports = getFollowersFromUser
