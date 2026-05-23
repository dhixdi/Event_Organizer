const Joi = require('joi');

const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const eventIdParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const paginationQuerySchema = Joi.object({
  page: Joi.number().integer().positive(),
  per_page: Joi.number().integer().positive().max(100),
});

module.exports = {
  Joi,
  idParamSchema,
  eventIdParamSchema,
  paginationQuerySchema,
};
