const prisma = require('../../config/database');

const create = async (data) => {
  const { organizationId, fromWarehouseId, toWarehouseId, note, items } = data;

  return await prisma.$transaction(async (tx) => {
    const transfer = await tx.stockTransfer.create({
      data: {
        organizationId,
        fromWarehouseId,
        toWarehouseId,
        note,
        status: 'PENDING',
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        fromWarehouse: true,
        toWarehouse: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return transfer;
  });
};

const getAll = async (query) => {
  const { page = 1, limit = 20, organizationId, status, fromWarehouseId, toWarehouseId } = query;

  const where = {
    ...(organizationId && { organizationId }),
    ...(status && { status }),
    ...(fromWarehouseId && { fromWarehouseId }),
    ...(toWarehouseId && { toWarehouseId }),
  };

  const [transfers, total] = await Promise.all([
    prisma.stockTransfer.findMany({
      where,
      include: {
        fromWarehouse: true,
        toWarehouse: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.stockTransfer.count({ where }),
  ]);

  return {
    transfers,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getById = async (id) => {
  return await prisma.stockTransfer.findUnique({
    where: { id },
    include: {
      fromWarehouse: true,
      toWarehouse: true,
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  });
};

const updateStatus = async (id, data) => {
  const { status, note } = data;

  return await prisma.$transaction(async (tx) => {
    const existing = await tx.stockTransfer.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!existing) {
      throw new Error('Stock transfer not found');
    }

    // If completing transfer, adjust warehouse inventory
    if (status === 'COMPLETED' && existing.status !== 'COMPLETED') {
      for (const item of existing.items) {
        // Decrease from source warehouse
        const sourceStock = await tx.stock.findUnique({
          where: {
            warehouseId_productId_variantId: {
              warehouseId: existing.fromWarehouseId,
              productId: item.productId,
              variantId: item.variantId,
            },
          },
        });

        if (sourceStock) {
          await tx.stock.update({
            where: { id: sourceStock.id },
            data: { quantity: { decrement: item.quantity } },
          });
        }

        // Increase at target warehouse
        const targetStock = await tx.stock.findUnique({
          where: {
            warehouseId_productId_variantId: {
              warehouseId: existing.toWarehouseId,
              productId: item.productId,
              variantId: item.variantId,
            },
          },
        });

        if (targetStock) {
          await tx.stock.update({
            where: { id: targetStock.id },
            data: { quantity: { increment: item.quantity } },
          });
        } else {
          await tx.stock.create({
            data: {
              warehouseId: existing.toWarehouseId,
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
            },
          });
        }
      }
    }

    const updated = await tx.stockTransfer.update({
      where: { id },
      data: {
        status,
        ...(note && { note }),
        ...(status === 'COMPLETED' && { completedAt: new Date() }),
      },
      include: {
        fromWarehouse: true,
        toWarehouse: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return updated;
  });
};

const remove = async (id) => {
  return await prisma.stockTransfer.delete({ where: { id } });
};

module.exports = {
  create,
  getAll,
  getById,
  updateStatus,
  remove,
};
