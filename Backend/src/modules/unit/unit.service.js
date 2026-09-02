const prisma = require('../../config/database');

const create = async (data) => await prisma.unit.create({ data });

const getAll = async (query) => {
  const { page = 1, limit = 50, organizationId, search } = query;
  const where = {
    deletedAt: null,
    ...(organizationId && { organizationId }),
    ...(search && { name: { contains: search, mode: 'insensitive' } }),
  };
  const [units, total] = await Promise.all([
    prisma.unit.findMany({ where, skip: (page - 1) * limit, take: parseInt(limit), orderBy: { name: 'asc' } }),
    prisma.unit.count({ where }),
  ]);
  return { units, pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / limit) } };
};

const getById = async (id) => await prisma.unit.findFirst({ where: { id, deletedAt: null } });

const update = async (id, data) => await prisma.unit.update({ where: { id }, data });

const remove = async (id) => await prisma.unit.update({ where: { id }, data: { deletedAt: new Date() } });

module.exports = { create, getAll, getById, update, remove };
