var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');

//Routers
var indexRouter = require('./src/routes/index');
var messageRouter = require('./src/routes/message');
var followRouter = require('./src/routes/follow');
var unfollowRouter = require('./src/routes/unfollow');
var signupRouter = require('./src/routes/signup');
var signinRouter = require('./src/routes/signin');
var signoutRouter = require('./src/routes/signout');
var simulatorRouter = require('./src/routes/simulator');

//Prometheus metrics import
const { register, 
        httpRequestDurationMicroseconds,
        httpRequestCounter, 
        httpRequestErrorCounter, 
        httpErrorCodeCounter,
        upMetric
      } = require('./src/metrics/metrics');

const database = require('./src/db/dbService')

var app = express();

//Express session configuration
app.use(session({
  secret: 'c2b71086dd6ba3b83431e00118d52c0fd2f178f439910fe7bf7e86a2a163e26f83932fac1f908015d7815bf0a817914e38ee56d904888337bff57c91c76ae8b1',
  resave: false,
  saveUninitialized: false
}));

// view engine setup
app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', 'jade');

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to measure the duration of the request
const measureDurationMiddleware = (req, res, next) => {
  // Start the timer
  const end = httpRequestDurationMicroseconds.startTimer();
  // Attach the `end` function to the `res` object so that it can be called later
  res.on('finish', () => {
    // End the timer and set the labels
    end({ route: req.path, code: res.statusCode, method: req.method });
  });
  // Call the next middleware in the chain
  next();
};
app.use(measureDurationMiddleware);

//Http requests Counter and up Gauge:
app.use(async (req, res, next) => {
  httpRequestCounter.inc({ method: req.method, status: res.statusCode });
  upMetric.set({ app: 'minitwit-app' }, 1);
  database.healthCheck();
  next();
});

//Routing configuration
app.use('/api/message', messageRouter);
app.use('/api/follow', followRouter);
app.use('/api/unfollow', unfollowRouter);
app.use('/api/signup', signupRouter);
app.use('/api/signin', signinRouter);
app.use('/api/signout', signoutRouter);
app.use('/api/', indexRouter);

//Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.send(await register.metrics());
});
//Simulator routing
app.use('/', simulatorRouter);

// Add middleware to catch errors and increment the counter
app.use((err, req, res, next) => {
  if (err) {
    httpRequestErrorCounter.inc();
    httpErrorCodeCounter.labels(res.statusCode.toString(), req.originalUrl).inc();
    res.status(res.statusCode).json({ error: err.message });
  }
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;