const prisma = require('../../config/database');

const create = async (data) => {
  const {
    organizationId,
    categoryId: initialCategoryId,
    categoryName,
    category,
    brandId: initialBrandId,
    brandName,
    brand,
    unitId: initialUnitId,
    unitName,
    unit,
    initialStock,
    stockQty,
    warehouseId,
    ...productData
  } = data;

  if (!organizationId) {
    throw new Error('Organization ID is required to create a product');
  }

  let finalUnitId = initialUnitId;
  const targetUnitName = unitName || (typeof unit === 'string' ? unit : unit?.name) || 'Pcs';
  if (!finalUnitId) {
    let existingUnit = await prisma.unit.findFirst({
      where: {
        organizationId,
        deletedAt: null,
        OR: [
          { name: { equals: targetUnitName, mode: 'insensitive' } },
          { abbreviation: { equals: targetUnitName.toLowerCase(), mode: 'insensitive' } },
        ],
      },
    });

    if (!existingUnit) {
      existingUnit = await prisma.unit.create({
        data: {
          organizationId,
          name: targetUnitName,
          abbreviation: targetUnitName.slice(0, 4).toLowerCase(),
        },
      });
    }
    finalUnitId = existingUnit.id;
  }

  let finalCategoryId = initialCategoryId;
  const targetCategoryName = categoryName || (typeof category === 'string' ? category : category?.name);
  if (!finalCategoryId && targetCategoryName) {
    let existingCategory = await prisma.category.findFirst({
      where: {
        organizationId,
        deletedAt: null,
        name: { equals: targetCategoryName, mode: 'insensitive' },
      },
    });

    if (!existingCategory) {
      existingCategory = await prisma.category.create({
        data: {
          organizationId,
          name: targetCategoryName,
        },
      });
    }
    finalCategoryId = existingCategory.id;
  }

  let finalBrandId = initialBrandId;
  const targetBrandName = brandName || (typeof brand === 'string' ? brand : brand?.name);
  if (!finalBrandId && targetBrandName) {
    let existingBrand = await prisma.brand.findFirst({
      where: {
        organizationId,
        deletedAt: null,
        name: { equals: targetBrandName, mode: 'insensitive' },
      },
    });

    if (!existingBrand) {
      existingBrand = await prisma.brand.create({
        data: {
          organizationId,
          name: targetBrandName,
        },
      });
    }
    finalBrandId = existingBrand.id;
  }

  const generatedSku = productData.sku || `SKU-${Math.floor(Math.random() * 90000 + 10000)}`;

  const product = await prisma.product.create({
    data: {
      ...productData,
      sku: generatedSku,
      organizationId,
      unitId: finalUnitId,
      categoryId: finalCategoryId || null,
      brandId: finalBrandId || null,
      costPrice: productData.costPrice ? Number(productData.costPrice) : 0,
      sellingPrice: productData.sellingPrice ? Number(productData.sellingPrice) : 0,
      taxRate: productData.taxRate !== undefined ? Number(productData.taxRate) : 13,
      minStock: productData.minStock ? Number(productData.minStock) : 0,
      maxStock: productData.maxStock ? Number(productData.maxStock) : 100,
      trackInventory: productData.trackInventory !== false,
      isActive: productData.isActive !== false,
    },
    include: {
      category: true,
      brand: true,
      unit: true,
      stocks: {
        include: {
          warehouse: true,
        },
      },
    },
  });

  // Seed initial stock if specified
  const initialQty = Number(initialStock || stockQty || 0);
  if (initialQty > 0) {
    let targetWhId = warehouseId;
    if (!targetWhId) {
      const defaultWh = await prisma.warehouse.findFirst({
        where: { organizationId, deletedAt: null },
      });
      if (defaultWh) targetWhId = defaultWh.id;
    }

    if (targetWhId) {
      await prisma.stock.create({
        data: {
          organizationId,
          warehouseId: targetWhId,
          productId: product.id,
          quantity: initialQty,
        },
      }).catch(() => {});
    }
  }

  return await getById(product.id);
};

const getAll = async (query) => {
  const { page = 1, limit = 50, organizationId, search, categoryId, brandId, isActive } = query;
  const where = {
    deletedAt: null,
    ...(organizationId && { organizationId }),
    ...(categoryId && { categoryId }),
    ...(brandId && { brandId }),
    ...(isActive !== undefined && { isActive: isActive === 'true' || isActive === true }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
        unit: true,
        stocks: {
          include: {
            warehouse: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { name: 'asc' },
    }),
    prisma.product.count({ where }),
  ]);
  return { products, pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / limit) } };
};

const getById = async (id) =>
  await prisma.product.findFirst({
    where: { id, deletedAt: null },
    include: {
      category: true,
      brand: true,
      unit: true,
      stocks: {
        include: {
          warehouse: true,
        },
      },
      variants: true,
    },
  });

const getByBarcode = async (code, organizationId) => {
  return await prisma.product.findFirst({
    where: {
      deletedAt: null,
      ...(organizationId && { organizationId }),
      OR: [
        { barcode: code },
        { sku: code },
      ],
    },
    include: {
      category: true,
      unit: true,
      stocks: true,
    },
  });
};

const update = async (id, data) => await prisma.product.update({ where: { id }, data });

const remove = async (id) => await prisma.product.update({ where: { id }, data: { deletedAt: new Date() } });

module.exports = { create, getAll, getById, getByBarcode, update, remove };
