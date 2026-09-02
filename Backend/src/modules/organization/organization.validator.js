const Joi = require('joi');

const createSchema = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().required(),
  businessType: Joi.string(),
  phone: Joi.string(),
  email: Joi.string().email(),
  address: Joi.string(),
  province: Joi.string(),
  district: Joi.string(),
  municipality: Joi.string(),
  panNumber: Joi.string(),
  vatNumber: Joi.string(),
});

const updateSchema = Joi.object({
  name: Joi.string(),
  slug: Joi.string(),
  businessType: Joi.string(),
  phone: Joi.string(),
  email: Joi.string().email(),
  address: Joi.string(),
  province: Joi.string(),
  district: Joi.string(),
  municipality: Joi.string(),
  panNumber: Joi.string(),
  vatNumber: Joi.string(),
  isActive: Joi.boolean(),
});

module.exports = { create: createSchema, update: updateSchema };
