const express = require('express');
const router = express.Router();
const purchaseController = require('./purchase.controller');
const { authenticate, validate } = require('../../middlewares');
const purchaseValidator = require('./purchase.validator');

router.use(authenticate);

router.post('/', validate(purchaseValidator.create), purchaseController.create);
router.get('/', purchaseController.getAll);
router.get('/:id', purchaseController.getById);
router.patch('/:id', validate(purchaseValidator.update), purchaseController.update);
router.delete('/:id', purchaseController.remove);

module.exports = router;
