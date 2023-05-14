var express = require('express');
var router = express.Router();

const database = require('../db/dbService')

const gravatar = require('../utils/gravatar')

//Utils
var logger = require('../logger/logger');

const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const User = require('../model/User');
const Message = require('../model/Message');
const Follower = require('../model/Follower');


// TODO: Switch to "personal" timeline if logged in. Currently only shows public timeline. 
router.get('/', async function(req, res, next) {
  logger.log('info',  { url: req.url ,method: req.method, requestBody: req.body , message: 'Request received in /' });
  if (!req.session.user) {
    res.redirect('/api/public');
    return;
  }
  
  const flash = req.session.flash;
  delete req.session.flash;

  try {
    const userMessages = await Message.findAll({
      attributes: ['text', 'pub_date'],
      include: [{
        model: User,
        as: 'user',
        attributes: ['username', 'email'],
        where: {
          user_id: req.session.user.user_id
        }
      }],
      where: {
        flagged: 0
      },
      order: [['pub_date', 'DESC']],
      limit: 30,
      subQuery: false
    });

    const whom = await Follower.findAll({
      attributes: ['whom_id'],
      where: {
        who_id: req.session.user.user_id,
      }
    })

    const IDs = [];
    whom.forEach((whom) => {
      IDs.push(whom.whom_id)
    })

    const followersMessages = await Message.findAll({
      attributes: ['text', 'pub_date'],
      include: {
        model: User,
        as: 'user',
        attributes: ['username', 'email']
      },
      where: {
        flagged: 0,
        author_id: {
          [Op.in]: IDs,
        }
      },
      order: [['pub_date', 'DESC']],
      limit: 30
    });
    
    const allMessages = userMessages.concat(followersMessages);
    const uniqueMessages = allMessages.filter((message, index, self) =>
      index === self.findIndex((m) => (
        m.dataValues.text === message.dataValues.text &&
        m.dataValues.pub_date === message.dataValues.pub_date &&
        m.dataValues.user.username === message.dataValues.user.username &&
        m.dataValues.user.email === message.dataValues.user.email
      ))
    );
    
    const sortedMessages = uniqueMessages.sort((a, b) =>
      b.dataValues.pub_date - a.dataValues.pub_date
    );
    
    const messages = sortedMessages.slice(0, 30);
    
    res.render('index', { messages, flash: flash, path: req.path, user: req.session.user, gravatar: gravatar });
  } catch (error) {
    logger.log('error', { url: req.url, method: req.method, requestBody: req.body, responseStatus: 500, message: error });
    var error = new Error('An error ocurrer while retrieving messages');
    error.status = 500;
    next(error);
    return;
  } 
    
});

/* Displays the latest messages of all users. */
router.get('/public', async (req, res, next) => {
  const flash = req.session.flash;
  delete req.session.flash;
  
  try {
    const messages = await Message.findAll({
      where: {
        flagged: 0
      },
      include: {
        model: User,
        as: 'user',
        attributes: ['username', 'email']
      },
      order: [['pub_date', 'DESC']],
      limit: 30
    });

    res.render('index', { messages, path: req.path, flash, user: req.session.user, gravatar: gravatar });
  } catch (error) {
    console.log(error);
    logger.log('error', { url: req.url, method: req.method, requestBody: req.body, responseStatus: 500, message: error });
    var error = new Error('An error ocurred while retrieving messages');
    error.status = 500;
    next(error);
    return;
  }
});

/* Display's a users tweets. */
router.get('/:username', async function(req, res, next) {
  const flash = req.session.flash;
  delete req.session.flash;

  try {
    const profile = await User.findOne({
      where: {
        username: req.params.username,
      },
    });

    if (profile === null) {
      logger.log('error',  { url: req.url ,method: req.method, requestBody: req.body , responseStatus: 400, message: "User is not on our database" });
      var error = new Error("User is not on our database");
      error.status = 400;
      next(error);
      return;
    }

    const messageRows = await Message.findAll({
      attributes: ['text', 'pub_date'],
      include: {
        model: User,
        as: 'user',
        attributes: ['username', 'email'],
        where: {
          user_id: profile.user_id
        }
      },
      order: [['pub_date', 'DESC']],
      limit: 30
    });

    if (req.session.user) {
      const isFollowing = await Follower.findOne({
        where: {
          who_id: req.session.user.user_id,
          whom_id: profile.user_id
        }
      });

      if (isFollowing) {
        // if they are followed
        res.render('index', { messages: messageRows, path: req.path, followed: true, profile: profile, user: req.session.user, flash: flash, gravatar: gravatar})
        return;
      } else {
        // if they are not followed
        res.render('index', { messages: messageRows, path: req.path, followed: false, profile: profile, user: req.session.user, flash: flash, gravatar: gravatar})
        return;
      }
    } else {
      res.render('index', { messages: messageRows, path: req.path, followed: false, profile: profile, user: req.session.user, flash: flash, gravatar: gravatar})
      return;
    }

  } catch (error) {
    console.log(error);
    logger.log('error', { url: req.url, method: req.method, requestBody: req.body, responseStatus: 500, message: error });
    var error = new Error('An error occurred while retrieving data');
    error.status = 500;
    next(error);
    return;
  }
});

module.exports = router;