const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { validate, authenticate, authLimiter } = require('../../middlewares');
const authValidator = require('./auth.validator');

router.post('/register', validate(authValidator.register), authController.register);
router.post('/register-shop', authLimiter, authController.registerShop);
router.post('/login', authLimiter, validate(authValidator.login), authController.login);
router.get('/me', authenticate, authController.getMe);
router.post('/logout', authenticate, authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authLimiter, authController.forgotPassword);
router.post('/reset-password', validate(authValidator.resetPassword), authController.resetPassword);
router.post('/verify-email', authController.verifyEmail);

module.exports = router;
