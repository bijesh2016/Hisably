const express = require('express');
const router = express.Router();
const branchController = require('./branch.controller');
const { authenticate, validate } = require('../../middlewares');
const branchValidator = require('./branch.validator');

router.use(authenticate);

router.post('/', validate(branchValidator.create), branchController.create);
router.get('/', branchController.getAll);
router.get('/:id', branchController.getById);
router.patch('/:id', validate(branchValidator.update), branchController.update);
router.delete('/:id', branchController.remove);

module.exports = router;
