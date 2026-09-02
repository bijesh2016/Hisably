const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const stockTransferService = require('./stockTransfer.service');

const create = asyncHandler(async (req, res) => {
  const transfer = await stockTransferService.create(req.body);
  res.status(201).json(ApiResponse.created(transfer, 'Stock transfer created successfully'));
});

const getAll = asyncHandler(async (req, res) => {
  const result = await stockTransferService.getAll(req.query);
  res.status(200).json(ApiResponse.success(result));
});

const getById = asyncHandler(async (req, res) => {
  const transfer = await stockTransferService.getById(req.params.id);
  res.status(200).json(ApiResponse.success(transfer));
});

const updateStatus = asyncHandler(async (req, res) => {
  const transfer = await stockTransferService.updateStatus(req.params.id, req.body);
  res.status(200).json(ApiResponse.success(transfer, 'Stock transfer status updated successfully'));
});

const remove = asyncHandler(async (req, res) => {
  await stockTransferService.remove(req.params.id);
  res.status(200).json(ApiResponse.success(null, 'Stock transfer deleted successfully'));
});

module.exports = {
  create,
  getAll,
  getById,
  updateStatus,
  remove,
};
