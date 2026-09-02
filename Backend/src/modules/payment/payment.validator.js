const Joi = require('joi');

const createSchema = Joi.object({
  organizationId: Joi.string().required(),
  branchId: Joi.string().allow(null, ''),
  type: Joi.string().valid('INCOMING', 'OUTGOING').default('INCOMING'),
  amount: Joi.number().positive().required(),
  method: Joi.string().valid('CASH', 'BANK_TRANSFER', 'CONNECT_IPS', 'ESEWA', 'KHALTI', 'IME_PAY', 'QR', 'CARD', 'CREDIT', 'OTHER').default('CASH'),
  reference: Joi.string().allow(null, ''),
  status: Joi.string().valid('PENDING', 'COMPLETED', 'FAILED').default('COMPLETED'),
  paymentDate: Joi.date().iso().allow(null),
  notes: Joi.string().allow(null, ''),
});

const updateSchema = Joi.object({
  branchId: Joi.string().allow(null, ''),
  type: Joi.string().valid('INCOMING', 'OUTGOING'),
  amount: Joi.number().positive(),
  method: Joi.string().valid('CASH', 'BANK_TRANSFER', 'CONNECT_IPS', 'ESEWA', 'KHALTI', 'IME_PAY', 'QR', 'CARD', 'CREDIT', 'OTHER'),
  reference: Joi.string().allow(null, ''),
  status: Joi.string().valid('PENDING', 'COMPLETED', 'FAILED'),
  paymentDate: Joi.date().iso(),
  notes: Joi.string().allow(null, ''),
});

module.exports = { create: createSchema, update: updateSchema };
