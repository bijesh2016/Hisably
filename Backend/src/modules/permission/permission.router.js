const express = require('express');
const router = express.Router();
const permissionController = require('./permission.controller');
const { authenticate } = require('../../middlewares');

router.use(authenticate);

router.get('/', permissionController.getAll);
router.get('/:id', permissionController.getById);

module.exports = router;
