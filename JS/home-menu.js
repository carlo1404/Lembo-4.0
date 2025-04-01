document.getElementById("menu-toggle").addEventListener("click", function (event) {
    event.stopPropagation(); // Evita que el clic se propague al documento
    document.getElementById("nav-list").classList.toggle("active");
});

document.addEventListener("click", function (event) {
    const navList = document.getElementById("nav-list");
    const menuToggle = document.getElementById("menu-toggle");
    if (!navList.contains(event.target) && !menuToggle.contains(event.target)) {
        navList.classList.remove("active");
    }
});