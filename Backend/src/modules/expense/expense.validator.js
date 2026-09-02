const Joi = require('joi');

const createSchema = Joi.object({
  organizationId: Joi.string().required(),
  branchId: Joi.string().allow(null, ''),
  categoryId: Joi.string().allow(null, ''),
  title: Joi.string().required(),
  amount: Joi.number().positive().required(),
  expenseDate: Joi.date().iso().allow(null),
  paymentMethod: Joi.string().valid('CASH', 'BANK_TRANSFER', 'CONNECT_IPS', 'ESEWA', 'KHALTI', 'IME_PAY', 'QR', 'CARD', 'CREDIT', 'OTHER').default('CASH'),
  status: Joi.string().valid('PENDING', 'APPROVED', 'REJECTED').default('APPROVED'),
  receiptUrl: Joi.string().allow(null, ''),
  notes: Joi.string().allow(null, ''),
});

const updateSchema = Joi.object({
  branchId: Joi.string().allow(null, ''),
  categoryId: Joi.string().allow(null, ''),
  title: Joi.string(),
  amount: Joi.number().positive(),
  expenseDate: Joi.date().iso(),
  paymentMethod: Joi.string().valid('CASH', 'BANK_TRANSFER', 'CONNECT_IPS', 'ESEWA', 'KHALTI', 'IME_PAY', 'QR', 'CARD', 'CREDIT', 'OTHER'),
  status: Joi.string().valid('PENDING', 'APPROVED', 'REJECTED'),
  receiptUrl: Joi.string().allow(null, ''),
  notes: Joi.string().allow(null, ''),
});

module.exports = { create: createSchema, update: updateSchema };
