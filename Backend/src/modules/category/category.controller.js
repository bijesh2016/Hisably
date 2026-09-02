const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const categoryService = require('./category.service');

/**
 * @swagger
 * /api/v1/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
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
 *               - abbreviation
 *             properties:
 *               organizationId:
 *                 type: string
 *               name:
 *                 type: string
 *               abbreviation:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created successfully
 *       401:
 *         description: Unauthorized
 */
const create = asyncHandler(async (req, res) => {
  const category = await categoryService.create(req.body);
  res.status(201).json(ApiResponse.created(category, 'Category created successfully'));
});

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
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
 *         description: Categories retrieved successfully
 *       401:
 *         description: Unauthorized
 */
const getAll = asyncHandler(async (req, res) => {
  const result = await categoryService.getAll(req.query);
  res.status(200).json(ApiResponse.success(result));
});

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
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
 *         description: Category retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 */
const getById = asyncHandler(async (req, res) => {
  const category = await categoryService.getById(req.params.id);
  res.status(200).json(ApiResponse.success(category));
});

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   patch:
 *     summary: Update category
 *     tags: [Categories]
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
 *               abbreviation:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 */
const update = asyncHandler(async (req, res) => {
  const category = await categoryService.update(req.params.id, req.body);
  res.status(200).json(ApiResponse.success(category, 'Category updated successfully'));
});

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   delete:
 *     summary: Delete category
 *     tags: [Categories]
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
 *         description: Category deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 */
const remove = asyncHandler(async (req, res) => {
  await categoryService.remove(req.params.id);
  res.status(200).json(ApiResponse.success(null, 'Category deleted successfully'));
});

module.exports = { create, getAll, getById, update, remove };
