// models/Result.js
const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

resultSchema.pre('save', function (next) {
  this.percentage = Math.round((this.correctAnswers / this.totalQuestions) * 100);
  next();
});

module.exports = mongoose.model('Result', resultSchema);
