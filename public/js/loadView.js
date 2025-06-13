//@param {string} viewPath
import { attachFormHandlers } from "./attachFormHandlers.js";
import { apiGet, apiPost } from './api.js';

async function loadView(viewPath) {
    const main = document.getElementById('main-content');

    if (!viewPath || viewPath === '/') {
        viewPath = 'home/menu';
    }

    try {
        const res = await fetch(`/views/${viewPath}`);
        if (!res.ok) throw new Error(`Error loading view`);
        const html = await res.text();

        main.innerHTML = html;
        attachFormHandlers(); 
    } catch (err) {
        main.innerHTML = `<p style="color:red;">${err.message}</p>`;
    }
}

function viewFromPath() {
    const path = window.location.pathname;
    return path === '/' ? 'home/menu' : path.replace(/^\/+/, '');
}

document.addEventListener('click', (e) => {
    const link = e.target.closest('a.js-link');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto:')) return;

    e.preventDefault();
    history.pushState(null, '', href);
    loadView(href.replace(/^\/+/, ''));
});

window.addEventListener('popstate', () => {
    const view = viewFromPath();
    loadView(view);
});

document.addEventListener('DOMContentLoaded', () => {
    loadView(viewFromPath());
});