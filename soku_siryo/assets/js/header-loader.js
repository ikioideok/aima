function loadHeader() {
    return fetch('partials/_header.html')
        .then(response => response.text())
        .then(data => {
            const placeholder = document.getElementById('header-placeholder');
            if (placeholder) {
                placeholder.outerHTML = data;
            }
        });
}