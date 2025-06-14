import { apiGet, apiPost } from '/js/api.js';

export async function initQuiz() {
  const query = new URLSearchParams(window.location.search);
  const quizId = query.get('id');
  const csrf = document.querySelector('meta[name="csrf-token"]')?.content;

  if (!quizId) {
    document.getElementById('quiz-title').textContent = '❌ Quiz ID not found in URL.';
    return;
  }

  let quiz;
  try {
    const res = await apiGet(`/api/quiz/${quizId}`);
    quiz = res.quiz;
    document.getElementById('quiz-title').textContent = quiz.title;
  } catch (err) {
    document.getElementById('quiz-title').textContent = '❌ Failed to load quiz.';
    return;
  }

  const container = document.getElementById('quiz-container');
  const input = document.getElementById('answer-input');
  const flagImg = document.getElementById('flag-img');
  const progressDisplay = document.getElementById('progress');
  const message = document.getElementById('message');
  const quizForm = document.getElementById('quiz-form');
  const likeBtn = document.getElementById('like-btn');
  const timerDisplay = document.getElementById('timer');

  let index = 0;
  let timerInterval;
  let timeLeft = quiz.timeLimit || 60;
  let quizStarted = false;
  let paused = false;
  let correct = new Array(quiz.questions.length).fill(false);

  function loadQuestion(i) {
    const q = quiz.questions[i];
    flagImg.src = q.imageUrl;
    input.value = '';
    updateProgress();
    message.textContent = correct[i] ? '✔️ Already answered.' : '';
  }

  function updateProgress() {
    const count = correct.filter(Boolean).length;
    progressDisplay.textContent = `✅ ${count} / ${quiz.questions.length}`;
  }

  function updateTimer() {
    timerDisplay.textContent = `⏳ ${timeLeft}s`;
  }

  function startTimer() {
    updateTimer();
    timerInterval = setInterval(() => {
      if (!paused) {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          endQuiz('⏰ Time’s up!');
        }
      }
    }, 1000);
  }

  function endQuiz(reason) {
    clearInterval(timerInterval);
    const correctTotal = correct.filter(Boolean).length;

    container.innerHTML = `
      <h2>${reason}</h2>
      <p>You scored ${correctTotal} / ${quiz.questions.length}</p>
    `;

    // Optionally send result to backend
    apiPost('/api/quiz/submit-quiz', {
      quizId: quiz._id,
      correctAnswers: correctTotal
    }).catch(err => console.warn('Submit failed:', err.message));
  }

  document.getElementById('start-btn').onclick = () => {
    if (!quizStarted) {
      quizStarted = true;
      container.style.display = 'block';
      loadQuestion(index);
      startTimer();
    }
  };

  document.getElementById('stop-btn').onclick = () => (paused = true);
  document.getElementById('resume-btn').onclick = () => (paused = false);
  document.getElementById('giveup-btn').onclick = () => endQuiz('🏳️ Gave up!');

  document.getElementById('next-btn').onclick = () => {
    index = (index + 1) % quiz.questions.length;
    loadQuestion(index);
  };
  document.getElementById('prev-btn').onclick = () => {
    index = (index - 1 + quiz.questions.length) % quiz.questions.length;
    loadQuestion(index);
  };

  quizForm.onsubmit = (e) => {
    e.preventDefault();
    const answer = input.value.trim().toLowerCase();
    const correctAnswer = quiz.questions[index].answer.trim().toLowerCase();

    if (answer === correctAnswer) {
      correct[index] = true;
      message.textContent = '✅ Correct!';
      if (correct.every(Boolean)) {
        endQuiz('🎉 All correct!');
      } else {
        document.getElementById('next-btn').click();
      }
    } else {
      message.textContent = '❌ Try again.';
    }
  };

  likeBtn.onclick = async () => {
    try {
      const res = await apiPost(`/api/quiz/${quiz._id}/like`, {}, csrf);
      alert(res.message);
    } catch (err) {
      alert('Failed to like quiz: ' + err.message);
    }
  };
}