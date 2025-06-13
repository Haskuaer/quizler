// utils/api.js
export async function apiGet(url) {
    return sendRequest(url, 'GET');
}

export async function apiPost(url, data = {}) {
    return sendRequest(url, 'POST', data);
}

async function sendRequest(url, method, data = null) {
    const headers = {
        'Content-Type': 'application/json',
    };

    const csrfToken = getCsrfToken();
    if (csrfToken && method !== 'GET') {
        headers['X-CSRF-Token'] = csrfToken;
    }

    const options = {
        method,
        headers,
        credentials: 'include',
    };

    if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
    }

    const res = await fetch(url, options);
    const contentType = res.headers.get('Content-Type');

    const responseData = contentType?.includes('application/json')
        ? await res.json()
        : await res.text();

    if (!res.ok) {
        throw new Error(responseData?.message || res.statusText);
    }

    return responseData;
}

function getCsrfToken() {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
}