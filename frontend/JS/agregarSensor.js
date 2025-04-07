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

    // Objeto con datos del sensor
    const sensorData = {
        tipo: '',
        id: '',
        nombre: '',
        unidad: '',
        estado: '',
        tiempo: '',
        imagen: '',
        descripcion: ''
    };

    // Función para leer y guardar los datos
    function readInput(e) {
        const target = e.target;

        if (target === tipoSensor) {
            sensorData.tipo = target.value.trim();
        } else if (target === idSensor) {
            sensorData.id = target.value.trim();
        } else if (target === nombreSensor) {
            sensorData.nombre = target.value.trim();
        } else if (target === unidadMedida) {
            sensorData.unidad = target.value.trim();
        } else if (target === estadoSensor) {
            sensorData.estado = target.value.trim();
        } else if (target === tiempoMuestreo) {
            sensorData.tiempo = target.value.trim();
        } else if (target === imagenSensor) {
            sensorData.imagen = target.files[0]?.name || ''; // Solo nombre del archivo
        } else if (target === descripcion) {
            sensorData.descripcion = target.value.trim();
        }

        console.log('Datos actualizados:', sensorData);
    }

    // Validación al enviar
    sensorForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Obtener valores actuales
        sensorData.tipo = tipoSensor.value.trim();
        sensorData.id = idSensor.value.trim();
        sensorData.nombre = nombreSensor.value.trim();
        sensorData.unidad = unidadMedida.value.trim();
        sensorData.estado = estadoSensor.value.trim();
        sensorData.tiempo = tiempoMuestreo.value.trim();
        sensorData.imagen = imagenSensor.files[0]?.name || '';
        sensorData.descripcion = descripcion.value.trim();

        // Validar campos
        if (
            sensorData.tipo === '' ||
            sensorData.id === '' ||
            sensorData.nombre === '' ||
            sensorData.unidad === '' ||
            sensorData.tiempo === '' ||
            sensorData.descripcion === ''
        ) {
            showMessage('Error: Todos los campos son obligatorios.', 'error');
            return;
        }

        // Preparar datos para enviar al servidor
        const dataToSend = {
            id: sensorData.id,
            tipo_sensor: sensorData.tipo,
            esatdo: sensorData.estado,
            nombre: sensorData.nombre,
            unidad_medida: sensorData.unidad,
            tiempo_muestreo: sensorData.tiempo,
            imagen: sensorData.imagen,
            descripcion: sensorData.descripcion
        };

        // Enviar datos al servidor
        fetch('http://localhost:5500/api/sensores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend)
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
            }, 5000);
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

    // Eventos para capturar inputs
    tipoSensor.addEventListener('change', readInput);
    idSensor.addEventListener('input', readInput);
    nombreSensor.addEventListener('input', readInput);
    unidadMedida.addEventListener('change', readInput);
    estadoSensor.addEventListener('change', readInput);
    tiempoMuestreo.addEventListener('input', readInput);
    imagenSensor.addEventListener('change', readInput);
    descripcion.addEventListener('input', readInput);
});
