document.addEventListener('DOMContentLoaded', () => {
    fetch("/frontend/public/views/components/header.html")
        .then(response => response.text())
        .then(data => {
            document.querySelector('header').innerHTML = data;
        })
        .catch(error => console.error('Error al cargar el header:', error));
});
