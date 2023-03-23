const express = require('express')
const router = express.Router()

/* Logs the user out */
router.get('/', function (req, res, next) {
  req.session.flash = 'You were logged out'
  delete req.session.user
  res.redirect('/api/public')
})

module.exports = router
