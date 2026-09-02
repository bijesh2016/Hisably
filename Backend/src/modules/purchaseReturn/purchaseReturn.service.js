const prisma = require('../../config/database');

const create = async (data) => {
  const { items, ...returnData } = data;

  return await prisma.$transaction(async (tx) => {
    const purchaseReturn = await tx.purchaseReturn.create({
      data: {
        ...returnData,
        returnDate: returnData.returnDate ? new Date(returnData.returnDate) : new Date(),
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: item.quantity,
            unitCost: item.unitCost,
            discount: item.discount || 0,
            taxRate: item.taxRate || 0,
            taxAmount: item.taxAmount || 0,
            totalAmount: item.totalAmount,
          })),
        },
      },
      include: {
        supplier: true,
        purchase: true,
        branch: true,
        warehouse: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // If return is COMPLETED upon creation, decrement inventory
    if (returnData.status === 'COMPLETED') {
      for (const item of items) {
        const stock = await tx.stock.findUnique({
          where: {
            warehouseId_productId_variantId: {
              warehouseId: returnData.warehouseId,
              productId: item.productId,
              variantId: item.variantId || null,
            },
          },
        });

        if (stock) {
          await tx.stock.update({
            where: { id: stock.id },
            data: { quantity: { decrement: item.quantity } },
          });
        }
      }
    }

    return purchaseReturn;
  });
};

const getAll = async (query) => {
  const { page = 1, limit = 20, organizationId, status, supplierId, branchId } = query;

  const where = {
    ...(organizationId && { organizationId }),
    ...(status && { status }),
    ...(supplierId && { supplierId }),
    ...(branchId && { branchId }),
  };

  const [purchaseReturns, total] = await Promise.all([
    prisma.purchaseReturn.findMany({
      where,
      include: {
        supplier: true,
        purchase: true,
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
    prisma.purchaseReturn.count({ where }),
  ]);

  return {
    purchaseReturns,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getById = async (id) => {
  return await prisma.purchaseReturn.findUnique({
    where: { id },
    include: {
      supplier: true,
      purchase: true,
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
  return await prisma.purchaseReturn.update({
    where: { id },
    data,
    include: {
      supplier: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });
};

const remove = async (id) => {
  return await prisma.purchaseReturn.delete({ where: { id } });
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};
