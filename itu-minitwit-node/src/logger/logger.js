const winston = require('winston')
const ecsFormat = require('@elastic/ecs-winston-format')

const logger = winston.createLogger({
  level: 'info',
  format: ecsFormat(), 
  transports: [
    new winston.transports.File({ filename: '/app/logs/errors.log', level: 'error' }),
    new winston.transports.File({ filename: '/app/logs/combined.log', level: 'info'  }),
  ],
});


// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `

/* if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
    format: winston.format.simple(),
  }));
} */

module.exports = logger;