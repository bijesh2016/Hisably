const express = require('express');
const router = express.Router();
const customerController = require('./customer.controller');
const { authenticate, validate } = require('../../middlewares');
const customerValidator = require('./customer.validator');

router.use(authenticate);

router.post('/', validate(customerValidator.create), customerController.create);
router.get('/', customerController.getAll);
router.get('/:id', customerController.getById);
router.post('/:id/send-reminder', customerController.sendReminder);
router.patch('/:id', validate(customerValidator.update), customerController.update);
router.delete('/:id', customerController.remove);

module.exports = router;
