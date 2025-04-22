document.addEventListener('DOMContentLoaded', function () {
    // Elementos del formulario
    const sensorForm = document.querySelector('.form');
    const tipoSensor = document.getElementById('unidad');
    const idSensor = document.getElementById('id');
    const nombreSensor = document.getElementById('name');
    const unidadMedida = document.getElementById('medida');
    const estadoSensor = document.getElementById('estado');
    const tiempoMuestreo = document.getElementById('Tiempo');
    const imagenSensor = document.getElementById('img');
    const descripcion = document.getElementById('descripcion');

    // Validación al enviar
    sensorForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(sensorForm);

        // Validar campos obligatorios
        if (
            formData.get('tipo_sensor') === '' ||
            formData.get('id') === '' ||
            formData.get('nombre') === '' ||
            formData.get('estado') === ''
        ) {
        
            showMessage('Los campos ID, tipo de sensor, estado y nombre son obligatorios.', 'error');
            return;
        }

        // Enviar datos al servidor
        fetch('http://localhost:3000/api/sensores', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            showMessage('¡Sensor agregado con éxito!');
            console.log('Respuesta del servidor:', data);

            // Redirigir después de un tiempo
            setTimeout(() => {
                window.location.href = "listar-sensor.html";
            }, 3000);
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('Error al enviar los datos al servidor.', 'error');
        });
    });

    // Mostrar mensajes
    function showMessage(message, type) {
        const messageElement = document.createElement('P');
        messageElement.textContent = message;
        messageElement.classList.add(type === 'error' ? 'error' : 'correcto');
        sensorForm.appendChild(messageElement);

        setTimeout(() => {
            messageElement.remove();
        }, 4000);
    }
});
