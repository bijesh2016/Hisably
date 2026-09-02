const Joi = require('joi');

const createSchema = Joi.object({
  warehouseId: Joi.string().required(),
  productId: Joi.string().required(),
  variantId: Joi.string(),
  quantity: Joi.number().required(),
});

const updateSchema = Joi.object({
  quantity: Joi.number(),
});

module.exports = { create: createSchema, update: updateSchema };
