const { createLogger, format, transports } = require('winston');

const isTestEnv = process.env.NODE_ENV === 'test';

const loggerTransports = [];

if (!isTestEnv) {
  loggerTransports.push(
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  );
}

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: loggerTransports,
});

module.exports = logger;
