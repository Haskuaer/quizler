const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { authenticateJWT } = require('../middleware/authenticateJWT');
const isAdmin = require('../middleware/isAdmin');
const adminController = require('../controllers/admin');

const userManage = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many requests. Try again after 15min',
});

router.get('/admin/dashboard', authenticateJWT, isAdmin, adminController.adminDashboard);

router.get('/admin/users', authenticateJWT, isAdmin, adminController.getUsers);

router.post('/admin/user/:id/delete', authenticateJWT, isAdmin, userManage, adminController.deleteUser);

router.post('/admin/user/:id/toggle-active', authenticateJWT, isAdmin, userManage, adminController.toggleActive);

router.post('/admin/user/:id/update', authenticateJWT, isAdmin, userManage, adminController.updateUser);

module.exports = router;