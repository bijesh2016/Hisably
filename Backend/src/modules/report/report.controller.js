const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const reportService = require('./report.service');

/**
 * @swagger
 * /api/v1/reports/sales:
 *   get:
 *     summary: Get sales report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: organizationId
 *         schema:
 *           type: string
 *         description: Filter by organization
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for report
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for report
 *     responses:
 *       200:
 *         description: Sales report retrieved successfully
 *       401:
 *         description: Unauthorized
 */
const salesReport = asyncHandler(async (req, res) => {
  const report = await reportService.salesReport(req.query);
  res.status(200).json(ApiResponse.success(report));
});

/**
 * @swagger
 * /api/v1/reports/purchases:
 *   get:
 *     summary: Get purchases report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: organizationId
 *         schema:
 *           type: string
 *         description: Filter by organization
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for report
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for report
 *     responses:
 *       200:
 *         description: Purchases report retrieved successfully
 *       401:
 *         description: Unauthorized
 */
const purchasesReport = asyncHandler(async (req, res) => {
  const report = await reportService.purchasesReport(req.query);
  res.status(200).json(ApiResponse.success(report));
});

/**
 * @swagger
 * /api/v1/reports/inventory:
 *   get:
 *     summary: Get inventory report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: organizationId
 *         schema:
 *           type: string
 *         description: Filter by organization
 *       - in: query
 *         name: warehouseId
 *         schema:
 *           type: string
 *         description: Filter by warehouse
 *     responses:
 *       200:
 *         description: Inventory report retrieved successfully
 *       401:
 *         description: Unauthorized
 */
const inventoryReport = asyncHandler(async (req, res) => {
  const report = await reportService.inventoryReport(req.query);
  res.status(200).json(ApiResponse.success(report));
});

module.exports = { salesReport, purchasesReport, inventoryReport };
