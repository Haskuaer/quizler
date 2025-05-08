const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { authenticateJWT } = require('../middleware/authenticateJWT');

router.get('/', authController.getHome);

router.get('/home', authController.getHome);

router.get('/quizler', authController.getHome);

router.get('/login', authController.getLogin);

router.get('/register', authController.getRegister);

router.post('/authorize', authController.login);

router.post('/create-user', authController.register);

router.get('/refresh-token', authController.refreshToken);

router.get('/logout', authController.logout);

module.exports = router;