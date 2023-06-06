var helmet = require('helmet');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
const url = require('url');
const sessionStore = require('./src/db/session');
const database = require('./src/db/dbService')
// simulated change
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

var app = express();

app.use(session({
	key: 'minitwit_session',
	secret: 'secret',
	store: sessionStore,
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
app.use(helmet());

// Middleware to measure the duration of the request
const measureDurationMiddleware = (req, res, next) => {
  // Start the timer
  const end = httpRequestDurationMicroseconds.startTimer();
  // Remove parameters from the path
  const parsedUrl = url.parse(req.path);
  const route = "/" + parsedUrl.pathname.split('/')[1] + "/";
  // Attach the `end` function to the `res` object so that it can be called later
  res.on('finish', () => {
    // End the timer and set the labels
    end({ route: route, code: res.statusCode, method: req.method });
  });
  // Call the next middleware in the chain
  next();
};
app.use(measureDurationMiddleware);

//Http requests Counter and up Gauge:
app.use(async (req, res, next) => {
  const parsedUrl = url.parse(req.originalUrl);
  const route = "/" + parsedUrl.pathname.split('/')[1] + "/";
  httpRequestCounter.inc({ method: req.method, status: res.statusCode, endpoint: route });
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

// catch 404 and forward to error handler
app.use(function (req, res) {
  res.status(404).json({ error: 'Not found' });
});

// Error handling middleware for other errors
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // Handle specific error types
  if (err instanceof Error) {
    // Custom error handling logic
    res.status(err.status || 500).json({ error: err.message });
    httpRequestErrorCounter.inc();
    const parsedUrl = url.parse(req.originalUrl);
    const route = "/" + parsedUrl.pathname.split('/')[1] + "/";
    httpErrorCodeCounter.labels(req.status, route).inc();
    return;
  } else {
    // Default error handling
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = app;