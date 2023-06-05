var express = require('express');
var router = express.Router();

const database = require('../db/dbService')
const Message = require('../model/Message');
const User = require('../model/User');
const Follower = require('../model/Follower');

//Services
const LatestService = require('../services/LatestService');
const latestService = new LatestService();

//Utils
var logger = require('../logger/logger');
const hash = require('../utils/hash')
const isSimulator = require('../utils/authorizationValidator');

const GetAllUsers = require('../model/users.js');
const getAllUsers = new GetAllUsers();
const GetFollowersFromUser = require('../model/followers.js');
const getFollowersFromUser = new GetFollowersFromUser();


//Routing
router.get('/latest', async function (req, res, next) {
  res.send({ latest: latestService.getLatest() });
})

router.post("/register", async function (req, res, next) {
  try {
    //Checks if header comes from simulator
    const header = req.headers.authorization;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.pwd;

    if (!isSimulator(header)) {
      logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 403, message: "You are not authorized to use this resource!" });
      var error = new Error("You are not authorized to use this resource");
      error.status = 403;
      next(error);
      return;
    }

    //Updates Latest
    var latest = req.query.latest;
    if (latest !== undefined && !isNaN(parseInt(latest))) {
      await latestService.updateLatest(parseInt(latest));
    }

    //Checks if username is taken
    const users = await getAllUsers.getAllUsers()
    const userFound = users.find(user => user.username == username)

    var error2 = null
    if (username === null) {
      error2 = "You have to enter a username";
    } else if (email === null || email.indexOf("@") === -1) {
      error2 = error2 + ". You have to enter a valid email address"
    } else if (password === null) {
      error2 = error2 + ". You have to enter a password"
    } else if (userFound !== undefined) {
      error2 = error2 + ". The username is already taken"
    }

    if (error2 === null) {
      const body = {
        username: username,
        email: email,
        pw_hash: hash(password)
      };

      try {
        const user = await User.create({
          username: username,
          email: email,
          pw_hash: hash(password)
        })
  
        res.status(204).send("");
      } catch (err) {
          logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body , message: err });
          var newError = new Error("Error adding user to our database");
          newError.status = 500;
          next(newError);
          return;
      }
    } else {
      //Send error
      logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 400, message: error2 });
      var newError = new Error(error);
      newError.status = 400;
      next(newError);
    }
  } catch (error) {
    logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 500, message: error });
    var newError2 = new Error(error);
    newError2.status = 500;
    next(newError2);
  }
});

router.get('/msgs', async function (req, res, next) {
  try {
    //Checks if header comes from simulator
    const header = req.headers.authorization;
    if (!isSimulator(header)) {
      logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 403, message: "You are not authorized to use this resource!" });
      var error = new Error("You are not authorized to use this resource");
      error.status = 403;
      next(error);
      return;
    }

    //Updates Latest
    var latest = req.query.latest;
    if (latest !== undefined && isNaN(parseInt(latest))) {
      await latestService.updateLatest(parseInt(latest));
    }

    //Gets Limit
    var no_msgs = parseInt(req.query.no);
    if (!no_msgs) {
      no_msgs = 100;
    }

    try {
      const messages = await Message.findAll({
        where: {
          flagged: 0,
        },
        include: {
          model: User,
          as: 'user',
          attributes: ['username', 'email']
        },
        order: [['pub_date', 'DESC']],
        limit: no_msgs
      });

      const filteredMsgs = [];

      for (const msg of messages) {
        const filteredMsg = {};
        filteredMsg.content = msg.text; //Check
        filteredMsg.pubDate = msg.pub_date;
        filteredMsg.user = msg.user.username;
        filteredMsgs.push(filteredMsg);
      }
      res.send(filteredMsgs);

    } catch (err) {
      logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 500, message: err });
      var error = new Error("Error retrieving messages from our database");
      error.status = 500;
      next(error);
      return;
    }
  } catch (error) {
    logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 500, message: error });
    var newError = new Error(error);
    newError.status = 500;
    next(newError);
  }
});

router.get('/msgs/:username', async function (req, res, next) {
  let username = req.params.username;
  try {
    //Checks if header comes from simulator
    const header = req.headers.authorization;
    if (!isSimulator(header)) {
      logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 403, message: "You are not authorized to use this resource!" });
      var error = new Error("You are not authorized to use this resource");
      error.status = 403;
      next(error);
      return;
    }
    //Updates Latest
    var latest = req.query.latest;
    if (latest !== undefined && isNaN(parseInt(latest))) {
      await latestService.updateLatest(parseInt(latest));
    }
    //Gets Limit
    var no_msgs = parseInt(req.query.no);
    if (!no_msgs) {
      no_msgs = 100;
    }

    const users = await getAllUsers.getAllUsers()
    const userSelected = users.find(user => user.username == username)
    if (!userSelected) {
      logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 404, message: "User is not on our database" });
      var error3 = new Error("User is not on our database");
      error3.status = 404;
      next(error3);
      return;
    }
    const userId = userSelected.user_id

    try {
      const messages = await Message.findAll({
        where: {
          flagged: 0,
        },
        include: {
          model: User,
          as: 'user',
          attributes: ['username', 'email'],
          where: {
            user_id: userId
          }
        },
        order: [['pub_date', 'DESC']],
        limit: no_msgs
      })

      const filteredMsgs = [];
      for (const msg of messages) {
        const filteredMsg = {};
        filteredMsg.content = msg.text;
        filteredMsg.pubDate = msg.pub_date;
        filteredMsg.user = msg.user.username;
        filteredMsgs.push(filteredMsg);
      }

      if (filteredMsgs.length == 0) {
        res.status(204).send("");
      } else {
        res.status(200).send(filteredMsgs);
      }

    } catch (err) {
      logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 500, message: err });
        var error = new Error("Error retrieving messages from our database");
        error.status = 500;
        next(error);
        return;
    }
  } catch (error) {
    logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 500, message: error });
    var newError = new Error(error);
    newError.status = 500;
    next(newError);
  }
})

router.post('/msgs/:username', async function (req, res, next) {
  let username = req.params.username;
  let content = req.body.content;
  try {
    //Checks if header comes from simulator
    const header = req.headers.authorization;
    if (!isSimulator(header)) {
      logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 403, message:"You are not authorized to use this resource!" });
      var error = new Error("You are not authorized to use this resource");
      error.status = 403;
      next(error);
      return;
    }
    //Updates Latest
    var latest = req.query.latest;
    if (latest !== undefined && isNaN(parseInt(latest))) {
      await latestService.updateLatest(parseInt(latest));
    }

    const users = await getAllUsers.getAllUsers()
    const userSelected = users.find(user => user.username == username)
    if (!userSelected) {
      logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 404, message: "User is not on our database" });
      var error4 = new Error("User is not on our database");
      error4.status = 404;
      next(error4);
      return;
    }
    const userId = userSelected.user_id

    const body = {
      author_id: userId,
      text: content.replace(/'/g, "''"),
      pub_date: Date.now(),
      flagged: 0
    };

    try {
      const message = await Message.create({
        author_id: userId,
        text: content.replace(/'/g, "''"),
        pub_date: Date.now(),
        flagged: 0
      })

      logger.log('info',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 204, message: "Message added successfully" });
      res.status(204).send("");
    } catch (err) {
        logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 500, message: err });
        var error = new Error(err);
        error.status = 500;
        next(error);
        return;
    }
  } catch (error) {
    logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 500, message: error });
    var newError = new Error(error);
    newError.status = 500;
    next(newError);
  }
})

router.get('/fllws/:username', async function (req, res, next) {
  let username = req.params.username;
  try {
    //Checks if header comes from simulator
    const header = req.headers.authorization;
    if (!isSimulator(header)) {
      logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 403, message: "You are not authorized to use this resource!" });
      var error = new Error("You are not authorized to use this resource");
      error.status = 403;
      next(error);
      return;
    }
    //Updates Latest
    var latest = req.query.latest;
    if (latest !== undefined && isNaN(parseInt(latest))) {
      await latestService.updateLatest(parseInt(latest));
    }

    const users = await getAllUsers.getAllUsers();
    const userSelected = users.find(user => user.username == username);
    if (!userSelected) {
      logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 404, message: "User is not on our database" });
      var error5 = new Error("User is not on our database");
      error5.status = 404;
      next(error5);
      return;
    }
    const userId = userSelected.user_id;

    const no_followers = parseInt(req.query.no) || 100;

    const userFollowsList = await getFollowersFromUser.getFollowersFromUser(userId, no_followers);
    const filteredFllws = [];
    for (const fllw of userFollowsList) {
      filteredFllws.push(fllw);
    }
    const response = { follows: filteredFllws };
    res.send(response);

  } catch (error) {
    logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 500, message: error });
    var newError = new Error(error);
    newError.status = 500;
    next(newError);
  }
});

router.post('/fllws/:username', async function (req, res, next) {
  let username = req.params.username;
  try {
    // Checks if header comes from simulator
    const header = req.headers.authorization;
    if (!isSimulator(header)) {
      logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 403, message: "You are not authorized to use this resource!" });
      var error = new Error("You are not authorized to use this resource");
      error.status = 403;
      next(error);
      return;
    }

    // Updates Latest
    const latest = req.query.latest;
    if (latest !== undefined && isNaN(parseInt(latest))) {
      await latestService.updateLatest(parseInt(latest));
    }

    const users = await getAllUsers.getAllUsers();
    const userSelected = users.find(user => user.username == username);
    if (!userSelected) {
      logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 404, message: "User is not on our database" });
      var error6 = new Error("User is not on our database");
      error6.status = 404;
      next(error6);
      return;
    }
    const userId = userSelected.user_id;

    if (req.body.follow) {
      const followUsername = req.body.follow;
      const followsUser = users.find(user => user.username == followUsername);
      if (!followsUser) {
        logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 404, message: "Follows user is not on our database" });
        var error7 = new Error("User to be followed is not on our database");
        error7.status = 404;
        next(error7);
        return;
      }

      const userFollowsList = await getFollowersFromUser.getFollowersFromUser(userId, null);
      if (userFollowsList.includes(followsUser.username)) {
        logger.log('warn',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 204, message: "User already follows this user" });
        var error8 = new Error("User already follows this user");
        error8.status = 204;
        next(error8);
        return
      }
      
      const followsUserId = followsUser.user_id;

      try {
        const followers = await Follower.create({
          who_id: userId,
          whom_id: followsUserId
        })
        res.status(204).send("");
      } catch(err) {
        logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 500, message: err });
          var error = new Error(err);
          error.status = 500;
          next(error);
          return;
      }

    } else if (req.body.unfollow) {
      const unfollowUsername = req.body.unfollow;
      const unfollowsUser = users.find(user => user.username == unfollowUsername);
      if (!unfollowsUser) {
        logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 404, message: "Unfollows user is not on our database" });
        var error9 = new Error("Unfollows user is not on our database");
        error9.status = 404;
        next(error9);
        return;
      }
      const unfollowsUserId = unfollowsUser.user_id;

      //Validates if user is following the unfollows user
      const userFollowsList = await getFollowersFromUser.getFollowersFromUser(userId, null);
      if (!userFollowsList.includes(unfollowsUser.username)) {
        logger.log('warn',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 204, message: "User is not following the user with name " + unfollowsUser.username });
        res.status(204).send("");
        return
      }
  
      try {
        
        const result = await Follower.destroy({
          where: {
            who_id: userId,
            whom_id: unfollowsUserId
          }
        });
        res.status(204).send("");
      } catch(err) {
        logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 500, message: err });
          var error = new Error(err);
          error.status = 500;
          next(error);
          return;
      }
    } else {
      logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 400, message: "Invalid request body" });
      var error10 = new Error("Invalid request body");
      error10.status = 400;
      next(error10);
      return;
    }
  } catch (error) {
    logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 500, message: error });
    var newError = new Error(error);
    newError.status = 500;
    next(newError);
  }
});

module.exports = router;