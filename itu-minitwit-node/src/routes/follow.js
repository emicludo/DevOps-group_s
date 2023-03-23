const express = require('express')
const router = express.Router()

const database = require('../db/dbService')

/* Adds the current user as follower of the given user. */
router.get('/:username', function (req, res, next) {
  if (!req.session.user) {
    console.log('You are not logged in, so you cannot follow anyone.')
    res.status(400).send({ error: 'You must be logged in to follow.' })
    return
  }

  database.all('SELECT * FROM user where username = ?', [req.params.username], (err, rows) => {
    if (err) {
      console.error(err)
      res.status(500).send({ error: 'An error occurred while retrieving user', description: err.toString() })
      return
    }

    if (rows.length === 0) {
      console.log('The user does not exist')
      res.status(400).send({ error: 'User does not exist' })
    } else {
      database.all('INSERT into follower (who_id, whom_id) values (?, ?)', [req.session.user.user_id, rows[0].user_id], (err, rows2) => {
        if (err) {
          console.error(err)
        }
        req.session.flash = 'You are now following ' + rows[0].username
        res.redirect(`/api/${rows[0].username}`)
      })
    }
  })
})

module.exports = router
