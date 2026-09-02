const express = require('express');
const router = express.Router();
const warehouseController = require('./warehouse.controller');
const { authenticate, validate } = require('../../middlewares');
const warehouseValidator = require('./warehouse.validator');

router.use(authenticate);

router.post('/', validate(warehouseValidator.create), warehouseController.create);
router.get('/', warehouseController.getAll);
router.get('/:id', warehouseController.getById);
router.patch('/:id', validate(warehouseValidator.update), warehouseController.update);
router.delete('/:id', warehouseController.remove);

module.exports = router;
