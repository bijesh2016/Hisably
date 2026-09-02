const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const inventoryService = require('./inventory.service');

/**
 * @swagger
 * /api/v1/inventory:
 *   post:
 *     summary: Create a new inventory record
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - warehouseId
 *               - productId
 *               - quantity
 *             properties:
 *               warehouseId:
 *                 type: string
 *               productId:
 *                 type: string
 *               variantId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Inventory record created successfully
 *       401:
 *         description: Unauthorized
 */
const create = asyncHandler(async (req, res) => {
  const inventory = await inventoryService.create(req.body);
  res.status(201).json(ApiResponse.created(inventory, 'Inventory record created successfully'));
});

/**
 * @swagger
 * /api/v1/inventory:
 *   get:
 *     summary: Get all inventory records
 *     tags: [Inventory]
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
 *         name: warehouseId
 *         schema:
 *           type: string
 *         description: Filter by warehouse
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *         description: Filter by product
 *     responses:
 *       200:
 *         description: Inventory records retrieved successfully
 *       401:
 *         description: Unauthorized
 */
const getAll = asyncHandler(async (req, res) => {
  const result = await inventoryService.getAll(req.query);
  res.status(200).json(ApiResponse.success(result));
});

/**
 * @swagger
 * /api/v1/inventory/{id}:
 *   get:
 *     summary: Get inventory record by ID
 *     tags: [Inventory]
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
 *         description: Inventory record retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Inventory record not found
 */
const getById = asyncHandler(async (req, res) => {
  const inventory = await inventoryService.getById(req.params.id);
  res.status(200).json(ApiResponse.success(inventory));
});

/**
 * @swagger
 * /api/v1/inventory/{id}:
 *   patch:
 *     summary: Update inventory record
 *     tags: [Inventory]
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
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Inventory updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Inventory record not found
 */
const update = asyncHandler(async (req, res) => {
  const inventory = await inventoryService.update(req.params.id, req.body);
  res.status(200).json(ApiResponse.success(inventory, 'Inventory updated successfully'));
});

/**
 * @swagger
 * /api/v1/inventory/{id}:
 *   delete:
 *     summary: Delete inventory record
 *     tags: [Inventory]
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
 *         description: Inventory deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Inventory record not found
 */
const remove = asyncHandler(async (req, res) => {
  await inventoryService.remove(req.params.id);
  res.status(200).json(ApiResponse.success(null, 'Inventory deleted successfully'));
});

module.exports = { create, getAll, getById, update, remove };
