fetch("/frontend/public/views/components/header.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("header-container").innerHTML = data;

        setTimeout(() => {
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
        }, 0);
    });
// para que aparezca el header 

document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("menu-toggle");
    const navList = document.getElementById("nav-list");

    if (toggleButton && navList) {
        toggleButton.addEventListener("click", function () {
            navList.classList.toggle("active");
        });
    }
});
