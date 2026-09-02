const { httpStatus } = require('../config/constant');
const ApiError = require('../utils/ApiError');

const notFound = (req, res, next) => {
  const error = new ApiError(httpStatus.NOT_FOUND, `Route ${req.originalUrl} not found`);
  next(error);
};

module.exports = notFound;
