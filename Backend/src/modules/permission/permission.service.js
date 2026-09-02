const prisma = require('../../config/database');

const getAll = async () => await prisma.permission.findMany();

const getById = async (id) => await prisma.permission.findUnique({ where: { id } });

module.exports = { getAll, getById };
