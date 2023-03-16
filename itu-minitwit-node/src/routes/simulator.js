const express = require('express')
const router = express.Router()

const isSimulator = require('../utils/authorizationValidator')
const hash = require('../utils/hash')

const database = require('../db/dbService')

const LatestService = require('../services/LatestService')
const latestService = new LatestService()

const getAllUsers = require('../model/user')
const getFollowersFromUser = require('../model/followers.js')

router.get('/latest', function (req, res, next) {
  res.send({ latest: latestService.getLatest() })
})

router.post('/register', async function (req, res, next) {
  try {
    // Checks if header comes from simulator
    const header = req.headers.authorization
    const username = req.body.username
    const email = req.body.email
    const password = req.body.pwd

    if (!isSimulator(header)) {
      res.status(403).send({ status: 403, error_msg: 'You are not authorized to use this resource!' })
      return
    }

    // Updates Latest
    const latest = req.query.latest
    if (latest !== undefined && !isNaN(parseInt(latest))) {
      latestService.updateLatest(parseInt(latest))
    }

    // Checks if username is taken
    const users = await getAllUsers()
    const userFound = users.find(user => user.username === username)

    let error = null
    if (username === null) {
      error = 'You have to enter a username'
    } else if (email === null || email.indexOf('@') === -1) {
      error = error + '. You have to enter a valid email address'
    } else if (password === null) {
      error = error + '. You have to enter a password'
    } else if (userFound !== undefined) {
      error = error + '. The username is already taken'
    }

    if (error === null) {
      const body = {
        username,
        email,
        pw_hash: hash(password)
      }
      database.add('user', body, function (lasdId, err) {
        if (err) {
          console.error(err.message)
        } else {
          console.log('New user added successfully with id: ' + lasdId)
          res.status(204).send('')
        }
      })
    } else {
      // Send error
      res.status(400).send({ status: 400, error_msg: error })
    }
  } catch (error) {
    console.log('error', error)
  }
})

router.get('/msgs', function (req, res, next) {
  try {
    // Checks if header comes from simulator
    const header = req.headers.authorization
    if (!isSimulator(header)) {
      res.status(403).send({ status: 403, error_msg: 'You are not authorized to use this resource!' })
      return
    }

    // Updates Latest
    const latest = req.query.latest
    if (latest !== undefined && !isNaN(parseInt(latest))) {
      latestService.updateLatest(parseInt(latest))
    }

    // Gets Limit
    let noMsgs = parseInt(req.query.no)
    if (noMsgs === undefined) {
      noMsgs = 100
    }
    const query = `SELECT message.*, user.* FROM message, user
    WHERE message.flagged = 0 AND message.author_id = user.user_id
    ORDER BY message.pub_date DESC LIMIT ?`

    database.all(query, [noMsgs], (err, rows) => {
      if (err) {
        console.error(err)
        res.status(500).render('error')
        return
      }
      const filteredMsgs = []
      for (const msg of rows) {
        const filteredMsg = {}
        filteredMsg.content = msg.text
        filteredMsg.pubDate = msg.pubDate
        filteredMsg.user = msg.username
        filteredMsgs.push(filteredMsg)
      }
      res.send(filteredMsgs)
    })
  } catch (error) {
    console.log('error', error)
  }
})

router.get('/msgs/:username', async function (req, res, next) {
  const username = req.params.username
  try {
    // Checks if header comes from simulator
    const header = req.headers.authorization
    if (!isSimulator(header)) {
      res.status(403).send({ status: 403, error_msg: 'You are not authorized to use this resource!' })
      return
    }
    // Updates Latest
    const latest = req.query.latest
    if (latest !== undefined && !isNaN(parseInt(latest))) {
      latestService.updateLatest(parseInt(latest))
    }
    // Gets Limit
    let noMsgs = parseInt(req.query.no)
    if (!noMsgs) {
      noMsgs = 100
    }

    const users = await getAllUsers()
    const userSelected = users.find(user => user.username = username)
    if (userSelected === -1) {
      res.status(404).send({ status: 404, error_msg: 'User is not on our database' })
    }
    const userId = userSelected.user_id

    const query = `SELECT message.*, user.* FROM message, user 
    WHERE message.flagged = 0 AND
    user.user_id = message.author_id AND user.user_id = ?
    ORDER BY message.pub_date DESC LIMIT ?`

    database.all(query, [userId, noMsgs], (err, rows) => {
      if (err) {
        console.error(err)
        res.status(500).render('error')
        return
      }
      const filteredMsgs = []
      for (const msg of rows) {
        const filteredMsg = {}
        filteredMsg.content = msg.text
        filteredMsg.pubDate = msg.pubDate
        filteredMsg.user = msg.username
        filteredMsgs.push(filteredMsg)
      }
      if (filteredMsgs.length === 0) {
        res.status(204).send('')
      } else {
        res.status(200).send(filteredMsgs)
      }
    })
  } catch (error) {
    console.log('error', error)
  }
})

router.post('/msgs/:username', async function (req, res, next) {
  const username = req.params.username
  const content = req.body.content
  try {
    // Checks if header comes from simulator
    const header = req.headers.authorization
    if (!isSimulator(header)) {
      res.status(403).send({ status: 403, error_msg: 'You are not authorized to use this resource!' })
      return
    }
    // Updates Latest
    const latest = req.query.latest
    if (latest !== undefined && !isNaN(parseInt(latest))) {
      latestService.updateLatest(parseInt(latest))
    }

    const users = await getAllUsers()
    const userSelected = users.find(user => user.username === username)
    if (userSelected === undefined) {
      res.status(404).send({ status: 404, error_msg: 'User is not on our database' })
    }
    const userId = userSelected.user_id

    const body = {
      author_id: userId,
      text: content,
      pub_date: Date.now(),
      flagged: 0
    }
    database.add('message', body, function (lasdId, err) {
      if (err) {
        console.error(err.message)
      } else {
        console.log('New message added successfully with id: ' + lasdId)
        res.status(204).send('')
      }
    })
  } catch (error) {
    console.log('error', error)
  }
})

router.get('/fllws/:username', async function (req, res, next) {
  const username = req.params.username
  try {
    // Checks if header comes from simulator
    const header = req.headers.authorization
    if (!isSimulator(header)) {
      res.status(403).send({ status: 403, error_msg: 'You are not authorized to use this resource!' })
      return
    }
    // Updates Latest
    const latest = req.query.latest
    if (latest !== undefined && !isNaN(parseInt(latest))) {
      latestService.updateLatest(parseInt(latest))
    }

    const users = await getAllUsers()
    const userSelected = users.find(user => user.username === username)
    if (!userSelected) {
      res.status(404).send({ status: 404, error_msg: 'User is not on our database' })
      return
    }
    const userId = userSelected.user_id

    const query = `SELECT user.username FROM user
                   INNER JOIN follower ON follower.whom_id=user.user_id
                   WHERE follower.who_id=?
                   LIMIT ?`

    const noFollowers = parseInt(req.query.no) || 100
    database.all(query, [userId, noFollowers], (err, rows) => {
      if (err) {
        console.error(err)
        res.status(500).send({ status: 500, error_msg: 'Internal Server Error' })
        return
      }
      const filteredFllws = []
      for (const fllw of rows) {
        filteredFllws.push(fllw.username)
      }
      const response = { follows: filteredFllws }
      res.send(response)
    })
  } catch (error) {
    console.log('error', error)
    res.status(500).send({ status: 500, error_msg: 'Internal Server Error' })
  }
})

router.post('/fllws/:username', async function (req, res, next) {
  const username = req.params.username
  try {
    // Checks if header comes from simulator
    const header = req.headers.authorization
    if (!isSimulator(header)) {
      res.status(403).send({ status: 403, error_msg: 'You are not authorized to use this resource!' })
      return
    }

    // Updates Latest
    const latest = req.query.latest
    if (latest !== undefined && !isNaN(parseInt(latest))) {
      latestService.updateLatest(parseInt(latest))
    }

    const users = await getAllUsers()
    const userSelected = users.find(user => user.username === username)
    if (!userSelected) {
      res.status(404).send({ status: 404, error_msg: 'User is not on our database' })
      return
    }
    const userId = userSelected.user_id

    if (req.body.follow) {
      const followUsername = req.body.follow
      const followsUser = users.find(user => user.username === followUsername)
      if (!followsUser) {
        res.status(404).send({ status: 404, error_msg: 'Follows user is not on our database' })
        return
      }

      const userFollowsList = await getFollowersFromUser(userId, null)
      if (userFollowsList.includes(followsUser.username)) {
        res.status(403).send({ status: 403, error_msg: 'User already follows this user' })
        return
      }

      const followsUserId = followsUser.user_id
      const query = 'INSERT INTO follower (who_id, whom_id) values (?, ?)'

      database.run(query, [userId, followsUserId], function (result, err) {
        if (err) {
          console.error(err)
          res.status(500).send({ status: 500, error_msg: err })
          return
        }
        res.status(204).send('')
      })
    } else if (req.body.unfollow) {
      const unfollowUsername = req.body.unfollow
      const unfollowsUser = users.find(user => user.username === unfollowUsername)
      if (!unfollowsUser) {
        res.status(404).send({ status: 404, error_msg: 'Unfollows user is not on our database' })
        return
      }
      const unfollowsUserId = unfollowsUser.user_id

      // Validates if user is following the unfollows user
      const userFollowsList = await getFollowersFromUser(userId, null)
      if (!userFollowsList.includes(unfollowsUser.username)) {
        res.status(403).send({ status: 403, error_msg: 'User is not following the user with name ' + unfollowsUser.username })
        return
      }

      const query = 'DELETE FROM follower WHERE who_id=? and whom_id=?'
      database.run(query, [userId, unfollowsUserId], function (result, err) {
        if (err) {
          console.error(err)
          res.status(500).send({ status: 500, error_msg: err })
          return
        }
        res.status(204).send('')
      })
    } else {
      res.status(400).send({ status: 400, error_msg: 'Invalid request body' })
    }
  } catch (error) {
    console.log('error', error)
    res.status(500).send({ status: 500, error_msg: error })
  }
})

module.exports = router
