var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
const url = require('url');

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

const MySQLStore = require('express-mysql-session')(session);
const sessionStore = new MySQLStore({
  expiration: 86400000, // session TTL in milliseconds
  createDatabaseTable: true, // if the sessions table should be created automatically
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  }
}, db.pool);

const options = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USERNAME || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  database: process.env.MYSQL_DATABASE || 'defaultdb',
  // Whether or not to automatically check for and clear expired sessions:
  clearExpired: true,
  // How frequently expired sessions will be cleared; milliseconds:
  checkExpirationInterval: 900000,
  // The maximum age of a valid session; milliseconds:
  expiration: 86400000,
  // Whether or not to create the sessions database table, if one does not already exist:
  createDatabaseTable: true,
  // Whether or not to end the database connection when the store is closed.
  // The default value of this option depends on whether or not a connection was passed to the constructor.
  // If a connection object is passed to the constructor, the default value for this option is false.
  endConnectionOnClose: true,
  // Whether or not to disable touch:
  disableTouch: false,
  charset: 'utf8mb4_bin',
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  }
};

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

// Add middleware to catch errors and increment the counter
app.use((err, req, res, next) => {
  if (err) {
    httpRequestErrorCounter.inc();
    const parsedUrl = url.parse(req.originalUrl);
    const route = "/" + parsedUrl.pathname.split('/')[1] + "/";
    httpErrorCodeCounter.labels(err.status, route).inc();
    res.status(res.statusCode).json({ error: err.message });
    return;
  }
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;