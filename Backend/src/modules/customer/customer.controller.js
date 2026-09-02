const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const customerService = require('./customer.service');

/**
 * @swagger
 * /api/v1/customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
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
 *               customerCode:
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
 *               creditLimit:
 *                 type: number
 *               creditDays:
 *                 type: number
 *     responses:
 *       201:
 *         description: Customer created successfully
 *       401:
 *         description: Unauthorized
 */
const create = asyncHandler(async (req, res) => {
  const customer = await customerService.create(req.body);
  res.status(201).json(ApiResponse.created(customer, 'Customer created successfully'));
});

/**
 * @swagger
 * /api/v1/customers:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
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
 *         description: Customers retrieved successfully
 *       401:
 *         description: Unauthorized
 */
const getAll = asyncHandler(async (req, res) => {
  const result = await customerService.getAll(req.query);
  res.status(200).json(ApiResponse.success(result));
});

/**
 * @swagger
 * /api/v1/customers/{id}:
 *   get:
 *     summary: Get customer by ID
 *     tags: [Customers]
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
 *         description: Customer retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Customer not found
 */
const getById = asyncHandler(async (req, res) => {
  const customer = await customerService.getById(req.params.id);
  res.status(200).json(ApiResponse.success(customer));
});

/**
 * @swagger
 * /api/v1/customers/{id}:
 *   patch:
 *     summary: Update customer
 *     tags: [Customers]
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
 *               customerCode:
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
 *               creditLimit:
 *                 type: number
 *               creditDays:
 *                 type: number
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Customer not found
 */
const update = asyncHandler(async (req, res) => {
  const customer = await customerService.update(req.params.id, req.body);
  res.status(200).json(ApiResponse.success(customer, 'Customer updated successfully'));
});

/**
 * @swagger
 * /api/v1/customers/{id}:
 *   delete:
 *     summary: Delete customer
 *     tags: [Customers]
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
 *         description: Customer deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Customer not found
 */
const remove = asyncHandler(async (req, res) => {
  await customerService.remove(req.params.id);
  res.status(200).json(ApiResponse.success(null, 'Customer deleted successfully'));
});

const sendReminder = asyncHandler(async (req, res) => {
  const result = await customerService.sendReminder(req.params.id, req.body);
  res.status(200).json(ApiResponse.success(result, 'Reminder processed successfully'));
});

module.exports = { create, getAll, getById, sendReminder, update, remove };
