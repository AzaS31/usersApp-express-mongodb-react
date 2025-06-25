const Joi = require('joi');

const userScheme = Joi.object({
  firstName: Joi.string().min(3).required(),
  secondName: Joi.string().min(3).required(),
  age: Joi.number().integer().min(0).max(120).required(),
  city: Joi.string().min(3).required(),
  email: Joi.string().email().required(),  
  password: Joi.string().min(6).optional(), 
});

const loginScheme = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const idScheme = Joi.object({
  id: Joi.string().length(24).hex().required(),
});

module.exports = { userScheme, loginScheme, idScheme };
