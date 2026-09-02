const express = require('express');
const router = express.Router();
const reportController = require('./report.controller');
const { authenticate } = require('../../middlewares');

router.use(authenticate);

router.get('/sales', reportController.salesReport);
router.get('/purchases', reportController.purchasesReport);
router.get('/inventory', reportController.inventoryReport);

module.exports = router;
