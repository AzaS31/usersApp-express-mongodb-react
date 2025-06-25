const { checkParams, checkBody } = require('../../validation/validator');
const Joi = require('joi');

describe('Validation middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  describe('checkParams', () => {
    const schema = Joi.object({
      id: Joi.string().length(24).hex().required(),
    });

    test('should call next if params are valid', () => {
      req.params = { id: '0123456789abcdef01234567' };
      const middleware = checkParams(schema);

      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    test('should call next with error if params are invalid', () => {
      req.params = { id: 'invalid-id' };
      const middleware = checkParams(schema);

      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 400,
          message: expect.any(String),
        })
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('checkBody', () => {
    const schema = Joi.object({
      firstName: Joi.string().min(3).required(),
    });

    test('should call next if body is valid', () => {
      req.body = { firstName: 'John' };
      const middleware = checkBody(schema);

      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    test('should call next with error if body is invalid', () => {
      req.body = { firstName: 'Jo' }; // too short, min 3 chars
      const middleware = checkBody(schema);

      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 400,
          message: expect.any(String),
        })
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});