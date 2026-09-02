const Joi = require('joi');

const createSchema = Joi.object({
  organizationId: Joi.string().required(),
  name: Joi.string().required(),
  code: Joi.string().required(),
  phone: Joi.string(),
  email: Joi.string().email(),
  address: Joi.string(),
  province: Joi.string(),
  district: Joi.string(),
  municipality: Joi.string(),
});

const updateSchema = Joi.object({
  name: Joi.string(),
  code: Joi.string(),
  phone: Joi.string(),
  email: Joi.string().email(),
  address: Joi.string(),
  province: Joi.string(),
  district: Joi.string(),
  municipality: Joi.string(),
  isActive: Joi.boolean(),
});

module.exports = { create: createSchema, update: updateSchema };
