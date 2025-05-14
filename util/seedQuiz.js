const mongoose = require('./mongodb');
const Quiz = require('../models/quiz');

async function seedQuiz() {
  await Quiz.deleteMany({}); // czyść przed seedem

  const quiz = new Quiz({
    title: 'Znane flagi',
    description: 'Rozpoznaj państwa po fladze.',
    category: 'geografia',
    questions: [
      {
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg',
        answer: 'Stany Zjednoczone'
      },
      {
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Flag_of_Canada.svg',
        answer: 'Kanada'
      },
      {
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg',
        answer: 'Niemcy'
      }
    ]
  });

  await quiz.save();
  console.log('✅ Quiz dodany');
  mongoose.connection.close();
}

seedQuiz();
