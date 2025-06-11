const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz');
const optionalAuth = require('../middleware/optionalAuth');

router.get('/quizzes', quizController.getAllQuizzes);

router.get('/quiz/:id', optionalAuth, quizController.getQuiz);

router.post('/submit-quiz', optionalAuth, quizController.submitQuiz)

module.exports = router;