var express = require('express');
var router = express.Router();

const database = require('../db/dbService')
module.exports = router;

var logger = require('../logger/logger');

const hash = require('../utils/hash')

router.get('/', function(req, res, next) {

  if (req.session.user) {
    res.redirect('/api');
  } else {
    const errorMessage = req.session.errorMessage;
    const username = req.session.username;
    const email = req.session.email;
  
    delete req.session.errorMessage;
    delete req.session.username;
    delete req.session.email;
    logger.log('info',  { url: req.url ,method: req.method, requestBody: req.body, message: req.session.errorMessage });
    res.render('signup', {errorMessage: errorMessage, username: username, email: email});
  }
});


router.post('/', function(req, res, next) {

  // user name must be entered
  if (!req.body.username) {
    req.session.errorMessage = 'You have to enter a username';
    res.redirect('/api/signup');
    return;
  }

  // correct format of email
  if (!req.body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) {
    req.session.username = req.body.username;
    req.session.email = req.body.email;
    req.session.errorMessage = 'You have to enter a valid email address';
    res.redirect('/api/signup');
    return;
  }


  // password must be entered
  if (!req.body.password) {
    req.session.username = req.body.username;
    req.session.email = req.body.email;
    req.session.errorMessage = 'You have to enter a password';
    res.redirect('/api/signup');
    return;
  }

  // passwords must match
  if (req.body.password != req.body.password2) {
    req.session.username = req.body.username;
    req.session.email = req.body.email;
    req.session.errorMessage = 'The two passwords do not match';
    res.redirect('/api/signup');
    return;
  }

  // the user name cannot be already taken
  database.all('SELECT * FROM user WHERE username = ?', req.body.username, (err, rows) => {
    
    if (err) {
      console.error(err);
      res.status(500).send({ error: 'An error occurred while retrieving user', description: err.toString() });
      
      return;
    }

    // if this username already exists
    if (rows.length != 0) {
      req.session.username = req.body.username;
      req.session.email = req.body.email;
      req.session.errorMessage = 'The username is already taken';
      res.redirect('/api/signup');
      return;
    } else if (
      // if everything's fine
      database.all('INSERT INTO user (username, email, pw_hash) values (?, ?, ?)', [req.body.username, req.body.email, hash(req.body.password)], (err, rows) => {
      
        if (err) {
          console.error(err);
          res.status(500).send({ error: 'An error occurred while registering', description: err.toString() });
          logger.log('info',  { url: req.url ,method: req.method, requestBody: req.body, message: 'An error occurred while registering ' + err.toString() });
          return;
        }
        logger.log('info',  { url: req.url ,method: req.method, requestBody: req.body, message: req.body.username + ' was successfully registered' });
        req.session.flash = 'You were successfully registered and can login now';
        res.redirect('/api/signin');
        return;
      })
    )
    return;
  })
 });