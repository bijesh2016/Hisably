const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const expenseService = require('./expense.service');

const create = asyncHandler(async (req, res) => {
  const expense = await expenseService.create(req.body);
  res.status(201).json(ApiResponse.created(expense, 'Expense created successfully'));
});

const getAll = asyncHandler(async (req, res) => {
  const result = await expenseService.getAll(req.query);
  res.status(200).json(ApiResponse.success(result));
});

const getById = asyncHandler(async (req, res) => {
  const expense = await expenseService.getById(req.params.id);
  res.status(200).json(ApiResponse.success(expense));
});

const update = asyncHandler(async (req, res) => {
  const expense = await expenseService.update(req.params.id, req.body);
  res.status(200).json(ApiResponse.success(expense, 'Expense updated successfully'));
});

const remove = asyncHandler(async (req, res) => {
  await expenseService.remove(req.params.id);
  res.status(200).json(ApiResponse.success(null, 'Expense deleted successfully'));
});

module.exports = { create, getAll, getById, update, remove };
