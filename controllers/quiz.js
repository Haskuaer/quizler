const Quiz = require('../models/Quiz');
const Result = require('../models/Result');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../util/AppError');
const STATUS = require('../util/httpStatus');

const getAllQuizzes = asyncHandler( async (req, res, next) => {

    const quizzes = await Quiz.find();
    if (!quizzes) throw new AppError('No quizes found', STATUS.NOT_FOUND);

    res.render('quizzes', { quizzes });
})

const getQuiz = asyncHandler( async (req, res, next) => {

    const quizId = req.params.id;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) throw new AppError( 'Quiz not found', STATUS.NOT_FOUND );
    console.log('Incoming CSRF token:', req.headers['x-csrf-token'] || req.body._csrf);

    res.render('quiz', { 
        quiz: quiz, 
        user: res.locals.user || null,  
        csrfToken: req.csrfToken() 
    });
})

const submitQuiz = asyncHandler( async (req, res) => {

    console.log('Incoming CSRF token:', req.headers['x-csrf-token'] || req.body._csrf);
    console.log('Incoming quizId:', req.body.quizId);
    console.log('User:', req.user);

    const { quizId, correctAnswers } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) throw new AppError( 'Quiz not found', STATUS.NOT_FOUND );

    if (!req.user) return res.status(200).json({ message: 'Guest quiz completed, result not saved' });

    const result = await Result.create({
        user: req.user.id,
        quiz: quiz._id,
        correctAnswers,
        totalQuestions: quiz.questions.length
    });

    res.status(201).json({ message: 'Result saved', result });
})

const quizController = {
    getAllQuizzes,
    getQuiz,
    submitQuiz
};

module.exports = quizController;