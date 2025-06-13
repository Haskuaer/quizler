document.addEventListener('DOMContentLoaded', () => {
  // Read quiz data from DOM
  const quizDataEl = document.getElementById('quiz-data');
  if (!quizDataEl) {
    console.error('Quiz data element not found.');
    return;
  }
  const userData = document.getElementById('user-data');

const csrfMeta = document.querySelector('meta[name="csrf-token"]');
const csrfToken = csrfMeta ? csrfMeta.getAttribute('content') : null;

if (!csrfToken) {
  console.error('Missing CSRF token from <meta>!');
}

  let user;
  try {
    user = JSON.parse(userData.textContent);
  } catch (e) {
    console.error('Failed to parse user data:', e);
    return;
  }

  let quiz;
  try {
    quiz = JSON.parse(quizDataEl.textContent);
  } catch (e) {
    console.error('Failed to parse quiz data:', e);
    return;
  }

  if (!quiz || !Array.isArray(quiz.questions)) {
    console.error('Invalid or missing quiz data.');
    return;
  }

  let currentIndex = 0;
  let timerInterval;
  let timeLimit = quiz.timeLimit;
  let timeLeft = timeLimit;
  let quizStarted = false;
  let timerPaused = false;
  let answeredCorrectly = new Array(quiz.questions.length).fill(false);

  const progressDisplay = document.getElementById('progress');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  const flagImg = document.getElementById('flag-img');
  const form = document.getElementById('quiz-form');
  const input = document.getElementById('answer-input');
  const message = document.getElementById('message');
  const timerDisplay = document.getElementById('timer');
  const startBtn = document.getElementById('start-btn');
  const stopBtn = document.getElementById('stop-btn');
  const resumeBtn = document.getElementById('resume-btn');
  const giveUpBtn = document.getElementById('giveup-btn');
  const likeForm = document.getElementById('like-form');

  function updateProgress() {
    const correctCount = answeredCorrectly.filter(Boolean).length;
    progressDisplay.textContent = `✅ Correct: ${correctCount} / ${quiz.questions.length}`;
  }

  function loadQuestion(index) {
    const question = quiz.questions[index];
    flagImg.src = question.imageUrl;
    input.value = '';
    message.textContent = answeredCorrectly[index] ? '✔️ Already answered correctly.' : '';
    updateProgress();
  }

  function updateTimerDisplay() {
    timerDisplay.textContent = `⏳ Time Left: ${timeLeft}s`;
  }

  function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(() => {
      if (!timerPaused) {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          endQuiz('⏰ Time’s up!');
        }
      }
    }, 1000);
  }

    function stopTimer() {
    timerPaused = true;
  }

  function resumeTimer() {
    if (timerPaused) {
      timerPaused = false;
    }
  }

  function endQuiz(messageText) {

    clearInterval(timerInterval);
    const correctTotal = answeredCorrectly.filter(Boolean).length;

    if (user && user.id) {
      fetch('/submit-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify({
          quizId: quiz._id,
          correctAnswers: correctTotal
        })
      })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Server error: ${res.status} - ${text}`);
        }
        return res.json();
      })
      .then(data => console.log('Result:', data.message))
      .catch(err => console.error('Error saving result:', err));

    }

    document.getElementById('quiz-container').innerHTML = `
      <h2>${messageText}</h2>
      <p>You answered ${correctTotal} out of ${quiz.questions.length} correctly.</p>
      `;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!quizStarted || timerPaused) return;
    if (answeredCorrectly[currentIndex]) return;

    const userAnswer = input.value.trim().toLowerCase();
    const correct = quiz.questions[currentIndex].answer.trim().toLowerCase();

    if (userAnswer === correct) {
      answeredCorrectly[currentIndex] = true;
      updateProgress();

      if (answeredCorrectly.every(Boolean)) {
        endQuiz('🎉 All questions answered!');
      } else {
        let nextIndex = (currentIndex + 1) % quiz.questions.length;
        while (answeredCorrectly[nextIndex]) {
          nextIndex = (nextIndex + 1) % quiz.questions.length;
        }
        currentIndex = nextIndex;
        loadQuestion(currentIndex);
      }
    } else {
      message.textContent = '❌ Incorrect. Try again.';
    }
  });

  likeForm.addEventListener('submit', async (e) => {

    console.log('User:', user ? user.id : 'Guest');
    console.log('Quiz ID: ' + quiz._id);
    console.log('CSRF token used in fetch:', csrfToken);

    e.preventDefault();
    const res = await fetch(e.target.action, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
      },
      credentials: 'include'
    });

    const data = await res.json();
    alert(data.message);
  });

  prevBtn.addEventListener('click', () => {
    if (!quizStarted) return;

    let attempts = 0;
    do {
      currentIndex = (currentIndex - 1 + quiz.questions.length) % quiz.questions.length;
      attempts++;
    } while (answeredCorrectly[currentIndex] && attempts < quiz.questions.length);

    loadQuestion(currentIndex);
  });

  nextBtn.addEventListener('click', () => {
    if (!quizStarted) return;

    let attempts = 0;
    do {
      currentIndex = (currentIndex + 1) % quiz.questions.length;
      attempts++;
    } while (answeredCorrectly[currentIndex] && attempts < quiz.questions.length);

    loadQuestion(currentIndex);
  });

  startBtn.addEventListener('click', () => {
    if (!quizStarted) {
      quizStarted = true;
      loadQuestion(currentIndex);
      startTimer();
    }
  });

  stopBtn.addEventListener('click', () => stopTimer());
  resumeBtn.addEventListener('click', () => resumeTimer());
  giveUpBtn.addEventListener('click', () => endQuiz('🚩 You gave up!'));

  // Load first question
  loadQuestion(currentIndex);
});
