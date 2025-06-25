const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    const err = new Error('Токен не предоставлен');
    err.status = 401;
    return next(err);
  }
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (err) {
    err.status = 401;

    if (err.name === 'TokenExpiredError') {
      err.message = 'Токен истёк';
    } else {
      err.message = 'Неверный токен';
    }

    next(err);
  }
}

module.exports = { requireAuth };