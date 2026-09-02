const express = require('express');
const router = express.Router();
const expenseController = require('./expense.controller');
const { authenticate, validate } = require('../../middlewares');
const expenseValidator = require('./expense.validator');

router.use(authenticate);

router.post('/', validate(expenseValidator.create), expenseController.create);
router.get('/', expenseController.getAll);
router.get('/:id', expenseController.getById);
router.patch('/:id', validate(expenseValidator.update), expenseController.update);
router.delete('/:id', expenseController.remove);

module.exports = router;
