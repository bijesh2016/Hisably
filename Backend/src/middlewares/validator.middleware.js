const { httpStatus } = require('../config/constant');
const ApiError = require('../utils/ApiError');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return next(new ApiError(httpStatus.BAD_REQUEST, 'Validation failed', errors));
    }

    next();
  };
};

const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return next(new ApiError(httpStatus.BAD_REQUEST, 'Query validation failed', errors));
    }

    next();
  };
};

const validateParams = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return next(new ApiError(httpStatus.BAD_REQUEST, 'Params validation failed', errors));
    }

    next();
  };
};

module.exports = {
  validate,
  validateQuery,
  validateParams,
};
