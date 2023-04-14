const { Registry, collectDefaultMetrics, Histogram, Counter } = require('prom-client');

// Create a Registry which registers the metrics
const register = new Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'minitwit-app',
});

// Enable the collection of default metrics
collectDefaultMetrics({ register });

// Histogram on duration of http requests
const httpRequestDurationMicroseconds = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in microseconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
});

//Prometheus counter to track the total number of HTTP requests
const httpRequestCounter = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'status']
});

// Prometheus counter to track HTTP error count
const httpErrorCodeCounter = new Counter({
  name: 'http_error_codes',
  help: 'HTTP error codes',
  labelNames: ['code', 'endpoint'],
});

//Prometheus counter to track the number of HTTP requests
const httpRequestErrorCounter = new Counter({
  name: 'http_error_requests_total',
  help: 'Total number of HTTP Error requests',
  labelNames: ['method', 'status']
});

// Histogram metric to track query duration
const queryDurationHistogram = new Histogram({
  name: 'mysql_query_duration_seconds',
  help: 'Duration of MySQL queries in seconds',
  labelNames: ['query'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 5, 10, 30, 60],
});

// Prometheus counter to track query errors
const queryErrorCounter = new Counter({
  name: 'mysql_query_errors_total',
  help: 'Total number of MySQL query errors',
  labelNames: ['query', 'error'],
});

// Registers the histograms and counters
register.registerMetric(queryDurationHistogram);
register.registerMetric(queryErrorCounter);
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(httpRequestCounter);
register.registerMetric(httpRequestErrorCounter);
register.registerMetric(httpErrorCodeCounter);

module.exports = {
  register,
  httpRequestDurationMicroseconds,
  httpRequestCounter,
  httpRequestErrorCounter,
  queryDurationHistogram,
  queryErrorCounter,
  httpErrorCodeCounter
};