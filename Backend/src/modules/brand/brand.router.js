const express = require('express');
const router = express.Router();
const brandController = require('./brand.controller');
const { authenticate, validate } = require('../../middlewares');
const brandValidator = require('./brand.validator');

router.use(authenticate);

router.post('/', validate(brandValidator.create), brandController.create);
router.get('/', brandController.getAll);
router.get('/:id', brandController.getById);
router.patch('/:id', validate(brandValidator.update), brandController.update);
router.delete('/:id', brandController.remove);

module.exports = router;
