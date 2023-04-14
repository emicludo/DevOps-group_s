var express = require('express');
var router = express.Router();

const database = require('../db/dbService')

const crypto = require('crypto');

//Utils
var logger = require('../logger/logger');

const gravatar = function gravatarUrl(email, size = 80) {
  const hash = crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex');
  return `http://www.gravatar.com/avatar/${hash}?d=identicon&s=${size}`;
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
router.get('/', function(req, res, next) {

  if (!req.session.user) {
    res.redirect('/api/public');
    return;
  }
  
  const flash = req.session.flash;
  delete req.session.flash;

  database.all("select message.*, user.* from message, user \
                where message.flagged = 0 \
                and message.author_id = user.user_id \
                and (user.user_id = ? or user.user_id in (select whom_id from follower where who_id = ?)) \
                order by message.pub_date desc limit 30"
    , [req.session.user.user_id, req.session.user.user_id], (err, rows) => {

    if (err) {
      var error = new Error('An error ocurrer while retrieving messages');
      error.status = 500;
      next(error);
      return;
    }
      res.render('index', { messages: rows, flash: flash, path: req.path, user: req.session.user, gravatar: gravatar});
    });
  
    
});

/* Displays the latest messages of all users. */
router.get('/public', function (req, res, next) {

  const flash = req.session.flash;
  delete req.session.flash;
  
  database.all("select message.*, user.* from message, user \
                where message.flagged = 0 \
                and message.author_id = user.user_id \
                order by message.pub_date desc limit 30"
    , [], (err, rows) => {

    if (err) {
      logger.log('error', { url: req.url, method: req.method, requestBody: req.body, responseStatus: 500, message: err.toString() });
      var error = new Error('An error ocurrer while retrieving messages');
      error.status = 500;
      next(error);
      return;
    }

    res.render('index', { messages: rows, path: req.path, flash: flash, user: req.session.user, gravatar: gravatar});
    });
});

/* Display's a users tweets. */
router.get('/:username', function(req, res, next) {
  const flash = req.session.flash;
  delete req.session.flash;

  database.all("SELECT * FROM user where username = ?", [req.params.username], (err, rows) => {
    if (err) {
      logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body, responseStatus: 500, message: err.toString() });
      var error = new Error("An error occurred while retrieving user data");
      error.status = 500;
      next(error);
      return;
    }

    // if user does not exist
    if (rows.length == 0) {
      logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 400, message: "User is not on our database" });
      var error = new Error("User is not on our database");
      error.status = 400;
      next(error);
      return;
    }

    let profile = rows[0];

    if (req.session.user) {
      database.all("select 1 from follower where follower.who_id = ? and follower.whom_id = ?", [req.session.user.user_id, profile.user_id], (err, rows2) => {
        if (err) {
          logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 500, message: err.toString() });
          var error = new Error("An error occurred while retrieving followers");
          error.status = 500;
          next(error);
          return;
        }

        // if they are not followed
        if (rows2.length == 0) {
          database.all("select message.*, user.* from message, user where \
          user.user_id = message.author_id and user.user_id = ? \
          order by message.pub_date desc limit 30", [profile.user_id], (err, rows3) => {
            
            if (err) {
              logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 500, message: err.toString() });
              var error = new Error("An error occurred while retrieving data from database");
              error.status = 500;
              next(error);
              return;
            }

            res.render('index', { messages: rows3, path: req.path, followed: false, profile: profile, user: req.session.user, flash: flash, gravatar: gravatar})
            return;
          })
        } else { // if they are followed
          database.all("select message.*, user.* from message, user where \
          user.user_id = message.author_id and user.user_id = ? \
          order by message.pub_date desc limit 30", [profile.user_id], (err, rows3) => {
            if (err) {
              logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 500, message: err.toString() });
              var error = new Error("An error occurred while retrieving data from database");
              error.status = 500;
              next(error);
              return;
            }

            res.render('index', { messages: rows3, path: req.path, followed: true, profile: profile, user: req.session.user, flash: flash, gravatar: gravatar})
            return;
          })
        }
      })

    } else {
      database.all("select message.*, user.* from message, user where \
          user.user_id = message.author_id and user.user_id = ? \
          order by message.pub_date desc limit 30", [profile.user_id], (err, rows4) => {
            if (err) {
              var error = new Error("An error occurred while retrieving user");
              error.status = 500;
              next(error);
              return;
            }

            res.render('index', { messages: rows4, path: req.path, followed: false, profile: profile, user: req.session.user, flash: flash, gravatar: gravatar})
            return;
          })
    }
  });
});

module.exports = router;