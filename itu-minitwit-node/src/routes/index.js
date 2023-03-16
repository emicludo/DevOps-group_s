const express = require('express')
const router = express.Router()

const database = require('../db/dbService')

const crypto = require('crypto')

const gravatar = function gravatarUrl (email, size = 80) {
  const hash = crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex')
  return `http://www.gravatar.com/avatar/${hash}?d=identicon&s=${size}`
}

/**
 * GET /
 *
 * Checks whether the user is logged in.
 * If not logged in, retrieves most recent messages from the database and returns them (public timeline).
 * If logged in, retrieves most recent messages (follower and own) from the database and returns them.
 *
 * Errors:
 *  - 500: An error occurred while retrieving the message
 */

// TODO: Switch to "personal" timeline if logged in. Currently only shows public timeline.
router.get('/', function (req, res, next) {
  if (!req.session.user) {
    res.redirect('/api/public')
  }

  const flash = req.session.flash
  delete req.session.flash

  database.all(`select message.*, user.* from message, user 
                where message.flagged = 0 
                and message.author_id = user.user_id 
                and (user.user_id = ? or user.user_id in (select whom_id from follower where who_id = ?)) 
                order by message.pub_date desc limit 30`
  , [req.session.user.user_id, req.session.user.user_id], (err, rows) => {
    if (err) {
      console.error(err)
      res.status(500).render('error')
      return
    }

    console.log('Successfully retrieved ' + rows.length + ' messages')
    res.render('index', { messages: rows, flash, path: req.path, user: req.session.user, gravatar })
  })
})

/* Displays the latest messages of all users. */
router.get('/public', function (req, res, next) {
  const flash = req.session.flash
  delete req.session.flash

  database.all(`select message.*, user.* from message, user 
                where message.flagged = 0 
                and message.author_id = user.user_id 
                order by message.pub_date desc limit 30`
  , [], (err, rows) => {
    if (err) {
      console.error(err)
      res.status(500).render('error')
      return
    }

    console.log('Successfully retrieved ' + rows.length + ' messages')
    res.render('index', { messages: rows, path: req.path, flash, user: req.session.user, gravatar })
  })
})

/* Display's a users tweets. */
router.get('/:username', function (req, res, next) {
  const flash = req.session.flash
  delete req.session.flash

  database.all('SELECT * FROM user where username = ?', [req.params.username], (err, rows) => {
    if (err) {
      console.error(err)
      res.status(500).send({ error: 'An error occurred while retrieving user', description: err.toString() })
      return
    }

    // if user does not exist
    if (rows.length === 0) {
      console.log('The user does not exist')
      res.status(400).send({ error: 'User does not exist' })
      return
    }

    const profile = rows[0]

    if (req.session.user) {
      database.all('select 1 from follower where follower.who_id = ? and follower.whom_id = ?', [req.session.user.user_id, profile.user_id], (err, rows2) => {
        if (err) {
          console.error(err)
          res.status(500).send({ error: 'An error occurred while retrieving user', description: err.toString() })
          return
        }

        // if they are not followed
        if (rows2.length === 0) {
          database.all(`select message.*, user.* from message, user where 
          user.user_id = message.author_id and user.user_id = ? 
          order by message.pub_date desc limit 30`, [profile.user_id], (err, rows3) => {
            if (err) {
              console.error(err)
              res.status(500).send({ error: 'An error occurred while retrieving user', description: err.toString() })
              return
            }

            res.render('index', { messages: rows3, path: req.path, followed: false, profile, user: req.session.user, flash, gravatar })
          })
        } else { // if they are followed
          database.all(`select message.*, user.* from message, user where 
          user.user_id = message.author_id and user.user_id = ? 
          order by message.pub_date desc limit 30`, [profile.user_id], (err, rows3) => {
            if (err) {
              console.error(err)
              res.status(500).send({ error: 'An error occurred while retrieving user', description: err.toString() })
              return
            }

            res.render('index', { messages: rows3, path: req.path, followed: true, profile, user: req.session.user, flash, gravatar })
          })
        }
      })
    } else {
      database.all(`select message.*, user.* from message, user where 
          user.user_id = message.author_id and user.user_id = ? 
          order by message.pub_date desc limit 30`, [profile.user_id], (err, rows4) => {
        if (err) {
          console.error(err)
          res.status(500).send({ error: 'An error occurred while retrieving user', description: err.toString() })
          return
        }

        res.render('index', { messages: rows4, path: req.path, followed: false, profile, user: req.session.user, flash, gravatar })
      })
    }
  })
})

module.exports = router
