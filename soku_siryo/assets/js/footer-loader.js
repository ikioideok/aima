function loadFooter() {
    return fetch('partials/_footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok for footer');
            }
            return response.text();
        })
        .then(data => {
            const placeholder = document.getElementById('footer-placeholder');
            if (placeholder) {
                placeholder.outerHTML = data;
            }
        })
        .catch(error => {
            console.error('Failed to load footer:', error);
        });
}