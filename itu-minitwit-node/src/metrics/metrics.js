const { Registry, collectDefaultMetrics, Histogram, Gauge, Counter } = require('prom-client');

// Create a Registry which registers the metrics
const register = new Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'minitwit-app',
});

// Enable the collection of default metrics
collectDefaultMetrics({
  app: 'minitwit-monitoring-app',
  prefix: 'minitwit_node_',
  timeout: 10000,
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
  register
});

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

// Prometheus gauge to track the up status
const upMetric = new Gauge({
  name: 'up',
  help: '1 if the service is up, 0 if the service is down',
  labelNames: ['app'],
});
// Set the value of the up metric to 1 when the service is up
upMetric.set({ app: 'minitwit-app' }, 0);

// Prometheus gauge to track the health status of the MySQL database
const mysqlHealthGauge = new prometheus.Gauge({
  name: 'mysql_health',
  help: '1 if MySQL database is healthy, 0 otherwise',
});

// Registers the histograms and counters
register.registerMetric(queryDurationHistogram);
register.registerMetric(queryErrorCounter);
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(httpRequestCounter);
register.registerMetric(httpRequestErrorCounter);
register.registerMetric(httpErrorCodeCounter);
register.registerMetric(upMetric);
register.registerMetric(mysqlHealthGauge);

module.exports = {
  register,
  httpRequestDurationMicroseconds,
  httpRequestCounter,
  httpRequestErrorCounter,
  queryDurationHistogram,
  queryErrorCounter,
  httpErrorCodeCounter,
  upMetric,
  mysqlHealthGauge
};