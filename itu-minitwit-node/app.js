const createError = require('http-errors')
const express = require('express')
const session = require('express-session')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

// Routing
const indexRouter = require('./src/routes/index')
const messageRouter = require('./src/routes/message')
const followRouter = require('./src/routes/follow')
const unfollowRouter = require('./src/routes/unfollow')
const signupRouter = require('./src/routes/signup')
const signinRouter = require('./src/routes/signin')
const signoutRouter = require('./src/routes/signout')
/* var userRouter = require('./src/routes/user'); */
// Simulator routing
const simulatorRouter = require('./src/routes/simulator')

const app = express()

app.use(session({
  secret: 'c2b71086dd6ba3b83431e00118d52c0fd2f178f439910fe7bf7e86a2a163e26f83932fac1f908015d7815bf0a817914e38ee56d904888337bff57c91c76ae8b1',
  resave: false,
  saveUninitialized: false
}))

// view engine setup
app.set('views', path.join(__dirname, '/src/views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/message', messageRouter)
app.use('/api/follow', followRouter)
app.use('/api/unfollow', unfollowRouter)
app.use('/api/signup', signupRouter)
app.use('/api/signin', signinRouter)
app.use('/api/signout', signoutRouter)
app.use('/api/', indexRouter)
/* app.use('/api/users', userRouter); */
app.use('/', simulatorRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  // res.status(err.status || 500);
  // res.render('error');
})

module.exports = app
