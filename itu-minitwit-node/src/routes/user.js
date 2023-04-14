var express = require('express');
var router = express.Router();

const database = require('../db/dbService')

//Utils
var logger = require('../logger/logger');

router.get('/:userId', async function (req, res, next) {

  // Display's a users tweets.
  database.all("SELECT * FROM user where user_id = ?", [req.params.userId], (err, rows) => {
    if (err) {
      logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body, responseStatus: 500, message: err.toString() });
      var error = new Error('An error occurred while retrieving user');
      error.status = 500;
      next(error);
      return;
    }

    // if user does not exist
    if (rows.length == 0) {
      logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 404, message: "User is not on our database" });
      var error = new Error("User is not on our database");
      error.status = 404;
      next(error);
      return;
    }

    let profile_user = rows[0];

    database.all('SELECT message.*, user.* from message, user where user.user_id = message.author_id and user.user_id = ? order by message.pub_date desc limit 30', [profile_user.user_id], (err2, rows2) => {
      if (err2) {
        logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body, responseStatus: 500, message: err2.toString() });
        var error = new Error('An error occurred while retrieving data from database');
        error.status = 500;
        next(error);
        return;
      }
      res.send({ data: rows2 });
    })
  });

});


module.exports = router;