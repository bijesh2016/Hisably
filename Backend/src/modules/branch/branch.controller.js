const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const branchService = require('./branch.service');

/**
 * @swagger
 * /api/v1/branches:
 *   post:
 *     summary: Create a new branch
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - organizationId
 *               - name
 *               - code
 *             properties:
 *               organizationId:
 *                 type: string
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               address:
 *                 type: string
 *               province:
 *                 type: string
 *               district:
 *                 type: string
 *               municipality:
 *                 type: string
 *     responses:
 *       201:
 *         description: Branch created successfully
 *       401:
 *         description: Unauthorized
 */
const create = asyncHandler(async (req, res) => {
  const branch = await branchService.create(req.body);
  res.status(201).json(ApiResponse.created(branch, 'Branch created successfully'));
});

/**
 * @swagger
 * /api/v1/branches:
 *   get:
 *     summary: Get all branches
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: organizationId
 *         schema:
 *           type: string
 *         description: Filter by organization
 *     responses:
 *       200:
 *         description: Branches retrieved successfully
 *       401:
 *         description: Unauthorized
 */
const getAll = asyncHandler(async (req, res) => {
  const result = await branchService.getAll(req.query);
  res.status(200).json(ApiResponse.success(result));
});

/**
 * @swagger
 * /api/v1/branches/{id}:
 *   get:
 *     summary: Get branch by ID
 *     tags: [Branches]
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
 *         description: Branch retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Branch not found
 */
const getById = asyncHandler(async (req, res) => {
  const branch = await branchService.getById(req.params.id);
  res.status(200).json(ApiResponse.success(branch));
});

/**
 * @swagger
 * /api/v1/branches/{id}:
 *   patch:
 *     summary: Update branch
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               address:
 *                 type: string
 *               province:
 *                 type: string
 *               district:
 *                 type: string
 *               municipality:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Branch updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Branch not found
 */
const update = asyncHandler(async (req, res) => {
  const branch = await branchService.update(req.params.id, req.body);
  res.status(200).json(ApiResponse.success(branch, 'Branch updated successfully'));
});

/**
 * @swagger
 * /api/v1/branches/{id}:
 *   delete:
 *     summary: Delete branch
 *     tags: [Branches]
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
 *         description: Branch deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Branch not found
 */
const remove = asyncHandler(async (req, res) => {
  await branchService.remove(req.params.id);
  res.status(200).json(ApiResponse.success(null, 'Branch deleted successfully'));
});

module.exports = { create, getAll, getById, update, remove };
