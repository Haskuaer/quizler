const Quiz = require('../models/quiz');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../util/AppError');
const STATUS = require('../util/httpStatus');

const getAllQuizzes = asyncHandler( async (req, res, next) => {

    const quizzes = await Quiz.find();
    if (!quizzes) throw new AppError('No quizes found', STATUS.NOT_FOUND);

    res.render('quizzes', { quizzes });
})

const quizController = {
    getAllQuizzes
};

module.exports = quizController;