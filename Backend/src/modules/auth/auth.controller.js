const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const authService = require('./auth.service');

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json(ApiResponse.created(result, 'User registered successfully'));
});

const registerShop = asyncHandler(async (req, res) => {
  const result = await authService.registerShop(req.body);
  res.status(201).json(ApiResponse.created(result, 'Shop registration submitted! Pending Super Admin approval.'));
});

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.status(200).json(ApiResponse.success(result, 'Login successful'));
});

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user);
  res.status(200).json(ApiResponse.success(null, 'Logout successful'));
});

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid refresh token
 */
const refreshToken = asyncHandler(async (req, res) => {
  const result = await authService.refreshToken(req.body);
  res.status(200).json(ApiResponse.success(result, 'Token refreshed successfully'));
});

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: User not found
 */
const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body);
  res.status(200).json(ApiResponse.success(null, 'Password reset email sent'));
});

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Reset password with token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */
const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body);
  res.status(200).json(ApiResponse.success(null, 'Password reset successful'));
});

/**
 * @swagger
 * /api/v1/auth/verify-email:
 *   post:
 *     summary: Verify email with token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid verification token
 */
const verifyEmail = asyncHandler(async (req, res) => {
  await authService.verifyEmail(req.body);
  res.status(200).json(ApiResponse.success(null, 'Email verified successfully'));
});

const getMe = asyncHandler(async (req, res) => {
  const result = await authService.getMe(req.user.id);
  res.status(200).json(ApiResponse.success(result, 'Current user profile'));
});

module.exports = {
  register,
  registerShop,
  login,
  getMe,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
