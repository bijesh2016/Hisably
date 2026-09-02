const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const unitService = require('./unit.service');

const create = asyncHandler(async (req, res) => {
  const unit = await unitService.create(req.body);
  res.status(201).json(ApiResponse.created(unit, 'Unit created successfully'));
});

const getAll = asyncHandler(async (req, res) => {
  const result = await unitService.getAll(req.query);
  res.status(200).json(ApiResponse.success(result));
});

const getById = asyncHandler(async (req, res) => {
  const unit = await unitService.getById(req.params.id);
  res.status(200).json(ApiResponse.success(unit));
});

const update = asyncHandler(async (req, res) => {
  const unit = await unitService.update(req.params.id, req.body);
  res.status(200).json(ApiResponse.success(unit, 'Unit updated successfully'));
});

const remove = asyncHandler(async (req, res) => {
  await unitService.remove(req.params.id);
  res.status(200).json(ApiResponse.success(null, 'Unit deleted successfully'));
});

module.exports = { create, getAll, getById, update, remove };
