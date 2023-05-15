var express = require('express');
var router = express.Router();

const database = require('../db/dbService')
const User = require('../model/User')

var logger = require('../logger/logger');

const hash = require('../utils/hash')

//Utils
var logger = require('../logger/logger');

router.get('/', function (req, res, next) {
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

router.post('/', async function (req, res, next) {
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
  try {
    const user = await User.findOne({ 
      where: {
        username: req.body.username
      }
    });

    if (user) {
      req.session.username = req.body.username;
      req.session.email = req.body.email;
      req.session.errorMessage = 'The username is already taken';
      res.redirect('/api/signup');
      return;
    } else {
      // if everything's fine
      const hashedPassword = hash(req.body.password);
      await User.create({
        username: req.body.username,
        email: req.body.email,
        pw_hash: hashedPassword
      });

      logger.log('info',  { url: req.url ,method: req.method, requestBody: req.body, message: req.body.username + ' was successfully registered' });
      req.session.flash = 'You were successfully registered and can login now';
      res.redirect('/api/signin');
      return;
    }

  } catch (err) {
    logger.log('error', { url: req.url, method: req.method, requestBody: req.body, responseStatus: 500, message: err });
      var error = new Error('An error occurred while registering user');
      error.status = 500;
      next(error);
      return;
  }
});

module.exports = router;