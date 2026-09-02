const express = require('express');
const router = express.Router();
const productController = require('./product.controller');
const { authenticate, validate } = require('../../middlewares');
const productValidator = require('./product.validator');

router.use(authenticate);

router.post('/', validate(productValidator.create), productController.create);
router.get('/', productController.getAll);
router.get('/barcode/:code', productController.getByBarcode);
router.get('/:id', productController.getById);
router.patch('/:id', validate(productValidator.update), productController.update);
router.delete('/:id', productController.remove);

module.exports = router;
