const prisma = require('../../config/database');

const create = async (data) => await prisma.stock.create({ data });

const getAll = async (query) => {
  const { page = 1, limit = 20, warehouseId, productId } = query;
  const where = { ...(warehouseId && { warehouseId }), ...(productId && { productId }) };
  const [stocks, total] = await Promise.all([
    prisma.stock.findMany({ where, skip: (page - 1) * limit, take: parseInt(limit), orderBy: { createdAt: 'desc' } }),
    prisma.stock.count({ where }),
  ]);
  return { stocks, pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / limit) } };
};

const getById = async (id) => await prisma.stock.findUnique({ where: { id } });

const update = async (id, data) => await prisma.stock.update({ where: { id }, data });

const remove = async (id) => await prisma.stock.delete({ where: { id } });

module.exports = { create, getAll, getById, update, remove };
