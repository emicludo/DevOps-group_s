var express = require('express');
var router = express.Router();

const User = require('../model/User')

var logger = require('../logger/logger');

const hash = require('../utils/hash')

router.get('/', function(req, res) {
  if (req.session.user) {
    res.redirect('/api/public');
  } else {
    const errorMessage = req.session.errorMessage;
    const username = req.session.username;
    const successMessage = req.session.flash;
    delete req.session.errorMessage;
    delete req.session.username;
    delete req.session.flash;
    res.render('signin', {errorMessage: errorMessage, flash: successMessage, username: username});
  }
});


router.post('/', async function (req, res, next) {
  
  try {
    const users = await User.findAll({
      attributes: ['user_id', 'username', 'email', 'pw_hash'],
      where: {
        username: req.body.username
      }
    });

    // if user does not exist
    if (users.length == 0) {
      req.session.errorMessage = 'Incorrect username';
      logger.log('warn',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 500, message: req.body.username + ' was not found' });
      res.redirect('/api/signin');
      return;
    }

    if (hash(req.body.password) != users[0].pw_hash) {
      logger.log('warn', { url: req.url ,method: req.method, requestBody: req.body, responseStatus: 401, message: 'Invalid password from user: ' +  req.body.username});
      req.session.username = req.body.username;
      req.session.errorMessage = 'Invalid password';
      logger.log('warn',  { url: req.url ,method: req.method, requestBody: req.body, message: req.body.username + ' failed to login' });
      res.redirect('/api/signin');
      return;
    }

    req.session.flash = 'You were logged in';
    req.session.user = users[0];
    logger.log('info',  { url: req.url ,method: req.method, requestBody: req.body, message: req.body.username + ' successful login' });
    res.redirect('/api');

  } catch (err) {
      console.log(err);
      logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body, responseStatus: 500, message: err });
      var error = new Error("An error occurred while retrieving user");
      error.status = 500;
      next(error);
      return;
  }
})

module.exports = router;