document.getElementById('form-sensor').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevenir el comportamiento por defecto del formulario (evitar recarga)

  const formData = new FormData(this); // Crear un FormData con todos los campos del formulario

  fetch('http://localhost:3000/api/sensores', {
    method: 'POST',
    body: formData, // Enviar los datos del formulario
  })
  .then(response => response.json())
  .then(data => {
    const messageContainer = document.createElement('div');
    
    if (data.message === "Sensor agregado correctamente") {
      // Mostrar mensaje de éxito en color verde
      messageContainer.textContent = 'Tus datos fueron enviados correctamente';
      messageContainer.style.color = 'green';
      messageContainer.style.fontSize = '18px';
      messageContainer.style.fontWeight = 'bold';
      messageContainer.style.textAlign = 'center';
      messageContainer.style.marginTop = '20px';
      messageContainer.style.padding = '10px 0';

      // Agregar el mensaje al final del formulario
      document.querySelector('.form').appendChild(messageContainer);

      // Mostrar el mensaje durante 3 segundos
      setTimeout(() => {
        messageContainer.style.display = 'none'; // Ocultar el mensaje
        // Redirigir a la página de listar sensores después de 3 segundos
        window.location.href = 'listar-sensor.html'; // Asegúrate que la ruta es correcta
      }, 3000);
      
    } else {
      // Si hay algún error en el backend, puedes mostrarlo aquí
      alert('Hubo un error al agregar el sensor');
    }
  })
  .catch(error => {
    console.error('❌ Error:', error);
    alert('Hubo un problema al enviar los datos.');
  });
});
