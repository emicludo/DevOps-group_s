var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('authentication');
});

router.get('/', function(req, res, next) {
  res.render('login');
});

module.exports = router;