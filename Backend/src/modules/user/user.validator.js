const Joi = require('joi');

const updateProfileSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string().allow('', null),
  phone: Joi.string().allow('', null),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});

const updateUserSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string().allow('', null),
  phone: Joi.string().allow('', null),
  isActive: Joi.boolean(),
});

module.exports = {
  updateProfile: updateProfileSchema,
  changePassword: changePasswordSchema,
  updateUser: updateUserSchema,
};
