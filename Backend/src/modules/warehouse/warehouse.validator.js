const Joi = require('joi');

const createSchema = Joi.object({
  organizationId: Joi.string().required(),
  branchId: Joi.string().required(),
  name: Joi.string().required(),
  code: Joi.string().required(),
  address: Joi.string(),
});

const updateSchema = Joi.object({
  name: Joi.string(),
  code: Joi.string(),
  address: Joi.string(),
  isActive: Joi.boolean(),
});

module.exports = { create: createSchema, update: updateSchema };
