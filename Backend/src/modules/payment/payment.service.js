const prisma = require('../../config/database');

const create = async (data) => {
  return await prisma.payment.create({
    data: {
      ...data,
      amount: data.amount,
      paymentDate: data.paymentDate ? new Date(data.paymentDate) : new Date(),
    },
    include: {
      branch: true,
      organization: true,
    },
  });
};

const getAll = async (query) => {
  const { page = 1, limit = 20, organizationId, branchId, type, status, startDate, endDate, method } = query;

  const where = {
    deletedAt: null,
    ...(organizationId && { organizationId }),
    ...(branchId && { branchId }),
    ...(type && { type }),
    ...(status && { status }),
    ...(method && { method }),
    ...(startDate || endDate
      ? {
          paymentDate: {
            ...(startDate && { gte: new Date(startDate) }),
            ...(endDate && { lte: new Date(endDate) }),
          },
        }
      : {}),
  };

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      include: {
        branch: true,
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { paymentDate: 'desc' },
    }),
    prisma.payment.count({ where }),
  ]);

  return {
    payments,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getById = async (id) => {
  return await prisma.payment.findFirst({
    where: { id, deletedAt: null },
    include: {
      branch: true,
      organization: true,
    },
  });
};

const update = async (id, data) => {
  const updateData = { ...data };
  if (updateData.paymentDate) {
    updateData.paymentDate = new Date(updateData.paymentDate);
  }

  return await prisma.payment.update({
    where: { id },
    data: updateData,
    include: {
      branch: true,
    },
  });
};

const remove = async (id) => {
  return await prisma.payment.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

module.exports = { create, getAll, getById, update, remove };
