const express = require('express');
const router = express.Router();
const organizationController = require('./organization.controller');
const { authenticate, validate } = require('../../middlewares');
const organizationValidator = require('./organization.validator');

router.use(authenticate);

router.get('/platform-overview', organizationController.getPlatformOverview);
router.post('/superadmin-create', organizationController.createShopBySuperAdmin);
router.post('/:id/approve', organizationController.approveOrganization);
router.post('/:id/reject', organizationController.rejectOrganization);

router.post('/', validate(organizationValidator.create), organizationController.create);
router.get('/', organizationController.getAll);
router.get('/:id', organizationController.getById);
router.patch('/:id', validate(organizationValidator.update), organizationController.update);
router.delete('/:id', organizationController.remove);

module.exports = router;
