const prisma = require('../../config/database');

const create = async (data) => {
  const { items, ...returnData } = data;

  return await prisma.$transaction(async (tx) => {
    const saleReturn = await tx.saleReturn.create({
      data: {
        ...returnData,
        returnDate: returnData.returnDate ? new Date(returnData.returnDate) : new Date(),
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount || 0,
            taxRate: item.taxRate || 0,
            taxAmount: item.taxAmount || 0,
            totalAmount: item.totalAmount,
          })),
        },
      },
      include: {
        customer: true,
        sale: true,
        branch: true,
        warehouse: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // If return is COMPLETED upon creation, restock inventory
    if (returnData.status === 'COMPLETED') {
      for (const item of items) {
        await tx.stock.upsert({
          where: {
            warehouseId_productId_variantId: {
              warehouseId: returnData.warehouseId,
              productId: item.productId,
              variantId: item.variantId || null,
            },
          },
          update: {
            quantity: { increment: item.quantity },
          },
          create: {
            warehouseId: returnData.warehouseId,
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: item.quantity,
          },
        });
      }
    }

    return saleReturn;
  });
};

const getAll = async (query) => {
  const { page = 1, limit = 20, organizationId, status, customerId, branchId } = query;

  const where = {
    ...(organizationId && { organizationId }),
    ...(status && { status }),
    ...(customerId && { customerId }),
    ...(branchId && { branchId }),
  };

  const [saleReturns, total] = await Promise.all([
    prisma.saleReturn.findMany({
      where,
      include: {
        customer: true,
        sale: true,
        branch: true,
        warehouse: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { returnDate: 'desc' },
    }),
    prisma.saleReturn.count({ where }),
  ]);

  return {
    saleReturns,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getById = async (id) => {
  return await prisma.saleReturn.findUnique({
    where: { id },
    include: {
      customer: true,
      sale: true,
      branch: true,
      warehouse: true,
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  });
};

const update = async (id, data) => {
  return await prisma.saleReturn.update({
    where: { id },
    data,
    include: {
      customer: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });
};

const remove = async (id) => {
  return await prisma.saleReturn.delete({ where: { id } });
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};
