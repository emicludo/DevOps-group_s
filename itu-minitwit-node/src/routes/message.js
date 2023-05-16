var express = require('express');
var router = express.Router();

const database = require('../db/dbService')

//Utils
var logger = require('../logger/logger');
const os = require('os');

/**
 * GET /message
 *
 * Retrieves all messages from the database and returns them as a JSON response.
 *
 * Response:
 *  - messages: An array of message objects, where each object has the following properties:
 *    - message_id: The message's unique identifier
 *    - author_id: The authors's identifier
 *    - text: The message's content
 *    - pub_date: The message's publication date
 *    - flagged: A boolean representing if the message is flagged or not
 *  Response example:
 *    {"message_id":1,"author_id":1,"text":"From hour to hour yesterday I saw my white face of it?","pub_date":1233065594,"flagged":0}
 *
 * Errors:
 *  - 500: An error occurred while retrieving the message
 */
router.get('/', async function (req, res, next) {
  database.all("SELECT * FROM message limit 1000", [], (err, rows) => { //add this line to limit the number of messages returned
    if (err) {
      logger.log('error', { url: req.url, method: req.method, requestBody: req.body, responseStatus: 500, message: err });
      var error = new Error("Error retrieving messages from our database");
      error.status = 500;
      next(error);
      return;
    }
    res.send({ messages: rows });
  });
});

/* Registers a new message for the user. */
router.post('/', function (req, res, next) {
  if (!req.session.user) {
    
    var error = new Error("You must be logged in to create a message.");
    error.status = 400;
    next(error);
  }

  if (req.body.text) {
    database.all("insert into message (author_id, text, pub_date, flagged) values (?, ?, ?, 0)", [req.session.user.user_id, req.body.text, Date.now()], (err, rows) => {
      if (err) {
        logger.log('error', { url: req.url, method: req.method, requestBody: req.body, responseStatus: 500, message: err });
        var error = new Error('An error occurred while creating message');
        error.status = 500;
        next(error);
        return;
      }
      
      const hostname = os.hostname();
      logger.log('info', { url: req.url, method: req.method, requestBody: req.body, responseStatus: 200, message: req.body.text, hostname: hostname });
      req.session.flash = 'Your message was recorded';
      res.send('message ' + req.body.text + ' created');
      return;
    })

  } else {
    res.redirect('/api');
  }
});

module.exports = router;
