const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/auth');
const userController = require('../controllers/user');

router.get('/profile', authenticateJWT, userController.getUser);

module.exports = router;