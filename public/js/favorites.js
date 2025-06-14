import { apiGet } from '/js/api.js';

export async function initFavorites() {
  const ul = document.getElementById('favorites-list');
  if (!ul) return;

  try {
    const { quizzes } = await apiGet('/api/quiz/favorites');

    if (!quizzes.length) {
      ul.innerHTML = '<li>No favorites yet.</li>';
      return;
    }

    ul.innerHTML = quizzes.map(q => `
      <li><a href="/quiz/${q._id}" class="js-link">${q.title}</a></li>
    `).join('');
  } catch (err) {
    ul.innerHTML = `<li style="color:red;">Error: ${err.message}</li>`;
  }
}
