const express = require('express')
const router = express.Router()

const database = require('../db/dbService')

const hash = require('../utils/hash')
router.get('/', function (req, res, next) {
  if (req.session.user) {
    res.redirect('/api')
  } else {
    const errorMessage = req.session.errorMessage
    const username = req.session.username

    delete req.session.errorMessage
    delete req.session.username
    res.render('signin', { errorMessage, username })
  }
})

router.post('/', function (req, res, next) {
  database.all('SELECT * FROM user WHERE username = ?', req.body.username, (err, rows) => {
    if (err) {
      console.error(err)
      res.status(500).send({ error: 'An error occurred while retrieving user', description: err.toString() })

      return
    }

    // if user does not exist
    if (rows.length === 0) {
      req.session.errorMessage = 'Incorrect username'
      res.redirect('/api/signin')
      return
    }

    if (hash(req.body.password) !== rows[0].pw_hash) {
      req.session.username = req.body.username
      req.session.errorMessage = 'Invalid password'
      res.redirect('/api/signin')
      return
    }

    req.session.flash = 'You were logged in'
    req.session.user = rows[0]

    res.redirect('/api/')
  })
})

module.exports = router
