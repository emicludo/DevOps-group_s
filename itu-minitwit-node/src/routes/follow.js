var express = require('express');
var router = express.Router();

const database = require('../db/dbService');
const User = require('../model/User');
const Follower = require('../model/Follower');

//Utils
var logger = require('../logger/logger');

/* Adds the current user as follower of the given user.*/
router.get('/:username', async function (req, res, next) {

  if (!req.session.user) {
    logger.log('error', { url: req.url, method: req.method, requestBody: req.body, responseStatus: 400, message: "You must be logged in to follow." });
    var error = new Error("You must be logged in to follow.");
    error.status = 400;
    next(error);
  }

  
  try {
    const users = await User.findAll({
      attributes: ['user_id', 'username', 'email', 'pw_hash'],
      where: {
        username: req.params.username,
      }
    })

    if (users.length == 0) {
      logger.log('error', { url: req.url, method: req.method, requestBody: req.body, responseStatus: 400, message: "User is not on our database" });
      var error2 = new Error("User is not on our database");
      error2.status = 400;
      next(error2);
    } else {
      await Follower.create({
        who_id: req.session.user.user_id,
        whom_id: users[0].user_id
      })
      req.session.flash = "You are now following " + users[0].username;
      res.redirect(`/api/${users[0].username}`);
    }
  } catch (err) {
      logger.log('error', { url: req.url, method: req.method, requestBody: req.body, responseStatus: 500, message: err });
      var error = new Error('An error occurred while unfollowing user');
      error.status = 500;
      next(error);
      return;
  }
});

module.exports = router;