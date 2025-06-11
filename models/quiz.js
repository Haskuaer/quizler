const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    imageUrl: String,
    answer: String
});

const quizSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    timeLimit: Number,
    questions: [questionSchema]
});

module.exports = mongoose.model('Quiz', quizSchema);