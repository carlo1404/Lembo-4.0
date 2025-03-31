document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Captura los valores del formulario
        const nombre = document.querySelector('.register__input--name').value.trim();
        const id = document.querySelector('.register__input--id').value.trim();
        const apellido = document.querySelector('.register__input--lastname').value.trim();
        const telefono = document.querySelector('.register__input--phone').value.trim();
        const rol = document.querySelector('.form__select').value;

        // Valida si los campos están completos
        if (!nombre || !apellido || !telefono || !rol) {
            alert('Todos los campos son obligatorios');
            return;
        }

        // Crea un objeto con los datos del formulario
        const formData = {
            id,
            nombre,  // Se puede escribir así en ES6 (en lugar de nombre: nombre)
            apellido,
            numero_telefonico: telefono,
            rol
        };

        console.log('Datos a enviar:', formData); // Depuración: verificar qué se envía

        try {
            // Envía los datos al backend
            const response = await fetch('http://localhost:3000/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json(); // Intenta leer la respuesta JSON

            if (!response.ok) {
                console.error('Error del servidor:', result);
                throw new Error(result.error || 'Error desconocido');
            }

            alert('✅ Usuario agregado exitosamente');
            console.log(result);
            form.reset(); // Resetea el formulario
        } catch (error) {
            console.error('❌ Error en la solicitud:', error);
            alert('❌ Ocurrió un error al agregar el usuario');
        }
    });
});
