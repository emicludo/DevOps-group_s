const winston = require('winston')
const { ElasticsearchTransport } = require('winston-elasticsearch');
const ecsFormat = require('@elastic/ecs-winston-format')

const esTransport = new ElasticsearchTransport({
  level: 'info',
  index: 'minitwit-logs',
  clientOpts: { node: 'http://104.248.16.95:9200' },
});


const logger = winston.createLogger({
  level: 'info',
  format: ecsFormat(), 
  transports: [
    new winston.transports.File({ filename: 'errors.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log', level: 'info'  }),
    //new winston.transports.Console(),
    //esTransport,
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
/* if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
    format: winston.format.simple(),
  }));
} */

module.exports = logger;