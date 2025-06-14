const Quiz = require('@models/Quiz');
const User = require('@models/User');
const Result = require('@models/Result');
const asyncHandler = require('@middleware/asyncHandler');
const AppError = require('@util/AppError');
const STATUS = require('@util/httpStatus');

const getAllQuizzes = asyncHandler( async (req, res) => {

    const quizzes = await Quiz.find();
    if (!quizzes) throw new AppError('No quizes found', STATUS.NOT_FOUND);

    res.status( STATUS.OK ).json( quizzes );
})

const getQuiz = asyncHandler( async (req, res) => {

    const quizId = req.params.id;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) throw new AppError( 'Quiz not found', STATUS.NOT_FOUND );

    res.status( STATUS.OK ).json({
        quiz: quiz,
        user: res.locals.user || null
    });
})

const submitQuiz = asyncHandler( async (req, res) => {

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

    res.status( STATUS.CREATED ).json({ message: 'Result saved', result });
});

const likeQuiz = asyncHandler( async (req, res) => {

    const userId = req.user.id;
    const quizId = req.params.id;

    const user = await User.findById(userId);
    if (!user) throw new AppError( 'User not found', STATUS.NOT_FOUND );

    const index = user.likedQuizzes.indexOf(quizId);
    let action;

    if (index === -1) {
        user.likedQuizzes.push(quizId);
        action = 'liked';
    } else {
        user.likedQuizzes.splice(index, 1);
        action = 'unliked';
    }

    await user.save();
    res.status( STATUS.OK ).json({ message: `Quiz ${action}` });
});

const getFavorites = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Unauthorized', STATUS.UNAUTHORIZED);

    const user = await User.findById(userId).populate('likedQuizzes');
    if (!user) throw new AppError('User not found', STATUS.NOT_FOUND);

    res.status(STATUS.OK).json({ quizzes: user.likedQuizzes });
});


const quizController = {
    getAllQuizzes,
    getFavorites,
    getQuiz,
    submitQuiz,
    likeQuiz
};

module.exports = quizController;