


    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-container").innerHTML = data;

            // 👇 Aquí debes ejecutar el script del menú
            const menuToggle = document.getElementById("menu-toggle");
            const navList = document.getElementById("nav-list");

            if (menuToggle && navList) {
                menuToggle.addEventListener("click", function (event) {
                    event.stopPropagation();
                    navList.classList.toggle("active");
                });

                document.addEventListener("click", function (event) {
                    if (!navList.contains(event.target) && !menuToggle.contains(event.target)) {
                        navList.classList.remove("active");
                    }
                });
            }
        });


// para que aparezca el header 

document.addEventListener('DOMContentLoaded', () => {
    fetch('/frontend/public/views/components/header.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('header').innerHTML = data;
        })
        .catch(error => console.error('Error al cargar el header:', error));
});
