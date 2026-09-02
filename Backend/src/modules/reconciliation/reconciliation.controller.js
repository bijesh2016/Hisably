const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const reconciliationService = require('./reconciliation.service');

const getQrReconciliation = asyncHandler(async (req, res) => {
  const result = await reconciliationService.getQrReconciliation(req.query);
  res.status(200).json(ApiResponse.success(result, 'QR reconciliation data retrieved successfully'));
});

const reconcileAll = asyncHandler(async (req, res) => {
  const result = await reconciliationService.reconcileAll(req.body);
  res.status(200).json(ApiResponse.success(result, 'Reconciliation updated successfully'));
});

module.exports = {
  getQrReconciliation,
  reconcileAll,
};
