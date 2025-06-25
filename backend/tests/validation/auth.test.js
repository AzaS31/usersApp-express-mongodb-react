const jwt = require('jsonwebtoken');
const { requireAuth } = require('../../validation/auth');

describe('requireAuth middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  test('should call next with error if no authorization header', () => {
    requireAuth(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 401,
        message: 'Токен не предоставлен',
      })
    );
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('should call next with error if token is invalid', () => {
    req.headers.authorization = 'Bearer invalid-token';

    requireAuth(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 401,
        message: 'Неверный токен',
      })
    );
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('should call next and set req.userId if token is valid', () => {
    const payload = { userId: 'test-user' };
    const token = jwt.sign(payload, 'secret_key', { expiresIn: '1h' });
    req.headers.authorization = `Bearer ${token}`;

    requireAuth(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.userId).toBe('test-user');
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});