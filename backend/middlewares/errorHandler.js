const logger = require('../logs/logger');

function errorHandler(err, req, res, next) {
  if (logger.transports && logger.transports.length > 0) {
    logger.error(`[${req.method} ${req.url}] ${err.message}\n${err.stack || ''}`);
  }

  const status = err.status && Number.isInteger(err.status) ? err.status : 500;
  res.status(status).json({ error: err.message || 'Внутренняя ошибка сервера' });
}

module.exports = errorHandler;
