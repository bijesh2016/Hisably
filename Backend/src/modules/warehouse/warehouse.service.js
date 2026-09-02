const prisma = require('../../config/database');

const create = async (data) => await prisma.warehouse.create({ data });

const getAll = async (query) => {
  const { page = 1, limit = 20, organizationId, branchId } = query;
  const where = { deletedAt: null, ...(organizationId && { organizationId }), ...(branchId && { branchId }) };
  const [warehouses, total] = await Promise.all([
    prisma.warehouse.findMany({ where, skip: (page - 1) * limit, take: parseInt(limit), orderBy: { createdAt: 'desc' } }),
    prisma.warehouse.count({ where }),
  ]);
  return { warehouses, pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / limit) } };
};

const getById = async (id) => await prisma.warehouse.findFirst({ where: { id, deletedAt: null } });

const update = async (id, data) => await prisma.warehouse.update({ where: { id }, data });

const remove = async (id) => await prisma.warehouse.update({ where: { id }, data: { deletedAt: new Date() } });

module.exports = { create, getAll, getById, update, remove };
