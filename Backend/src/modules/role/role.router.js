const express = require('express');
const router = express.Router();
const roleController = require('./role.controller');
const { authenticate, validate } = require('../../middlewares');
const roleValidator = require('./role.validator');

router.use(authenticate);

router.post('/', validate(roleValidator.create), roleController.create);
router.get('/', roleController.getAll);
router.get('/:id', roleController.getById);
router.patch('/:id', validate(roleValidator.update), roleController.update);
router.delete('/:id', roleController.remove);

module.exports = router;
