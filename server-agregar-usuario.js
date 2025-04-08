document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = document.querySelector('.register__input--name').value.trim();
        const id = document.querySelector('.register__input--id').value.trim();
        const apellido = document.querySelector('.register__input--lastname').value.trim();
        const telefono = document.querySelector('.register__input--phone').value.trim();
        const rol = document.querySelector('.register__input--rol').value;

        if (!nombre || !apellido || !telefono || !rol) {
            alert('Todos los campos son obligatorios');
            return;
        }

        const formData = {
            id,
            nombre,
            apellido,
            numero_telefonico: telefono,
            rol
        };

        console.log('Datos a enviar:', formData);

        try {
            const response = await fetch('http://localhost:3000/api/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            if (!response.ok) {
                console.error('Error del servidor:', result);
                throw new Error(result.error || 'Error desconocido');
            }

            alert('✅ Usuario agregado exitosamente');
            console.log(result);
            form.reset();

            // 👉 Redirige a listaUsuarios.html
            window.location.href = '/views/listaUsuarios.html';

        } catch (error) {
            console.error(' Error en la solicitud:', error);
            alert(' Ocurrió un error al agregar el usuario');
        }
    });
});
