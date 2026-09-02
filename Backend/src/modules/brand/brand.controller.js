const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const brandService = require('./brand.service');

const create = asyncHandler(async (req, res) => {
  const brand = await brandService.create(req.body);
  res.status(201).json(ApiResponse.created(brand, 'Brand created successfully'));
});

const getAll = asyncHandler(async (req, res) => {
  const result = await brandService.getAll(req.query);
  res.status(200).json(ApiResponse.success(result));
});

const getById = asyncHandler(async (req, res) => {
  const brand = await brandService.getById(req.params.id);
  res.status(200).json(ApiResponse.success(brand));
});

const update = asyncHandler(async (req, res) => {
  const brand = await brandService.update(req.params.id, req.body);
  res.status(200).json(ApiResponse.success(brand, 'Brand updated successfully'));
});

const remove = asyncHandler(async (req, res) => {
  await brandService.remove(req.params.id);
  res.status(200).json(ApiResponse.success(null, 'Brand deleted successfully'));
});

module.exports = { create, getAll, getById, update, remove };
