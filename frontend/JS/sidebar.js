document.addEventListener('DOMContentLoaded', function() {
    fetch("/frontend/public/views/components/sidebar.html")
        .then(response => response.text())
        .then(data => {
            document.querySelector(".sidebar, .sidebar__logo, .sidebar__nav-icons").innerHTML = data;
        })
        .catch(error => console.error("Error cargando el sidebar: ", error));
});