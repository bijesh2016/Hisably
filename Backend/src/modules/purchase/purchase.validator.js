const Joi = require('joi');

const createSchema = Joi.object({
  organizationId: Joi.string().required(),
  supplierId: Joi.string().required(),
  branchId: Joi.string().required(),
  warehouseId: Joi.string().required(),
  invoiceNumber: Joi.string().required(),
  purchaseDate: Joi.date(),
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
