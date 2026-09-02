const express = require('express');
const router = express.Router();
const supplierController = require('./supplier.controller');
const { authenticate, validate } = require('../../middlewares');
const supplierValidator = require('./supplier.validator');

router.use(authenticate);

router.post('/', validate(supplierValidator.create), supplierController.create);
router.get('/', supplierController.getAll);
router.get('/:id', supplierController.getById);
router.patch('/:id', validate(supplierValidator.update), supplierController.update);
router.delete('/:id', supplierController.remove);

module.exports = router;
