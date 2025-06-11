const mongoose = require('./util/mongodb');
const Quiz = require('./models/Quiz'); // adjust the path if needed


const seedQuiz = async () => {
  const existing = await Quiz.findOne({ title: 'Country Flags Quiz' });
  if (existing) {
    console.log('Quiz already exists. No action taken.');
    return mongoose.disconnect();
  }

  const quiz = new Quiz({
    title: 'Country Flags Quiz',
    description: 'Identify the country by its flag.',
    category: 'Geography',
    timeLimit: 60,
    questions: [
      { imageUrl: '/images/flags/us.png', answer: 'United States' },
      { imageUrl: '/images/flags/fr.png', answer: 'France' },
      { imageUrl: '/images/flags/jp.png', answer: 'Japan' },
      { imageUrl: '/images/flags/br.png', answer: 'Brazil' },
      { imageUrl: '/images/flags/de.png', answer: 'Germany' },
    ]
  });

  await quiz.save();
  console.log('Seed quiz created!');
  mongoose.disconnect();
};

seedQuiz();