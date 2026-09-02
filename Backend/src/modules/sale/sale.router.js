const express = require('express');
const router = express.Router();
const saleController = require('./sale.controller');
const { authenticate, validate } = require('../../middlewares');
const saleValidator = require('./sale.validator');

router.use(authenticate);

router.post('/', validate(saleValidator.create), saleController.create);
router.get('/', saleController.getAll);
router.get('/:id', saleController.getById);
router.get('/:id/invoice', saleController.getInvoice);
router.post('/:id/send-reminder', saleController.sendReminder);
router.patch('/:id', validate(saleValidator.update), saleController.update);
router.delete('/:id', saleController.remove);

module.exports = router;
