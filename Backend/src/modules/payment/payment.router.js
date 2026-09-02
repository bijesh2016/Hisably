const express = require('express');
const router = express.Router();
const paymentController = require('./payment.controller');
const { authenticate, validate } = require('../../middlewares');
const paymentValidator = require('./payment.validator');

router.use(authenticate);

router.post('/', validate(paymentValidator.create), paymentController.create);
router.get('/', paymentController.getAll);
router.get('/:id', paymentController.getById);
router.patch('/:id', validate(paymentValidator.update), paymentController.update);
router.delete('/:id', paymentController.remove);

module.exports = router;
