const Joi = require('joi');

const createSchema = Joi.object({
  organizationId: Joi.string().required(),
  name: Joi.string().required(),
  abbreviation: Joi.string().required(),
  description: Joi.string(),
});

const updateSchema = Joi.object({
  name: Joi.string(),
  abbreviation: Joi.string(),
  description: Joi.string(),
});

module.exports = { create: createSchema, update: updateSchema };
