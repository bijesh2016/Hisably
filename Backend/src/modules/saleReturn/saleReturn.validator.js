const Joi = require('joi');

const createSchema = Joi.object({
  organizationId: Joi.string().required(),
  saleId: Joi.string().required(),
  customerId: Joi.string().allow(null, ''),
  branchId: Joi.string().required(),
  warehouseId: Joi.string().required(),
  returnNumber: Joi.string().required(),
  returnDate: Joi.date().iso().allow(null),
  status: Joi.string().valid('DRAFT', 'COMPLETED', 'CANCELLED').default('DRAFT'),
  subtotal: Joi.number().default(0),
  discount: Joi.number().default(0),
  taxAmount: Joi.number().default(0),
  totalAmount: Joi.number().required(),
  notes: Joi.string().allow(null, ''),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        variantId: Joi.string().allow(null, ''),
        quantity: Joi.number().positive().required(),
        unitPrice: Joi.number().positive().required(),
        discount: Joi.number().default(0),
        taxRate: Joi.number().default(0),
        taxAmount: Joi.number().default(0),
        totalAmount: Joi.number().required(),
      })
    )
    .min(1)
    .required(),
});

const updateSchema = Joi.object({
  status: Joi.string().valid('DRAFT', 'COMPLETED', 'CANCELLED'),
  notes: Joi.string().allow(null, ''),
});

module.exports = { create: createSchema, update: updateSchema };
