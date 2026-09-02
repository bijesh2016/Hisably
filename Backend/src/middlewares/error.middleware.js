const { httpStatus } = require('../config/constant');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, error.errors);
  }

  error.statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    ...(error.errors && { errors: error.errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  };

  // Log error
  logger.error({
    message: error.message,
    statusCode: error.statusCode,
    url: req.url,
    method: req.method,
    ip: req.ip,
    stack: error.stack,
  });

  res.status(error.statusCode).json(response);
};

const notFoundHandler = (req, res, next) => {
  const error = new ApiError(httpStatus.NOT_FOUND, `Route ${req.originalUrl} not found`);
  next(error);
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
