const prisma = require('../../config/database');

const create = async (data) => {
  const {
    organizationId,
    supplierId: initialSupplierId,
    supplierName,
    supplier,
    branchId: initialBranchId,
    warehouseId: initialWarehouseId,
    warehouseName,
    items,
    payments,
    ...purchaseData
  } = data;

  if (!organizationId) {
    throw new Error('Organization ID is required to create a purchase');
  }

  // 1. Resolve Supplier
  let supplierId = initialSupplierId;
  const targetSupplierName = supplierName || (typeof supplier === 'string' ? supplier : supplier?.name);
  if (!supplierId && targetSupplierName) {
    let existingSupplier = await prisma.supplier.findFirst({
      where: {
        organizationId,
        deletedAt: null,
        name: { equals: targetSupplierName, mode: 'insensitive' },
      },
    });

    if (!existingSupplier) {
      existingSupplier = await prisma.supplier.create({
        data: {
          organizationId,
          name: targetSupplierName,
          supplierCode: `SUP-${Math.floor(Math.random() * 9000 + 1000)}`,
        },
      });
    }
    supplierId = existingSupplier.id;
  }

  if (!supplierId) {
    // Fallback to first active supplier in organization
    const defaultSup = await prisma.supplier.findFirst({ where: { organizationId, deletedAt: null } });
    if (defaultSup) supplierId = defaultSup.id;
    else {
      const createdSup = await prisma.supplier.create({
        data: { organizationId, name: 'General Supplier Ltd.', supplierCode: 'SUP-001' },
      });
      supplierId = createdSup.id;
    }
  }

  // 2. Resolve Branch & Warehouse
  let branchId = initialBranchId;
  if (!branchId) {
    const defaultBranch = await prisma.branch.findFirst({ where: { organizationId, deletedAt: null } });
    if (defaultBranch) branchId = defaultBranch.id;
  }

  let warehouseId = initialWarehouseId;
  if (!warehouseId && warehouseName) {
    const matchedWh = await prisma.warehouse.findFirst({
      where: { organizationId, deletedAt: null, name: { equals: warehouseName, mode: 'insensitive' } },
    });
    if (matchedWh) warehouseId = matchedWh.id;
  }
  if (!warehouseId) {
    const defaultWh = await prisma.warehouse.findFirst({ where: { organizationId, deletedAt: null } });
    if (defaultWh) warehouseId = defaultWh.id;
  }

  return await prisma.$transaction(async (tx) => {
    // Resolve product IDs for items
    const processedItems = [];
    if (items && items.length) {
      for (const item of items) {
        let prodId = item.productId || item.id;
        const itemName = item.name || item.productName;

        if (!prodId || prodId.startsWith('#') || prodId.length < 10) {
          // Look up product by name
          let foundProd = await tx.product.findFirst({
            where: { organizationId, deletedAt: null, name: { equals: itemName, mode: 'insensitive' } },
          });

          if (!foundProd && itemName) {
            // Find or create default unit
            let defaultUnit = await tx.unit.findFirst({ where: { organizationId, deletedAt: null } });
            if (!defaultUnit) {
              defaultUnit = await tx.unit.create({
                data: { organizationId, name: 'Pcs', abbreviation: 'pcs' },
              });
            }

            foundProd = await tx.product.create({
              data: {
                organizationId,
                name: itemName,
                sku: `SKU-${Math.floor(Math.random() * 90000 + 10000)}`,
                unitId: defaultUnit.id,
                costPrice: Number(item.unitCost || item.cost || 0),
                sellingPrice: Number(item.unitCost || item.cost || 0) * 1.3,
                trackInventory: true,
              },
            });
          }

          if (foundProd) prodId = foundProd.id;
        }

        if (prodId) {
          const qty = Number(item.quantity || item.qty || 1);
          const cost = Number(item.unitCost || item.cost || 0);
          processedItems.push({
            productId: prodId,
            variantId: item.variantId || null,
            quantity: qty,
            unitCost: cost,
            totalAmount: Number(item.totalAmount || qty * cost),
          });

          // Increment stock in warehouse
          if (warehouseId) {
            await tx.stock.upsert({
              where: {
                warehouseId_productId_variantId: {
                  warehouseId,
                  productId: prodId,
                  variantId: item.variantId || null,
                },
              },
              update: {
                quantity: { increment: qty },
              },
              create: {
                organizationId,
                warehouseId,
                productId: prodId,
                quantity: qty,
              },
            });
          }
        }
      }
    }

    const purchase = await tx.purchase.create({
      data: {
        organizationId,
        supplierId,
        branchId,
        warehouseId,
        invoiceNumber: purchaseData.invoiceNumber || `PUR-${Math.floor(Math.random() * 90000 + 10000)}`,
        purchaseDate: purchaseData.purchaseDate ? new Date(purchaseData.purchaseDate) : new Date(),
        status: purchaseData.status || 'RECEIVED',
        paymentStatus: purchaseData.paymentStatus || 'PAID',
        totalAmount: Number(purchaseData.totalAmount || 0),
        notes: purchaseData.notes || null,
        items: processedItems.length ? { create: processedItems } : undefined,
      },
      include: {
        supplier: true,
        warehouse: true,
        branch: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return purchase;
  });
};

const getAll = async (query) => {
  const { page = 1, limit = 50, organizationId, status, supplierId } = query;
  const where = {
    deletedAt: null,
    ...(organizationId && { organizationId }),
    ...(status && { status }),
    ...(supplierId && { supplierId }),
  };
  const [purchases, total] = await Promise.all([
    prisma.purchase.findMany({
      where,
      include: {
        supplier: true,
        warehouse: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { purchaseDate: 'desc' },
    }),
    prisma.purchase.count({ where }),
  ]);
  return {
    purchases,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getById = async (id) =>
  await prisma.purchase.findFirst({
    where: { id, deletedAt: null },
    include: {
      supplier: true,
      warehouse: true,
      branch: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

const update = async (id, data) => await prisma.purchase.update({ where: { id }, data });

const remove = async (id) => await prisma.purchase.update({ where: { id }, data: { deletedAt: new Date() } });

module.exports = { create, getAll, getById, update, remove };
