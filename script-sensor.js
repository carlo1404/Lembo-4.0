document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');

    if (!form) {
        console.error('❌ Formulario no encontrado');
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        try {
            console.log("📤 Enviando datos del sensor");

            const response = await fetch('http://localhost:5500/api/sensores', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            console.log('✅ Sensor registrado:', result);
            alert('✅ Sensor agregado exitosamente');
            form.reset();
        } catch (error) {
            console.error('❌ Error:', error);
            alert(`❌ Error al agregar el sensor: ${error.message}`);
        }
    });
});
