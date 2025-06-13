const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz');
const optionalAuth = require('../middleware/optionalAuth');
const { authenticateJWT } = require('../middleware/authenticateJWT');

router.get('/quizzes', quizController.getAllQuizzes);

router.get('/quiz/:id', optionalAuth, quizController.getQuiz);

router.post('/submit-quiz', optionalAuth, quizController.submitQuiz);

router.post('/quiz/:id/like', authenticateJWT, quizController.likeQuiz);

router.get('/favorites', authenticateJWT, quizController.getFavorites);

module.exports = router;