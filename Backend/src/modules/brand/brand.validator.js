const Joi = require('joi');

const createSchema = Joi.object({
  organizationId: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().allow(null, ''),
  isActive: Joi.boolean().default(true),
});

const updateSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string().allow(null, ''),
  isActive: Joi.boolean(),
});

module.exports = { create: createSchema, update: updateSchema };
