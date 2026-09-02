const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const saleService = require('./sale.service');

/**
 * @swagger
 * /api/v1/sales:
 *   post:
 *     summary: Create a new sale
 *     tags: [Sales]
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
 *               - warehouseId
 *               - saleNumber
 *             properties:
 *               organizationId:
 *                 type: string
 *               customerId:
 *                 type: string
 *                 nullable: true
 *               branchId:
 *                 type: string
 *               warehouseId:
 *                 type: string
 *               saleNumber:
 *                 type: string
 *               saleDate:
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
 *         description: Sale created successfully
 *       401:
 *         description: Unauthorized
 */
const create = asyncHandler(async (req, res) => {
  const sale = await saleService.create(req.body);
  res.status(201).json(ApiResponse.created(sale, 'Sale created successfully'));
});

/**
 * @swagger
 * /api/v1/sales:
 *   get:
 *     summary: Get all sales
 *     tags: [Sales]
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
 *         description: Sales retrieved successfully
 *       401:
 *         description: Unauthorized
 */
const getAll = asyncHandler(async (req, res) => {
  const result = await saleService.getAll(req.query);
  res.status(200).json(ApiResponse.success(result));
});

/**
 * @swagger
 * /api/v1/sales/{id}:
 *   get:
 *     summary: Get sale by ID
 *     tags: [Sales]
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
 *         description: Sale retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Sale not found
 */
const getById = asyncHandler(async (req, res) => {
  const sale = await saleService.getById(req.params.id);
  res.status(200).json(ApiResponse.success(sale));
});

/**
 * @swagger
 * /api/v1/sales/{id}:
 *   patch:
 *     summary: Update sale
 *     tags: [Sales]
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
 *         description: Sale updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Sale not found
 */
const update = asyncHandler(async (req, res) => {
  const sale = await saleService.update(req.params.id, req.body);
  res.status(200).json(ApiResponse.success(sale, 'Sale updated successfully'));
});

/**
 * @swagger
 * /api/v1/sales/{id}:
 *   delete:
 *     summary: Delete sale
 *     tags: [Sales]
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
 *         description: Sale deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Sale not found
 */
const remove = asyncHandler(async (req, res) => {
  await saleService.remove(req.params.id);
  res.status(200).json(ApiResponse.success(null, 'Sale deleted successfully'));
});

const getInvoice = asyncHandler(async (req, res) => {
  const invoice = await saleService.getInvoice(req.params.id);
  res.status(200).json(ApiResponse.success(invoice, 'Invoice retrieved successfully'));
});

const sendReminder = asyncHandler(async (req, res) => {
  const result = await saleService.sendReminder(req.params.id, req.body);
  res.status(200).json(ApiResponse.success(result, 'Reminder processed successfully'));
});

module.exports = { create, getAll, getById, getInvoice, sendReminder, update, remove };
