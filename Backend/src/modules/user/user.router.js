const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { authenticate, isAdmin, isManager } = require('../../middlewares');

router.use(authenticate);

router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.post('/change-password', userController.changePassword);
router.patch('/change-password', userController.changePassword);

router.use(isManager);
router.get('/', userController.getUsers);
router.post('/', userController.createStaff);
router.get('/:id', userController.getUser);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
