const express = require('express');
const router = express.Router();
const quizController = require('@controllers/api/quiz');
const optionalAuth = require('@middleware/optionalAuth');
const { authenticateJWT } = require('@middleware/authenticateJWT');

router.get('/list', quizController.getAllQuizzes);

router.get('/:id', optionalAuth, quizController.getQuiz);

router.post('/submit-quiz', optionalAuth, quizController.submitQuiz);

router.post('/:id/like', authenticateJWT, quizController.likeQuiz);

router.get('/favorites', authenticateJWT, quizController.getFavorites);

module.exports = router;