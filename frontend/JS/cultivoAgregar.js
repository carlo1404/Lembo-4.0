document.getElementById("cultivoForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    // Asegurar que usuario_id se agregue correctamente
    const usuarioId = document.getElementById("usuario_id").value;
    formData.append("usuario_id", usuarioId);

    fetch("http://localhost:3000/api/cultivos", {
        method: "POST",
        body: formData, // Enviamos FormData directamente
    })
    .then(response => response.json())
    .then(data => {
        console.log("✅ Respuesta del servidor:", data);

        const successMessage = document.createElement('div');
        successMessage.textContent = 'Cultivo agregado exitosamente!';
        successMessage.style.color = 'green';
        successMessage.style.fontWeight = 'bold';
        successMessage.style.marginTop = '10px';
        document.querySelector('.form-container').appendChild(successMessage);

        setTimeout(() => {
            window.location.href = 'cultivos.html';
        }, 3000);
    })
    .catch(error => {
        console.error("❌ Error:", error);
    });
});

document.getElementById("imagen").addEventListener("change", function(event) {
    const file = event.target.files[0];
    const preview = document.getElementById("preview-img");

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = "block";
            preview.style.maxWidth = "150px";
            preview.style.marginTop = "10px";
            preview.style.borderRadius = "10px";
        };

        reader.readAsDataURL(file);
    } else {
        preview.style.display = "none";
    }
});