const { authenticate, optionalAuth } = require('./auth.middleware');
const { authorize, isAdmin, isManager, isStaff } = require('./roleAccess.middleware');
const { requirePermission } = require('./permission.middleware');
const { validate, validateQuery, validateParams } = require('./validator.middleware');
const { errorHandler, notFoundHandler } = require('./error.middleware');
const notFound = require('./notFound.middleware');
const { createRateLimiter, authLimiter, apiLimiter } = require('./rateLimit.middleware');
const { upload, uploadSingle, uploadMultiple } = require('./upload.middleware');

module.exports = {
  authenticate,
  optionalAuth,
  authorize,
  isAdmin,
  isManager,
  isStaff,
  requirePermission,
  validate,
  validateQuery,
  validateParams,
  errorHandler,
  notFoundHandler,
  notFound,
  createRateLimiter,
  authLimiter,
  apiLimiter,
  upload,
  uploadSingle,
  uploadMultiple,
};
