const express = require('express')
const router = express.Router()

const database = require('../db/dbService')

router.get('/:userId', async function (req, res, next) {
  // Display's a users tweets.

  database.all('SELECT * FROM user where user_id = ?', [req.params.userId], (err, rows) => {
    if (err) {
      console.error(err)
      res.status(500).send({ error: 'An error occurred while retrieving user', description: err.toString() })
      return
    }

    // preparation for when we have a 404 page

    // if user does not exist
    if (rows.length === 0) {
      console.log('The user does not exist')
      res.status(400).send({ error: 'User does not exist' })
      return
    }

    const profileUser = rows[0]

    // preparation for when we have a login
    /* let followed = false;
      if g.user:
        followed = query_db('''select 1 from follower where
            follower.who_id = ? and follower.whom_id = ?''',
            [session['user_id'], profile_user['user_id']], one=True) is not None */

    database.all('SELECT message.*, user.* from message, user where user.user_id = message.author_id and user.user_id = ? order by message.pub_date desc limit 30', [profileUser.user_id], (err2, rows2) => {
      if (err2) {
        console.error(err2)
        res.status(500).send({ error: 'An error occurred while retrieving data', description: err2.toString() })
        return
      }

      console.log('Successfully retrieved ' + rows2.length + ' length')
      res.send({ data: rows2 })
    }
    )

    /* console.log('Successfully retrieved ' + rows.length + ' user');
      res.send({ user: rows }); */
  })
})

module.exports = router
