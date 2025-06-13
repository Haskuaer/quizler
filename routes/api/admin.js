const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { authenticateJWT } = require('@middleware/authenticateJWT');
const isAdmin = require('@middleware/isAdmin');
const adminController = require('@controllers/api/admin');

const userManage = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many requests. Try again after 15min',
});

router.get('/users', authenticateJWT, isAdmin, adminController.getUsers);

router.delete('/user/:id/delete', authenticateJWT, isAdmin, userManage, adminController.deleteUser);

router.patch('/user/:id/toggle-active', authenticateJWT, isAdmin, userManage, adminController.toggleActive);

router.patch('/user/:id/update', authenticateJWT, isAdmin, userManage, adminController.updateUser);

module.exports = router;