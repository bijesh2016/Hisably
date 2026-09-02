const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const warehouseService = require('./warehouse.service');

/**
 * @swagger
 * /api/v1/warehouses:
 *   post:
 *     summary: Create a new warehouse
 *     tags: [Warehouses]
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
 *               - branchId
 *               - name
 *               - code
 *             properties:
 *               organizationId:
 *                 type: string
 *               branchId:
 *                 type: string
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Warehouse created successfully
 *       401:
 *         description: Unauthorized
 */
const create = asyncHandler(async (req, res) => {
  const warehouse = await warehouseService.create(req.body);
  res.status(201).json(ApiResponse.created(warehouse, 'Warehouse created successfully'));
});

/**
 * @swagger
 * /api/v1/warehouses:
 *   get:
 *     summary: Get all warehouses
 *     tags: [Warehouses]
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
 *       - in: query
 *         name: branchId
 *         schema:
 *           type: string
 *         description: Filter by branch
 *     responses:
 *       200:
 *         description: Warehouses retrieved successfully
 *       401:
 *         description: Unauthorized
 */
const getAll = asyncHandler(async (req, res) => {
  const result = await warehouseService.getAll(req.query);
  res.status(200).json(ApiResponse.success(result));
});

/**
 * @swagger
 * /api/v1/warehouses/{id}:
 *   get:
 *     summary: Get warehouse by ID
 *     tags: [Warehouses]
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
 *         description: Warehouse retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Warehouse not found
 */
const getById = asyncHandler(async (req, res) => {
  const warehouse = await warehouseService.getById(req.params.id);
  res.status(200).json(ApiResponse.success(warehouse));
});

/**
 * @swagger
 * /api/v1/warehouses/{id}:
 *   patch:
 *     summary: Update warehouse
 *     tags: [Warehouses]
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
 *               address:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Warehouse updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Warehouse not found
 */
const update = asyncHandler(async (req, res) => {
  const warehouse = await warehouseService.update(req.params.id, req.body);
  res.status(200).json(ApiResponse.success(warehouse, 'Warehouse updated successfully'));
});

/**
 * @swagger
 * /api/v1/warehouses/{id}:
 *   delete:
 *     summary: Delete warehouse
 *     tags: [Warehouses]
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
 *         description: Warehouse deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Warehouse not found
 */
const remove = asyncHandler(async (req, res) => {
  await warehouseService.remove(req.params.id);
  res.status(200).json(ApiResponse.success(null, 'Warehouse deleted successfully'));
});

module.exports = { create, getAll, getById, update, remove };
