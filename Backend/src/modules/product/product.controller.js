const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const productService = require('./product.service');

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
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
 *               - unitId
 *               - name
 *               - costPrice
 *               - sellingPrice
 *             properties:
 *               organizationId:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               brandId:
 *                 type: string
 *               unitId:
 *                 type: string
 *               name:
 *                 type: string
 *               sku:
 *                 type: string
 *               barcode:
 *                 type: string
 *               description:
 *                 type: string
 *               productType:
 *                 type: string
 *               costPrice:
 *                 type: number
 *               sellingPrice:
 *                 type: number
 *               taxRate:
 *                 type: number
 *               trackInventory:
 *                 type: boolean
 *               trackSerial:
 *                 type: boolean
 *               minStock:
 *                 type: number
 *               maxStock:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product created successfully
 *       401:
 *         description: Unauthorized
 */
const create = asyncHandler(async (req, res) => {
  const product = await productService.create(req.body);
  res.status(201).json(ApiResponse.created(product, 'Product created successfully'));
});

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
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
 *         description: Products retrieved successfully
 *       401:
 *         description: Unauthorized
 */
const getAll = asyncHandler(async (req, res) => {
  const result = await productService.getAll(req.query);
  res.status(200).json(ApiResponse.success(result));
});

/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
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
 *         description: Product retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
const getById = asyncHandler(async (req, res) => {
  const product = await productService.getById(req.params.id);
  res.status(200).json(ApiResponse.success(product));
});

/**
 * @swagger
 * /api/v1/products/{id}:
 *   patch:
 *     summary: Update product
 *     tags: [Products]
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
 *               categoryId:
 *                 type: string
 *               brandId:
 *                 type: string
 *               unitId:
 *                 type: string
 *               name:
 *                 type: string
 *               sku:
 *                 type: string
 *               barcode:
 *                 type: string
 *               description:
 *                 type: string
 *               productType:
 *                 type: string
 *               costPrice:
 *                 type: number
 *               sellingPrice:
 *                 type: number
 *               taxRate:
 *                 type: number
 *               trackInventory:
 *                 type: boolean
 *               trackSerial:
 *                 type: boolean
 *               minStock:
 *                 type: number
 *               maxStock:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
const update = asyncHandler(async (req, res) => {
  const product = await productService.update(req.params.id, req.body);
  res.status(200).json(ApiResponse.success(product, 'Product updated successfully'));
});

/**
 * @swagger
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
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
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
const remove = asyncHandler(async (req, res) => {
  await productService.remove(req.params.id);
  res.status(200).json(ApiResponse.success(null, 'Product deleted successfully'));
});

const getByBarcode = asyncHandler(async (req, res) => {
  const product = await productService.getByBarcode(req.params.code, req.query.organizationId);
  if (!product) {
    return res.status(404).json(ApiResponse.error('No product matched this barcode / SKU'));
  }
  res.status(200).json(ApiResponse.success(product, 'Product found'));
});

module.exports = { create, getAll, getById, getByBarcode, update, remove };
