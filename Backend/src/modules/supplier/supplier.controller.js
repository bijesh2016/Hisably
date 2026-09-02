const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const supplierService = require('./supplier.service');

/**
 * @swagger
 * /api/v1/suppliers:
 *   post:
 *     summary: Create a new supplier
 *     tags: [Suppliers]
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
 *             properties:
 *               organizationId:
 *                 type: string
 *               name:
 *                 type: string
 *               supplierCode:
 *                 type: string
 *               type:
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
 *               panNumber:
 *                 type: string
 *               vatNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Supplier created successfully
 *       401:
 *         description: Unauthorized
 */
const create = asyncHandler(async (req, res) => {
  const supplier = await supplierService.create(req.body);
  res.status(201).json(ApiResponse.created(supplier, 'Supplier created successfully'));
});

/**
 * @swagger
 * /api/v1/suppliers:
 *   get:
 *     summary: Get all suppliers
 *     tags: [Suppliers]
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
 *         description: Suppliers retrieved successfully
 *       401:
 *         description: Unauthorized
 */
const getAll = asyncHandler(async (req, res) => {
  const result = await supplierService.getAll(req.query);
  res.status(200).json(ApiResponse.success(result));
});

/**
 * @swagger
 * /api/v1/suppliers/{id}:
 *   get:
 *     summary: Get supplier by ID
 *     tags: [Suppliers]
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
 *         description: Supplier retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Supplier not found
 */
const getById = asyncHandler(async (req, res) => {
  const supplier = await supplierService.getById(req.params.id);
  res.status(200).json(ApiResponse.success(supplier));
});

/**
 * @swagger
 * /api/v1/suppliers/{id}:
 *   patch:
 *     summary: Update supplier
 *     tags: [Suppliers]
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
 *               supplierCode:
 *                 type: string
 *               type:
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
 *               panNumber:
 *                 type: string
 *               vatNumber:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Supplier updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Supplier not found
 */
const update = asyncHandler(async (req, res) => {
  const supplier = await supplierService.update(req.params.id, req.body);
  res.status(200).json(ApiResponse.success(supplier, 'Supplier updated successfully'));
});

/**
 * @swagger
 * /api/v1/suppliers/{id}:
 *   delete:
 *     summary: Delete supplier
 *     tags: [Suppliers]
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
 *         description: Supplier deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Supplier not found
 */
const remove = asyncHandler(async (req, res) => {
  await supplierService.remove(req.params.id);
  res.status(200).json(ApiResponse.success(null, 'Supplier deleted successfully'));
});

module.exports = { create, getAll, getById, update, remove };
