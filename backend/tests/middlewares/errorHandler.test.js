const request = require('supertest');
const express = require('express');
const errorHandler = require('../../middlewares/errorHandler'); 
const logger = require('../../logs/logger');

jest.mock('../../logs/logger');

describe('Error handler middleware', () => {
  const app = express();

  app.get('/error', (req, res, next) => {
    const err = new Error('Тестовая ошибка');
    err.status = 400;
    next(err);
  });

  // подключаем error handler последним
  app.use(errorHandler);

  it('должен возвращать статус и сообщение об ошибке', async () => {
    const res = await request(app).get('/error');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Тестовая ошибка' });

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('[GET /error] Тестовая ошибка')
    );
  });
});
