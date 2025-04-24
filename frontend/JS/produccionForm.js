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
        const cultivoId = document.getElementById('cultivo').value;
        const cultivoNombre = document.querySelector(`#cultivo option[value="${cultivoId}"]`)?.textContent || '';
        const nueva = {
            id: document.getElementById('produccionId').value,
            nombre: nombreInput.value.trim(),
            cultivo: cultivoNombre
        };
        producciones.push(nueva);
        const row = document.createElement('tr');
        row.innerHTML = `<td>${nueva.id}</td><td>${nueva.nombre}</td><td>${nueva.cultivo}</td><td>Ver | Editar</td>`;
        document.getElementById('produccionesTableBody').appendChild(row);
        modal.style.display = 'none';
    });

    async function fetchAndPopulateSelect(url, selectId) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error al cargar datos: ${response.status}`);
            }
            const data = await response.json();
            const select = document.getElementById(selectId);
            if (select) {
                select.innerHTML = '<option value="">Seleccione</option>'; // Opción por defecto
                data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.id; // El id del usuario será el valor
                    option.textContent = `${item.nombre} (${item.rol})`; // Mostramos nombre y rol
                    select.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error al cargar los datos del select:', error);
        }
    }
    
    // Llamar a la API para cargar los responsables
    await fetchAndPopulateSelect('http://localhost:3000/api/usuarios?rol=responsable', 'responsable');
    

    // Cargar datos desde API (si los necesitas)
    await fetchAndPopulateSelect('/api/usuarios?rol=responsable', 'responsable');
    await fetchAndPopulateSelect('/api/ciclos', 'cicloCultivo');
    await fetchAndPopulateSelect('/api/sensores', 'sensores');

    // Datos simulados para cultivos e insumos (puedes cambiarlos por tu API si deseas)
    const cultivos = [
        { id: 1, nombre: "Maíz" },
        { id: 2, nombre: "Papa" },
        { id: 3, nombre: "Arroz" }
    ];

    const insumos = [
        { id: 1, nombre: "Fertilizante A" },
        { id: 2, nombre: "Insecticida X" },
        { id: 3, nombre: "Abono B" }
    ];

    // Cargar selects de cultivos e insumos
    cargarDatos(cultivos, 'cultivo');
    cargarDatos(insumos, 'insumos');

    function cargarDatos(lista, idSelect) {
        const select = document.getElementById(idSelect);
        if (select) {
            select.innerHTML = '<option value="">Seleccione</option>';
            lista.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.nombre;
                select.appendChild(option);
            });
        }
    }
});

document.getElementById('crearProduccion').addEventListener('click', async () => {
    const cultivoId = document.getElementById('cultivo').value;
    const cultivoNombre = document.querySelector(`#cultivo option[value="${cultivoId}"]`)?.textContent || '';
    const nueva = {
        id: document.getElementById('produccionId').value,
        nombre: nombreInput.value.trim(),
        cultivo_id: cultivoId
    };

    try {
        const response = await fetch('crear-produccion.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nueva)
        });

        const result = await response.json();
        if (result.success) {
            producciones.push(nueva);
            const row = document.createElement('tr');
            row.innerHTML = `<td>${nueva.id}</td><td>${nueva.nombre}</td><td>${cultivoNombre}</td><td>Ver | Editar</td>`;
            document.getElementById('produccionesTableBody').appendChild(row);
            modal.style.display = 'none';
        } else {
            alert('Error: ' + result.message);
        }
    } catch (err) {
        console.error('Error al enviar los datos:', err);
        alert('Ocurrió un error al guardar la producción.');
    }
});

