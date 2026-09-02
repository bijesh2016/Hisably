const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100, message = 'Too many requests') => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message,
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

const authLimiter = createRateLimiter(15 * 60 * 1000, 5, 'Too many authentication attempts, please try again later');
const apiLimiter = createRateLimiter(15 * 60 * 1000, 100, 'Too many requests from this IP, please try again later');

module.exports = {
  createRateLimiter,
  authLimiter,
  apiLimiter,
};
