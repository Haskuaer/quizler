const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz');

router.get('/quizzes', quizController.getAllQuizzes);

module.exports = router;