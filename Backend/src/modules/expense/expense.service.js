const prisma = require('../../config/database');

const create = async (data) => {
  return await prisma.expense.create({
    data: {
      ...data,
      amount: data.amount,
      expenseDate: data.expenseDate ? new Date(data.expenseDate) : new Date(),
    },
    include: {
      branch: true,
      organization: true,
    },
  });
};

const getAll = async (query) => {
  const { page = 1, limit = 20, organizationId, branchId, status, startDate, endDate, search } = query;

  const where = {
    deletedAt: null,
    ...(organizationId && { organizationId }),
    ...(branchId && { branchId }),
    ...(status && { status }),
    ...(search && {
      title: { contains: search, mode: 'insensitive' },
    }),
    ...(startDate || endDate
      ? {
          expenseDate: {
            ...(startDate && { gte: new Date(startDate) }),
            ...(endDate && { lte: new Date(endDate) }),
          },
        }
      : {}),
  };

  const [expenses, total] = await Promise.all([
    prisma.expense.findMany({
      where,
      include: {
        branch: true,
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { expenseDate: 'desc' },
    }),
    prisma.expense.count({ where }),
  ]);

  return {
    expenses,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getById = async (id) => {
  return await prisma.expense.findFirst({
    where: { id, deletedAt: null },
    include: {
      branch: true,
      organization: true,
    },
  });
};

const update = async (id, data) => {
  const updateData = { ...data };
  if (updateData.expenseDate) {
    updateData.expenseDate = new Date(updateData.expenseDate);
  }

  return await prisma.expense.update({
    where: { id },
    data: updateData,
    include: {
      branch: true,
    },
  });
};

const remove = async (id) => {
  return await prisma.expense.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

module.exports = { create, getAll, getById, update, remove };
