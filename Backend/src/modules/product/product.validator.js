const Joi = require('joi');

const createSchema = Joi.object({
  organizationId: Joi.string().required(),
  categoryId: Joi.string(),
  brandId: Joi.string(),
  unitId: Joi.string().required(),
  name: Joi.string().required(),
  sku: Joi.string(),
  barcode: Joi.string(),
  description: Joi.string(),
  productType: Joi.string(),
  costPrice: Joi.number().required(),
  sellingPrice: Joi.number().required(),
  taxRate: Joi.number(),
  trackInventory: Joi.boolean(),
  trackSerial: Joi.boolean(),
  minStock: Joi.number(),
  maxStock: Joi.number(),
});

const updateSchema = Joi.object({
  categoryId: Joi.string(),
  brandId: Joi.string(),
  unitId: Joi.string(),
  name: Joi.string(),
  sku: Joi.string(),
  barcode: Joi.string(),
  description: Joi.string(),
  productType: Joi.string(),
  costPrice: Joi.number(),
  sellingPrice: Joi.number(),
  taxRate: Joi.number(),
  trackInventory: Joi.boolean(),
  trackSerial: Joi.boolean(),
  minStock: Joi.number(),
  maxStock: Joi.number(),
  isActive: Joi.boolean(),
});

module.exports = { create: createSchema, update: updateSchema };
