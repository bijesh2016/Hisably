const express = require('express');
const router = express.Router();
const saleReturnController = require('./saleReturn.controller');
const { authenticate, validate } = require('../../middlewares');
const saleReturnValidator = require('./saleReturn.validator');

router.use(authenticate);

router.post('/', validate(saleReturnValidator.create), saleReturnController.create);
router.get('/', saleReturnController.getAll);
router.get('/:id', saleReturnController.getById);
router.patch('/:id', validate(saleReturnValidator.update), saleReturnController.update);
router.delete('/:id', saleReturnController.remove);

module.exports = router;
