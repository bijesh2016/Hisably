const Joi = require('joi');

const createSchema = Joi.object({
  organizationId: Joi.string().required(),
  customerId: Joi.string().allow(null),
  branchId: Joi.string().required(),
  warehouseId: Joi.string().required(),
  saleNumber: Joi.string().required(),
  saleDate: Joi.date(),
  status: Joi.string(),
  paymentStatus: Joi.string(),
  subtotal: Joi.number(),
  discount: Joi.number(),
  taxAmount: Joi.number(),
  totalAmount: Joi.number(),
  paidAmount: Joi.number(),
  dueAmount: Joi.number(),
  notes: Joi.string(),
});

const updateSchema = Joi.object({
  status: Joi.string(),
  paymentStatus: Joi.string(),
  subtotal: Joi.number(),
  discount: Joi.number(),
  taxAmount: Joi.number(),
  totalAmount: Joi.number(),
  paidAmount: Joi.number(),
  dueAmount: Joi.number(),
  notes: Joi.string(),
});

module.exports = { create: createSchema, update: updateSchema };
