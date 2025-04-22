document.addEventListener('DOMContentLoaded', function () {
    // Elementos del formulario
    const sensorForm = document.getElementById("form-sensor");
    const tipoSensor = document.getElementById('tipo_sensor'); // Corresponde al select "tipo_sensor"
    const idSensor = document.getElementById('id');
    const nombreSensor = document.getElementById('name');
    const unidadMedida = document.getElementById('unidad_medida');
    const estadoSensor = document.getElementById('estado');
    const tiempoMuestreo = document.getElementById('tiempo_muestreo');
    const imagenSensor = document.getElementById('imagen'); // Corresponde al input file "imagen"
    const descripcion = document.getElementById('descripcion');
  
    // Manejo del envío del formulario
    sensorForm.addEventListener('submit', function (e) {
      e.preventDefault();
  
      // Crear FormData a partir del formulario
      const formData = new FormData(sensorForm);
      console.log('Datos enviados:', Object.fromEntries(formData.entries()));
  
      // Validar campos obligatorios (todos son obligatorios excepto unidad_medida, tiempo_muestreo y descripción si así lo requieres)
      const requiredFields = ['tipo_sensor', 'id', 'nombre', 'estado'];
      const missingFields = requiredFields.filter(field => {
        const value = formData.get(field);
        return value === null || value.trim() === '';
      });
      if (missingFields.length > 0) {
        showMessage('Los campos ' + missingFields.join(', ') + ' son obligatorios.', 'error');
        return;
      }
      const id = parseInt(document.getElementById('id').value);
      if (isNaN(id)) {
          alert('El ID debe ser un número válido.');
          return;
      }

      // Verificación antes de enviar los datos
if (!tipoSensor.value || !idSensor.value || !nombreSensor.value || !estadoSensor.value) {
    showMessage('Los campos Tipo de sensor, ID, Nombre y Estado son obligatorios.', 'error');
    return;
  }
  
  
      // Validar que se haya seleccionado un archivo para la imagen
      if (imagenSensor.files.length === 0) {
        showMessage('La imagen del sensor es obligatoria.', 'error');
        return;
      }
  
      // Enviar datos al servidor
      fetch('http://localhost:3000/api/sensores', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(error => {
            throw new Error(error.message || 'Error en la respuesta del servidor');
          });
        }
        return response.json();
      })
      .then(data => {
        showMessage('¡Sensor agregado con éxito!');
        console.log('Respuesta del servidor:', data);
  
        // Redirigir después de 3 segundos
        setTimeout(() => {
          window.location.href = "listar-sensor.html";
        }, 3000);
      })
      .catch(error => {
        console.error('Error:', error);
        showMessage('Error al enviar los datos al servidor.', 'error');
      });
    });
  
    // Función para mostrar mensajes en el formulario
    function showMessage(message, type) {
      // Limpiar mensajes previos
      const existingMessages = sensorForm.querySelectorAll('p');
      existingMessages.forEach(msg => msg.remove());
  
      // Crear y agregar el mensaje
      const messageElement = document.createElement('P');
      messageElement.textContent = message;
      messageElement.classList.add(type === 'error' ? 'error' : 'correcto');
      sensorForm.appendChild(messageElement);
  
      // Quitar el mensaje después de 4 segundos
      setTimeout(() => {
        messageElement.remove();
      }, 4000);
    }
  });
  