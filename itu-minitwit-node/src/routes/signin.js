var express = require('express');
var router = express.Router();

const database = require('../db/dbService')

var logger = require('../logger/logger');

const hash = require('../utils/hash')
router.get('/', function(req, res, next) {

  if (req.session.user) {
    res.redirect('/api');
  } else {
    const errorMessage = req.session.errorMessage;
    const username = req.session.username;
    delete req.session.errorMessage;
    delete req.session.username;
    res.render('signin', {errorMessage: errorMessage, username: username});
  }
});


router.post('/', function (req, res, next) {

  database.all('SELECT * FROM user WHERE username = ?', req.body.username, (err, rows) => {
    
    if (err) {
      console.error(err);
      res.status(500).send({ error: 'An error occurred while retrieving user', description: err.toString() });
      logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 500, message: 'An error occurred while retrieving user, ' + err.toString()  });
      return;
    }

    // if user does not exist
    if (rows.length == 0) {
      req.session.errorMessage = 'Incorrect username';
      logger.log('warn',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 500, message: req.body.username + ' was not found' });
      res.redirect('/api/signin');
      return;
    }

    if (hash(req.body.password) != rows[0].pw_hash) {
      req.session.username = req.body.username;
      req.session.errorMessage = 'Invalid password';
      logger.log('warn',  { url: req.url ,method: req.method, requestBody: req.body, message: req.body.username + ' failed to login' });
      res.redirect('/api/signin');
      return;
    }
    
    req.session.flash = 'You were logged in';
    req.session.user = rows[0];
    logger.log('info',  { url: req.url ,method: req.method, requestBody: req.body, message: req.body.username + ' successful login' });
    res.redirect('/api/');
  })
})

module.exports = router;