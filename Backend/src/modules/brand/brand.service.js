const prisma = require('../../config/database');

const create = async (data) => await prisma.brand.create({ data });

const getAll = async (query) => {
  const { page = 1, limit = 50, organizationId, search } = query;
  const where = {
    deletedAt: null,
    ...(organizationId && { organizationId }),
    ...(search && { name: { contains: search, mode: 'insensitive' } }),
  };
  const [brands, total] = await Promise.all([
    prisma.brand.findMany({ where, skip: (page - 1) * limit, take: parseInt(limit), orderBy: { name: 'asc' } }),
    prisma.brand.count({ where }),
  ]);
  return { brands, pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / limit) } };
};

const getById = async (id) => await prisma.brand.findFirst({ where: { id, deletedAt: null } });

const update = async (id, data) => await prisma.brand.update({ where: { id }, data });

const remove = async (id) => await prisma.brand.update({ where: { id }, data: { deletedAt: new Date() } });

module.exports = { create, getAll, getById, update, remove };
