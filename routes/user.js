const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authenticateJWT');
const userController = require('../controllers/user');

router.get('/profile', authenticateJWT, userController.getUser);

router.get('/profile/edit', authenticateJWT, userController.getEditProfile);

router.post('/profile/edit', authenticateJWT, userController.postEditProfile);

module.exports = router;