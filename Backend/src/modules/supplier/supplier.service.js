const prisma = require('../../config/database');

const create = async (data) => await prisma.supplier.create({ data });

const getAll = async (query) => {
  const { page = 1, limit = 20, organizationId } = query;
  const where = { deletedAt: null, ...(organizationId && { organizationId }) };
  const [suppliers, total] = await Promise.all([
    prisma.supplier.findMany({ where, skip: (page - 1) * limit, take: parseInt(limit), orderBy: { createdAt: 'desc' } }),
    prisma.supplier.count({ where }),
  ]);
  return { suppliers, pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / limit) } };
};

const getById = async (id) => await prisma.supplier.findFirst({ where: { id, deletedAt: null } });

const update = async (id, data) => await prisma.supplier.update({ where: { id }, data });

const remove = async (id) => await prisma.supplier.update({ where: { id }, data: { deletedAt: new Date() } });

module.exports = { create, getAll, getById, update, remove };
