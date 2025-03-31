document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');

    if (!form) {
        console.error('Form not found');
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const insumoName = document.querySelector('.form__input--name');
        const insumoId = document.querySelector('.form__input--id');
        const insumoValor = document.querySelector('.form__input--valor');
        const insumoCantidad = document.querySelector('.form__input--cantidad');
        const insumoUnidad = document.querySelector('#unidad');
        const insumoDescripcion = document.querySelector('.form__textarea--descripcion');

        const formData = {
            name: insumoName ? insumoName.value.trim() : '',
            id: insumoId ? insumoId.value.trim() : '',
            valor: insumoValor ? insumoValor.value.trim() : '',
            cantidad: insumoCantidad ? insumoCantidad.value.trim() : '',
            unidad: insumoUnidad ? insumoUnidad.value : '',
            descripcion: insumoDescripcion ? insumoDescripcion.value.trim() : ''
        };

        try {
            const response = await fetch('http://localhost:5500/api/insumos', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Error al enviar los datos. Por favor, intenta nuevamente.');
            }

            const result = await response.json();
            console.log('Insumo registrado:', result);
            alert('Insumo agregado exitosamente');
            form.reset();
        } catch (error) {
            console.error(error);
            alert('Ocurrió un error al agregar el insumo. Por favor, intenta nuevamente.');
        }
    });
});