export function attachFormHandlers() {
    const forms = document.querySelectorAll('form[data-api]');

    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const url = form.getAttribute('action');
            const method = form.getAttribute('method')?.toUpperCase() || 'POST';
            const csrf = form.querySelector('input[name="_csrf"]')?.value;

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                const res = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        ...(csrf && { 'X-CSRF-Token': csrf }),
                    },
                    credentials: 'include',
                    body: JSON.stringify(data)
                });

                const result = await res.json();

                if (!res.ok) {
                    alert(result.message || 'Error');
                } else {
                    alert(result.message || 'Success');
                    if (form.dataset.redirect) {
                        window.location.href = form.dataset.redirect;
                    }
                }
            } catch (err) {
                console.error(err);
                alert('Something went wrong');
            }
        });
    });
}
