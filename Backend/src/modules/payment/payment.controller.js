const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const paymentService = require('./payment.service');

const create = asyncHandler(async (req, res) => {
  const payment = await paymentService.create(req.body);
  res.status(201).json(ApiResponse.created(payment, 'Payment created successfully'));
});

const getAll = asyncHandler(async (req, res) => {
  const result = await paymentService.getAll(req.query);
  res.status(200).json(ApiResponse.success(result));
});

const getById = asyncHandler(async (req, res) => {
  const payment = await paymentService.getById(req.params.id);
  res.status(200).json(ApiResponse.success(payment));
});

const update = asyncHandler(async (req, res) => {
  const payment = await paymentService.update(req.params.id, req.body);
  res.status(200).json(ApiResponse.success(payment, 'Payment updated successfully'));
});

const remove = asyncHandler(async (req, res) => {
  await paymentService.remove(req.params.id);
  res.status(200).json(ApiResponse.success(null, 'Payment deleted successfully'));
});

module.exports = { create, getAll, getById, update, remove };
