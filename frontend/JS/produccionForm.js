let producciones = [];

// Función para generar ID
function generarId() {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const count = producciones.filter(p => p.id.startsWith(`PROD-${dd}${mm}${yyyy}`)).length + 1;
    return `PROD-${dd}${mm}${yyyy}-${String(count).padStart(4, '0')}`;
}

// Al cargar el documento
document.addEventListener('DOMContentLoaded', async function () {
    const btnAbrir = document.getElementById('crearProduccionBtn');
    const modal = document.getElementById('modalCrearProduccion');
    const nombreInput = document.getElementById('nombreProduccion');
    const nombreError = document.getElementById('nombreError');
    const guardarBtn = document.querySelector('.produccion__button--primary');

    if (btnAbrir) {
        btnAbrir.addEventListener('click', () => {
            document.getElementById('produccionId').value = generarId();
            flatpickr('#fechaInicio', { defaultDate: 'today', dateFormat: 'd/m/Y' });
            flatpickr('#fechaFin', { dateFormat: 'd/m/Y' });
            modal.style.display = 'flex';
        });
    }

    document.querySelectorAll('.modal__close').forEach(btn =>
        btn.addEventListener('click', () => modal.style.display = 'none')
    );

    // Validación del nombre de la producción
    nombreInput.addEventListener('input', () => {
        const v = nombreInput.value.trim();
        const msg = v.length < 3 ? 'Mínimo 3 caracteres.' :
            v.length > 100 ? 'Máximo 100 caracteres.' :
                !/[A-Za-z]/.test(v) ? 'Debe contener al menos una letra.' :
                    producciones.some(p => p.nombre.toLowerCase() === v.toLowerCase()) ? 'Nombre ya existe.' : '';
        nombreError.textContent = msg;
        document.getElementById('crearProduccion').disabled = !!msg;
    });

    // Crear producción
    document.getElementById('crearProduccion').addEventListener('click', () => {
        const nueva = {
            id: document.getElementById('produccionId').value,
            nombre: nombreInput.value.trim(),
            cultivo: document.getElementById('cultivo').value
        };
        producciones.push(nueva);
        const row = document.createElement('tr');
        row.innerHTML = `<td>${nueva.id}</td><td>${nueva.nombre}</td><td>${nueva.cultivo}</td><td>Ver | Editar</td>`;
        document.getElementById('produccionesTableBody').appendChild(row);
        modal.style.display = 'none';
    });

    // Cargar datos en los selects
    async function fetchAndPopulateSelect(url, selectId) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const select = document.getElementById(selectId);
            if (select) {
                select.innerHTML = '<option value="">Seleccione</option>';
                data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.id;
                    option.textContent = item.rol; // Aquí debe ser lo que quieras mostrar
                    select.appendChild(option);
                });
            }
        } catch (error) {
            console.error(`Error cargando ${selectId}:`, error);
        }
    }

    // Llamadas a la API para cargar datos en los selects
    await fetchAndPopulateSelect('/api/usuarios?rol=responsable', 'responsable');
    await fetchAndPopulateSelect('/api/ciclos', 'cicloCultivo');
    await fetchAndPopulateSelect('/api/sensores', 'sensores');
    await fetchAndPopulateSelect('/api/insumos', 'insumos');
});
