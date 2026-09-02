const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const purchaseReturnService = require('./purchaseReturn.service');

const create = asyncHandler(async (req, res) => {
  const purchaseReturn = await purchaseReturnService.create(req.body);
  res.status(201).json(ApiResponse.created(purchaseReturn, 'Purchase return created successfully'));
});

const getAll = asyncHandler(async (req, res) => {
  const result = await purchaseReturnService.getAll(req.query);
  res.status(200).json(ApiResponse.success(result));
});

const getById = asyncHandler(async (req, res) => {
  const purchaseReturn = await purchaseReturnService.getById(req.params.id);
  res.status(200).json(ApiResponse.success(purchaseReturn));
});

const update = asyncHandler(async (req, res) => {
  const purchaseReturn = await purchaseReturnService.update(req.params.id, req.body);
  res.status(200).json(ApiResponse.success(purchaseReturn, 'Purchase return updated successfully'));
});

const remove = asyncHandler(async (req, res) => {
  await purchaseReturnService.remove(req.params.id);
  res.status(200).json(ApiResponse.success(null, 'Purchase return deleted successfully'));
});

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};
