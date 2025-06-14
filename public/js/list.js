import { apiGet } from '/js/api.js'; // Upewnij się, że ścieżka poprawna

export function initQuizList() {
    apiGet('/api/quiz/list')
        .then(renderQuizzes)
        .catch(err => alert('Error: ' + err.message));
}

function renderQuizzes(quizzes) {
    const tbody = document.getElementById('quiz-table-body');
    if (!tbody) return;

    tbody.innerHTML = quizzes.map(quiz => `
        <tr>
            <td>${quiz.title}</td>
            <td>${quiz.category}</td>
            <td>${quiz.description}</td>
            <td><a href="/quiz/quiz?id=${quiz._id}" class="js-link button">Try</a></td>
        </tr>
    `).join('');
}
