const Joi = require('joi');

const createSchema = Joi.object({
  organizationId: Joi.string().required(),
  name: Joi.string().required(),
  abbreviation: Joi.string().required(),
  isActive: Joi.boolean().default(true),
});

const updateSchema = Joi.object({
  name: Joi.string(),
  abbreviation: Joi.string(),
  isActive: Joi.boolean(),
});

module.exports = { create: createSchema, update: updateSchema };
