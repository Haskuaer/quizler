const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authenticateJWT');
const isAdmin = require('../middleware/isAdmin');
const adminController = require('../controllers/admin');

router.get('/admin/dashboard', authenticateJWT, isAdmin, adminController.adminDashboard);

router.get('/admin/users', authenticateJWT, isAdmin, adminController.getUsers);

router.post('/admin/user/:id/delete', authenticateJWT, isAdmin, adminController.deleteUser);

router.post('/admin/user/:id/toggle-active', authenticateJWT, isAdmin, adminController.toggleActive);

router.post('/admin/user/:id/update', authenticateJWT, isAdmin, adminController.updateUser);

module.exports = router;