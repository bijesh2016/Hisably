const express = require('express');
const router = express.Router();
const categoryController = require('./category.controller');
const { authenticate, validate } = require('../../middlewares');
const categoryValidator = require('./category.validator');

router.use(authenticate);

router.post('/', validate(categoryValidator.create), categoryController.create);
router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);
router.patch('/:id', validate(categoryValidator.update), categoryController.update);
router.delete('/:id', categoryController.remove);

module.exports = router;
