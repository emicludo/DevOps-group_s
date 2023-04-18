var express = require('express');
var router = express.Router();

/* Logs the user out */
router.get('/', function(req, res, next) {
  req.session.flash = "You were logged out";
  delete req.session.user;
  res.redirect('/api/public');
  return;

});

module.exports = router;