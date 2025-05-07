const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

router.get('/', adminController.getHome);

router.get('/home', adminController.getHome);

router.get('/quizler', adminController.getHome);

router.get('/login', adminController.getLogin);

router.get('/register', adminController.getRegister);

router.post('/authorize', adminController.login);

router.post('/create-user', adminController.register);

router.get('/logout', adminController.logout);

module.exports = router;