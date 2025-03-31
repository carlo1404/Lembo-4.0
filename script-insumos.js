document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');

    if (!form) {
        console.error('❌ Formulario no encontrado');
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const insumoName = document.querySelector('.form__input--name');
        const insumoId = document.querySelector('.form__input--id');
        const insumoValor = document.querySelector('.form__input--valor');
        const insumoCantidad = document.querySelector('.form__input--cantidad');
        const insumoUnidad = document.querySelector('.form__select');
        const insumoDescripcion = document.querySelector('.form__textarea--descripcion');

        const formData = {
            id: insumoId.value.trim(),
            nombre: insumoName.value.trim(),
            valor_unitario: insumoValor.value.trim(),
            cantidad: insumoCantidad.value.trim(),
            unidad: insumoUnidad.value,
            descripcion: insumoDescripcion.value.trim()
        };

        try {
            console.log("📤 Enviando datos:", formData); // DEBUG

            const response = await fetch('http://localhost:5500/api/insumos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            console.log("🔍 Estado de la respuesta:", response.status); // DEBUG

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            console.log('✅ Insumo registrado:', result);
            alert('✅ Insumo agregado exitosamente');
            form.reset();
        } catch (error) {
            console.error('❌ Error detallado en el frontend:', error);
            alert(`❌ Ocurrió un error al agregar el insumo: ${error.message}`);
        }
    });
});

