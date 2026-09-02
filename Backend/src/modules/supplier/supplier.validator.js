const Joi = require('joi');

const createSchema = Joi.object({
  organizationId: Joi.string().required(),
  name: Joi.string().required(),
  supplierCode: Joi.string(),
  type: Joi.string(),
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
  supplierCode: Joi.string(),
  type: Joi.string(),
  phone: Joi.string(),
  email: Joi.string().email(),
  address: Joi.string(),
  province: Joi.string(),
  district: Joi.string(),
  municipality: Joi.string(),
  panNumber: Joi.string(),
  vatNumber: Joi.string(),
  status: Joi.string(),
});

module.exports = { create: createSchema, update: updateSchema };
