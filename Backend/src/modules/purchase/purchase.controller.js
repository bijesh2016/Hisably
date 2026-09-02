const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const purchaseService = require('./purchase.service');

/**
 * @swagger
 * /api/v1/purchases:
 *   post:
 *     summary: Create a new purchase
 *     tags: [Purchases]
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
 *               - supplierId
 *               - branchId
 *               - warehouseId
 *               - invoiceNumber
 *             properties:
 *               organizationId:
 *                 type: string
 *               supplierId:
 *                 type: string
 *               branchId:
 *                 type: string
 *               warehouseId:
 *                 type: string
 *               invoiceNumber:
 *                 type: string
 *               purchaseDate:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [DRAFT, COMPLETED, CANCELLED]
 *               paymentStatus:
 *                 type: string
 *                 enum: [UNPAID, PARTIAL, PAID]
 *               subtotal:
 *                 type: number
 *               discount:
 *                 type: number
 *               taxAmount:
 *                 type: number
 *               totalAmount:
 *                 type: number
 *               paidAmount:
 *                 type: number
 *               dueAmount:
 *                 type: number
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Purchase created successfully
 *       401:
 *         description: Unauthorized
 */
const create = asyncHandler(async (req, res) => {
  const purchase = await purchaseService.create(req.body);
  res.status(201).json(ApiResponse.created(purchase, 'Purchase created successfully'));
});

/**
 * @swagger
 * /api/v1/purchases:
 *   get:
 *     summary: Get all purchases
 *     tags: [Purchases]
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
 *         description: Purchases retrieved successfully
 *       401:
 *         description: Unauthorized
 */
const getAll = asyncHandler(async (req, res) => {
  const result = await purchaseService.getAll(req.query);
  res.status(200).json(ApiResponse.success(result));
});

/**
 * @swagger
 * /api/v1/purchases/{id}:
 *   get:
 *     summary: Get purchase by ID
 *     tags: [Purchases]
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
 *         description: Purchase retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Purchase not found
 */
const getById = asyncHandler(async (req, res) => {
  const purchase = await purchaseService.getById(req.params.id);
  res.status(200).json(ApiResponse.success(purchase));
});

/**
 * @swagger
 * /api/v1/purchases/{id}:
 *   patch:
 *     summary: Update purchase
 *     tags: [Purchases]
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
 *               status:
 *                 type: string
 *                 enum: [DRAFT, COMPLETED, CANCELLED]
 *               paymentStatus:
 *                 type: string
 *                 enum: [UNPAID, PARTIAL, PAID]
 *               subtotal:
 *                 type: number
 *               discount:
 *                 type: number
 *               taxAmount:
 *                 type: number
 *               totalAmount:
 *                 type: number
 *               paidAmount:
 *                 type: number
 *               dueAmount:
 *                 type: number
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Purchase updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Purchase not found
 */
const update = asyncHandler(async (req, res) => {
  const purchase = await purchaseService.update(req.params.id, req.body);
  res.status(200).json(ApiResponse.success(purchase, 'Purchase updated successfully'));
});

/**
 * @swagger
 * /api/v1/purchases/{id}:
 *   delete:
 *     summary: Delete purchase
 *     tags: [Purchases]
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
 *         description: Purchase deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Purchase not found
 */
const remove = asyncHandler(async (req, res) => {
  await purchaseService.remove(req.params.id);
  res.status(200).json(ApiResponse.success(null, 'Purchase deleted successfully'));
});

module.exports = { create, getAll, getById, update, remove };
