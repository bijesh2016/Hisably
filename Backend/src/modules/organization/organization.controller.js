const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const organizationService = require('./organization.service');

const create = asyncHandler(async (req, res) => {
  const organization = await organizationService.create(req.body);
  res.status(201).json(ApiResponse.created(organization, 'Organization created successfully'));
});

const createShopBySuperAdmin = asyncHandler(async (req, res) => {
  const result = await organizationService.createShopBySuperAdmin(req.body);
  res.status(201).json(ApiResponse.created(result, 'Shop provisioned and activated by Super Admin!'));
});

const approveOrganization = asyncHandler(async (req, res) => {
  const organization = await organizationService.approveOrganization(req.params.id, req.body);
  res.status(200).json(ApiResponse.success(organization, 'Organization approved and activated!'));
});

const rejectOrganization = asyncHandler(async (req, res) => {
  const organization = await organizationService.rejectOrganization(req.params.id, req.body);
  res.status(200).json(ApiResponse.success(organization, 'Organization registration rejected'));
});

const getAll = asyncHandler(async (req, res) => {
  const result = await organizationService.getAll(req.query);
  res.status(200).json(ApiResponse.success(result));
});

const getPlatformOverview = asyncHandler(async (req, res) => {
  const result = await organizationService.getPlatformOverview();
  res.status(200).json(ApiResponse.success(result, 'Platform overview statistics retrieved successfully'));
});

const getById = asyncHandler(async (req, res) => {
  const organization = await organizationService.getById(req.params.id);
  res.status(200).json(ApiResponse.success(organization));
});

const update = asyncHandler(async (req, res) => {
  const organization = await organizationService.update(req.params.id, req.body);
  res.status(200).json(ApiResponse.success(organization, 'Organization updated successfully'));
});

const remove = asyncHandler(async (req, res) => {
  await organizationService.remove(req.params.id);
  res.status(200).json(ApiResponse.success(null, 'Organization deleted successfully'));
});

module.exports = {
  create,
  createShopBySuperAdmin,
  approveOrganization,
  rejectOrganization,
  getAll,
  getPlatformOverview,
  getById,
  update,
  remove,
};
