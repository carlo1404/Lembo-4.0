document.addEventListener('DOMContentLoaded', function () {
    // Agregar funcionalidad al botón volver
    document.getElementById("backButton")?.addEventListener('click', () => {
        window.location.href = "listar-usuarios.html";
    });

    // Seleccionar elementos del DOM
    const nameInput = document.querySelector('.register__input--name');
    const apellidoInput = document.querySelector('.register__input--lastname');
    const idInput = document.querySelector('.register__input--id');
    const phoneInput = document.querySelector('.register__input--phone');
    const rolSelect = document.querySelector('.form__select');
    const userForm = document.querySelector('.form');

    // Objeto para almacenar los datos del usuario
    const userData = {
        name: '',
        apellido: '',
        id: '',
        phone: '',
        rol: ''
    };

    // Evento para validar el formulario al enviar
    userForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Evitar el envío del formulario

        // Capturar los valores actuales de los campos
        userData.name = nameInput.value.trim();
        userData.apellido = apellidoInput.value.trim();
        userData.id = idInput.value.trim();
        userData.phone = phoneInput.value.trim();
        userData.rol = rolSelect.value.trim();
        console.log("Enviando formulario...", userData);
        
        if (
            userData.name === '' || userData.apellido === '' || userData.id === '' || userData.phone === '' || userData.rol === ''
        ) {
            showMessage('Error: Debes llenar todos los campos', 'error');
            return;
        }else{
            // Si todo está correcto, mostrar mensaje de éxito
            showMessage('¡Usuario agregado con éxito!', 'correcto');
            setTimeout(() => {
                window.location.href = '/frontend/public/views/listar-usuarios.html'; // Redirigir a la lista de usuarios después de 2 segundos
            }, 2000);
        }
    });

    // Función para leer el texto de los inputs
    function readText(e) {
        console.log('Leyendo input:', e.target);
        if (e.target === nameInput) {
            userData.name = e.target.value.trim();
        } else if (e.target === apellidoInput) {
            userData.apellido = e.target.value.trim();
        } else if (e.target === idInput) {
            userData.id = e.target.value.trim();
        } else if (e.target === phoneInput) {
            userData.phone = e.target.value.trim();
        } else if (e.target === rolSelect) {
            userData.rol = e.target.value.trim();
        }
        console.log('Datos actualizados:', userData);
    }

    // Función para mostrar mensajes de error o éxito
    function showMessage(message, type) {
        const messageElement = document.createElement('P');
        messageElement.textContent = message;
        messageElement.classList.add(type === 'error' ? 'error' : 'correcto');
        userForm.appendChild(messageElement);

        setTimeout(() => {
            messageElement.remove();
        }, 4000);
    }

    // Eventos para capturar los valores de los inputs
    nameInput.addEventListener('input', readText);
    apellidoInput.addEventListener('input', readText);
    idInput.addEventListener('input', readText);
    phoneInput.addEventListener('input', readText);
    rolSelect.addEventListener('change', readText); // Usar 'change' para el select
});
