document.getElementById("cultivoForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    // Asegurar que usuario_id se agregue correctamente
    const usuarioId = document.getElementById("usuario_id").value;
    formData.append("usuario_id", usuarioId);

    const cultivoData = Object.fromEntries(formData.entries());

    fetch("http://localhost:3000/api/cultivos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(cultivoData),
    })
    .then(response => response.json())
    .then(data => {
        console.log("✅ Respuesta del servidor:", data);

        // Mostrar el mensaje de éxito en el formulario
        const successMessage = document.createElement('div');
        successMessage.textContent = 'Cultivo agregado exitosamente!';
        successMessage.style.color = 'green';
        successMessage.style.fontWeight = 'bold';
        successMessage.style.marginTop = '10px';
        document.querySelector('.form-container').appendChild(successMessage);

        // Espera 3 segundos y redirige a cultivos.html
        setTimeout(() => {
            window.location.href = 'cultivos.html'; // Redirige a la página de cultivos
        }, 3000); // 3000 milisegundos = 3 segundos
    })
    .catch(error => {
        console.error("❌ Error:", error);
    });
});
