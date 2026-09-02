const express = require('express');
const router = express.Router();
const reconciliationController = require('./reconciliation.controller');
const { authenticate } = require('../../middlewares');

router.use(authenticate);

router.get('/qr', reconciliationController.getQrReconciliation);
router.post('/reconcile', reconciliationController.reconcileAll);

module.exports = router;
