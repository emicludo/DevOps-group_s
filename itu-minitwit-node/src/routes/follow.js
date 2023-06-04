var express = require('express');
var router = express.Router();

const database = require('../db/dbService');

//Utils
var logger = require('../logger/logger');

/* Adds the current user as follower of the given user.*/
router.get('/:username', function (req, res, next) {

  if (!req.session.user) {
    logger.log('error', { url: req.url, method: req.method, requestBody: req.body, responseStatus: 400, message: "You must be logged in to follow." });
    var error = new Error("You must be logged in to follow.");
    error.status = 400;
    next(error);
  }

  database.all("SELECT * FROM user where username = ?", [req.params.username], (err, rows) => {
    if (err) {
      logger.log('error', { url: req.url, method: req.method, requestBody: req.body, responseStatus: 500, message: err });
      var error = new Error('An error occurred while retrieving user');
      error.status = 500;
      next(error);
      return;
    }

    if (rows.length == 0) {
      logger.log('error', { url: req.url, method: req.method, requestBody: req.body, responseStatus: 400, message: "User is not on our database" });
      var error2 = new Error("User is not on our database");
      error2.status = 400;
      next(error2);
      return;
    } else {
      database.all("INSERT into follower (who_id, whom_id) values (?, ?)", [req.session.user.user_id, rows[0].user_id], (err2) => {
        if (err2) {
          logger.log('error', { url: req.url, method: req.method, requestBody: req.body, responseStatus: 500, message: err2 });
          var error = new Error('An error occurred while unfollowing user');
          error.status = 500;
          next(error);
          return;
        }
        req.session.flash = "You are now following " + rows[0].username;
        res.redirect(`/api/${rows[0].username}`);
        return;
      })
    }
  });
});

module.exports = router;