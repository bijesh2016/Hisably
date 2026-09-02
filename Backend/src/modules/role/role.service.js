const prisma = require('../../config/database');

const create = async (data) => await prisma.role.create({ data });

const getAll = async (query) => {
  const { page = 1, limit = 20, organizationId } = query;
  const where = { deletedAt: null, ...(organizationId && { organizationId }) };
  const [roles, total] = await Promise.all([
    prisma.role.findMany({ where, skip: (page - 1) * limit, take: parseInt(limit), orderBy: { createdAt: 'desc' } }),
    prisma.role.count({ where }),
  ]);
  return { roles, pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / limit) } };
};

const getById = async (id) => await prisma.role.findFirst({ where: { id, deletedAt: null } });

const update = async (id, data) => await prisma.role.update({ where: { id }, data });

const remove = async (id) => await prisma.role.update({ where: { id }, data: { deletedAt: new Date() } });

module.exports = { create, getAll, getById, update, remove };
