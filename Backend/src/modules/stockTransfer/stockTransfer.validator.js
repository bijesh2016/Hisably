const Joi = require('joi');

const createSchema = Joi.object({
  organizationId: Joi.string().required(),
  fromWarehouseId: Joi.string().required(),
  toWarehouseId: Joi.string().required(),
  note: Joi.string().allow(null, ''),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        variantId: Joi.string().allow(null, ''),
        quantity: Joi.number().positive().required(),
      })
    )
    .min(1)
    .required(),
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED').required(),
  note: Joi.string().allow(null, ''),
});

module.exports = {
  create: createSchema,
  updateStatus: updateStatusSchema,
};
