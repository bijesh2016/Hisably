const Joi = require('joi');

const createSchema = Joi.object({
  organizationId: Joi.string().required(),
  name: Joi.string().required(),
  customerCode: Joi.string(),
  type: Joi.string(),
  phone: Joi.string(),
  email: Joi.string().email(),
  address: Joi.string(),
  province: Joi.string(),
  district: Joi.string(),
  municipality: Joi.string(),
  panNumber: Joi.string(),
  vatNumber: Joi.string(),
  creditLimit: Joi.number(),
  creditDays: Joi.number(),
});

const updateSchema = Joi.object({
  name: Joi.string(),
  customerCode: Joi.string(),
  type: Joi.string(),
  phone: Joi.string(),
  email: Joi.string().email(),
  address: Joi.string(),
  province: Joi.string(),
  district: Joi.string(),
  municipality: Joi.string(),
  panNumber: Joi.string(),
  vatNumber: Joi.string(),
  creditLimit: Joi.number(),
  creditDays: Joi.number(),
  status: Joi.string(),
});

module.exports = { create: createSchema, update: updateSchema };
