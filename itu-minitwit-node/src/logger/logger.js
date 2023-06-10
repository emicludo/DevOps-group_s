const winston = require('winston')
const ecsFormat = require('@elastic/ecs-winston-format')

const logger = winston.createLogger({
  level: 'info',
  format: ecsFormat(), 
  transports: [
    new winston.transports.File({ filename: '/var/log/minitwit/errors.log', level: 'error' }),
    new winston.transports.File({ filename: '/var/log/minitwit/combined.log', level: 'info'  }),
  ],
});

module.exports = logger;