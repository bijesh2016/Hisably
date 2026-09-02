const express = require('express');
const router = express.Router();
const unitController = require('./unit.controller');
const { authenticate, validate } = require('../../middlewares');
const unitValidator = require('./unit.validator');

router.use(authenticate);

router.post('/', validate(unitValidator.create), unitController.create);
router.get('/', unitController.getAll);
router.get('/:id', unitController.getById);
router.patch('/:id', validate(unitValidator.update), unitController.update);
router.delete('/:id', unitController.remove);

module.exports = router;
