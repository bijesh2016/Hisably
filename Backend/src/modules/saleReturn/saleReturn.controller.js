const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const saleReturnService = require('./saleReturn.service');

const create = asyncHandler(async (req, res) => {
  const saleReturn = await saleReturnService.create(req.body);
  res.status(201).json(ApiResponse.created(saleReturn, 'Sale return created successfully'));
});

const getAll = asyncHandler(async (req, res) => {
  const result = await saleReturnService.getAll(req.query);
  res.status(200).json(ApiResponse.success(result));
});

const getById = asyncHandler(async (req, res) => {
  const saleReturn = await saleReturnService.getById(req.params.id);
  res.status(200).json(ApiResponse.success(saleReturn));
});

const update = asyncHandler(async (req, res) => {
  const saleReturn = await saleReturnService.update(req.params.id, req.body);
  res.status(200).json(ApiResponse.success(saleReturn, 'Sale return updated successfully'));
});

const remove = asyncHandler(async (req, res) => {
  await saleReturnService.remove(req.params.id);
  res.status(200).json(ApiResponse.success(null, 'Sale return deleted successfully'));
});

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};
