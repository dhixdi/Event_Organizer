const { Joi } = require('./commonSchemas');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
  role: Joi.string().valid('staf').default('staf'),
  divisi: Joi.string().max(50).allow(null, ''),
  phone: Joi.string().max(20).allow(null, ''),
  avatar_url: Joi.string().uri().allow(null, ''),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
};
