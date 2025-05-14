const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { registerValidator, loginValidator } = require('../middleware/validators/authValidator');
const validate = require('../middleware/validators/validate');
const { authenticateJWT } = require('../middleware/authenticateJWT');
const authController = require('../controllers/auth');

const loginLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login requests. Try again after 15min',
});

const registerLimit = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: 'Too many register requests. Try again later',
});


router.get('/', authController.getHome);

router.get('/home', authController.getHome);

router.get('/quizler', authController.getHome);

router.get('/login', authController.getLogin);

router.get('/register',  authController.getRegister);

router.get('/forgot-password', authController.getForgotPassword);

router.post('/authorize', loginLimit, loginValidator, validate('login'),  authController.login);

router.post('/create-user', registerLimit, registerValidator, validate('register'), authController.register);

router.get('/refresh-token', authController.refreshToken);

router.get('/logout', authController.logout);

router.post('/forgot-password', authController.forgotPassword);

router.get('/reset-password/:token', authController.getResetPassword);

router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;