const prisma = require('../../config/database');

const salesReport = async (query) => {
  const { organizationId, startDate, endDate } = query;
  const where = {
    ...(organizationId && { organizationId }),
    ...(startDate && { saleDate: { gte: new Date(startDate) } }),
    ...(endDate && { saleDate: { lte: new Date(endDate) } }),
  };
  return await prisma.sale.findMany({ where, orderBy: { saleDate: 'desc' } });
};

const purchasesReport = async (query) => {
  const { organizationId, startDate, endDate } = query;
  const where = {
    ...(organizationId && { organizationId }),
    ...(startDate && { purchaseDate: { gte: new Date(startDate) } }),
    ...(endDate && { purchaseDate: { lte: new Date(endDate) } }),
  };
  return await prisma.purchase.findMany({ where, orderBy: { purchaseDate: 'desc' } });
};

const inventoryReport = async (query) => {
  const { organizationId, warehouseId } = query;
  const where = {
    ...(warehouseId && { warehouseId }),
  };
  return await prisma.stock.findMany({ where, include: { product: true, warehouse: true } });
};

module.exports = { salesReport, purchasesReport, inventoryReport };
