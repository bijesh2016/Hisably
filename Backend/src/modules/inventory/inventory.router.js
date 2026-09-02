const express = require('express');
const router = express.Router();
const inventoryController = require('./inventory.controller');
const { authenticate, validate } = require('../../middlewares');
const inventoryValidator = require('./inventory.validator');

router.use(authenticate);

router.post('/', validate(inventoryValidator.create), inventoryController.create);
router.get('/', inventoryController.getAll);
router.get('/:id', inventoryController.getById);
router.patch('/:id', validate(inventoryValidator.update), inventoryController.update);
router.delete('/:id', inventoryController.remove);

module.exports = router;
