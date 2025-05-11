const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { authenticateJWT } = require('../middleware/authenticateJWT');
const userController = require('../controllers/user');

const userChange = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many requests. Try again after 15min',
});

router.get('/profile', authenticateJWT, userController.getUser);

router.get('/profile/edit', authenticateJWT, userController.getEditProfile);

router.post('/profile/edit', authenticateJWT, userChange, userController.postEditProfile);

module.exports = router;