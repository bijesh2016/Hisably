const express = require('express');
const router = express.Router();
const purchaseReturnController = require('./purchaseReturn.controller');
const { authenticate, validate } = require('../../middlewares');
const purchaseReturnValidator = require('./purchaseReturn.validator');

router.use(authenticate);

router.post('/', validate(purchaseReturnValidator.create), purchaseReturnController.create);
router.get('/', purchaseReturnController.getAll);
router.get('/:id', purchaseReturnController.getById);
router.patch('/:id', validate(purchaseReturnValidator.update), purchaseReturnController.update);
router.delete('/:id', purchaseReturnController.remove);

module.exports = router;
