document.getElementById("cultivoForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = this;
    const formData = new FormData(form);

    try {
        const response = await fetch("http://localhost:3000/api/cultivos", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            alert("✅ Cultivo agregado correctamente");
            console.log(data);

            setTimeout(() => {
                window.location.href = 'cultivos.html';
            }, 3000);
        } else {
            alert("❌ Error: " + (data.message || data.error));
        }
    } catch (err) {
        console.error("❌ Error en la petición:", err);
        alert("❌ Hubo un error al conectar con el servidor.");
    }
});