import { apiGet } from './api.js';

document.addEventListener('click', async (e) => {
    const btn = e.target.closest('#logout');
    if (!btn) return;

    e.preventDefault();
    try {
        await apiGet('/api/auth/logout');
        window.location.href = '/';
    } catch (err) {
        alert('Błąd podczas wylogowania: ' + err.message);
    }
});
