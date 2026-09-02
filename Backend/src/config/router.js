const express = require('express');

const routerConfig = (app) => {
  // Health check
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      message: 'Server is running',
      timestamp: new Date().toISOString(),
    });
  });

  // API routes
  app.use('/api/v1/auth', require('../modules/auth/auth.router'));
  app.use('/api/v1', require('../modules/auth/auth.router')); // backward compatibility
  app.use('/api/v1/users', require('../modules/user/user.router'));
  app.use('/api/v1/organizations', require('../modules/organization/organization.router'));
  app.use('/api/v1/branches', require('../modules/branch/branch.router'));
  app.use('/api/v1/roles', require('../modules/role/role.router'));
  app.use('/api/v1/permissions', require('../modules/permission/permission.router'));
  app.use('/api/v1/products', require('../modules/product/product.router'));
  app.use('/api/v1/categories', require('../modules/category/category.router'));
  app.use('/api/v1/brands', require('../modules/brand/brand.router'));
  app.use('/api/v1/units', require('../modules/unit/unit.router'));
  app.use('/api/v1/inventory', require('../modules/inventory/inventory.router'));
  app.use('/api/v1/stock-transfers', require('../modules/stockTransfer/stockTransfer.router'));
  app.use('/api/v1/warehouses', require('../modules/warehouse/warehouse.router'));
  app.use('/api/v1/customers', require('../modules/customer/customer.router'));
  app.use('/api/v1/suppliers', require('../modules/supplier/supplier.router'));
  app.use('/api/v1/purchases', require('../modules/purchase/purchase.router'));
  app.use('/api/v1/purchase-returns', require('../modules/purchaseReturn/purchaseReturn.router'));
  app.use('/api/v1/sales', require('../modules/sale/sale.router'));
  app.use('/api/v1/sale-returns', require('../modules/saleReturn/saleReturn.router'));
  app.use('/api/v1/expenses', require('../modules/expense/expense.router'));
  app.use('/api/v1/payments', require('../modules/payment/payment.router'));
  app.use('/api/v1/reports', require('../modules/report/report.router'));
  app.use('/api/v1/notifications', require('../modules/notification/notification.router'));
  app.use('/api/v1/reconciliation', require('../modules/reconciliation/reconciliation.router'));
};

module.exports = routerConfig;
