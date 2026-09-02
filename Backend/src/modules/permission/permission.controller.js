const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const permissionService = require('./permission.service');

/**
 * @swagger
 * /api/v1/permissions:
 *   get:
 *     summary: Get all permissions
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Permissions retrieved successfully
 *       401:
 *         description: Unauthorized
 */
const getAll = asyncHandler(async (req, res) => {
  const permissions = await permissionService.getAll();
  res.status(200).json(ApiResponse.success(permissions));
});

/**
 * @swagger
 * /api/v1/permissions/{id}:
 *   get:
 *     summary: Get permission by ID
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Permission retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Permission not found
 */
const getById = asyncHandler(async (req, res) => {
  const permission = await permissionService.getById(req.params.id);
  res.status(200).json(ApiResponse.success(permission));
});

module.exports = { getAll, getById };
