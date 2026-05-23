const { Joi } = require('./commonSchemas');

const userUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  phone: Joi.string().max(20).allow(null, ''),
  avatar_url: Joi.string().uri().allow(null, ''),
  divisi: Joi.string().max(50).allow(null, ''),
  is_active: Joi.boolean(),
}).min(1);

const userRoleUpdateSchema = Joi.object({
  role: Joi.string().valid('admin', 'ketua', 'staf').required(),
});

module.exports = {
  userUpdateSchema,
  userRoleUpdateSchema,
};
