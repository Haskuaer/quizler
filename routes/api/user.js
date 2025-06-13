const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { authenticateJWT } = require('@middleware/authenticateJWT');
const userController = require('@controllers/api/user');

const userChange = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many requests. Try again after 15min',
});

router.patch('/edit-profile', authenticateJWT, userChange, userController.editProfile);

module.exports = router;