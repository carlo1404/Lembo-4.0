document.getElementById('form-sensor').addEventListener('submit', function (event) {
  event.preventDefault();

  const formData = new FormData(this);
  
  // Validar campos requeridos
  const campos = ['nombre', 'tipo', 'unidad', 'tiempo'];
  for (let campo of campos) {
    if (!formData.get(campo)) {
      mostrarError(`El campo ${campo} es requerido`);
      return;
    }
  }

  // Enviar como FormData directamente
  fetch('http://localhost:5500/api/sensores', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (!response.ok) {
      return response.text().then(text => {
        throw new Error(text || 'Error en el servidor');
      });
    }
    return response.json();
  })
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
    mostrarError(error.message || 'Error al procesar la solicitud');
  });
});

function mostrarError(mensaje) {
  const errorContainer = document.createElement('div');
  errorContainer.textContent = mensaje;
  errorContainer.style.color = 'red';
  errorContainer.style.fontSize = '16px';
  errorContainer.style.textAlign = 'center';
  errorContainer.style.marginTop = '10px';
  errorContainer.style.padding = '10px';
  errorContainer.style.backgroundColor = '#fff3f3';
  errorContainer.style.border = '1px solid #ff0000';
  errorContainer.style.borderRadius = '4px';
  
  const form = document.querySelector('.form');
  form.appendChild(errorContainer);
  
  setTimeout(() => errorContainer.remove(), 5000);
}
