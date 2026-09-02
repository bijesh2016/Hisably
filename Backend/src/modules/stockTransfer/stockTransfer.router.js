const express = require('express');
const router = express.Router();
const stockTransferController = require('./stockTransfer.controller');
const { authenticate, validate } = require('../../middlewares');
const stockTransferValidator = require('./stockTransfer.validator');

router.use(authenticate);

router.post('/', validate(stockTransferValidator.create), stockTransferController.create);
router.get('/', stockTransferController.getAll);
router.get('/:id', stockTransferController.getById);
router.patch('/:id/status', validate(stockTransferValidator.updateStatus), stockTransferController.updateStatus);
router.delete('/:id', stockTransferController.remove);

module.exports = router;
