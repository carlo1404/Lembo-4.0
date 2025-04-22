document.getElementById("add").onclick = function () {
    window.location.href = "agregar_sensor.html";
};
document.getElementById("download").onclick = function () {
    window.location.href = "informe_sensor.html";
};

document.addEventListener("DOMContentLoaded", function () {
    const showCycleDetails = document.getElementById("showCycleDetails");
    const modal = document.getElementById("cropCycleModal");
    const modalContent = document.getElementById("modalContent");
    const closeModal = document.getElementById("closeModal");

    showCycleDetails.addEventListener("click", function () {
        modalContent.innerHTML = `
            <header class="sensor-info__header">
                <h1 class="sensor-info__title">Detalles del Sensor</h1>
            </header>
            <section class="sensor-info__content">
                <div class="sensor-info__block">
                    <div class="sensor-info__item"><span class="sensor-info__label">Sensor:</span> Luz</div>
                    <div class="sensor-info__item"><span class="sensor-info__label">ID:</span> SEN76286</div>
                    <div class="sensor-info__item"><span class="sensor-info__label">Último Valor:</span> 700 lux</div>
                    <div class="sensor-info__item"><span class="sensor-info__label">Unidad:</span> lux</div>
                    <div class="sensor-info__item"><span class="sensor-info__label">Estado:</span> Óptimo</div>
                </div>
                <div class="sensor-info__chart">
                    <canvas id="sensorChart"></canvas>
                </div>
            </section>

            <style>
                .sensor-info__header {
                    text-align: center;
                    margin-bottom: 1.5rem;
                }

                .sensor-info__title {
                    font-size: 2rem;
                    font-weight: bold;
                    color: var(--black);
                }

                .sensor-info__content {
                    display: grid;
                    grid-template-columns: 1fr 2fr;
                    gap: 1.5rem;
                    align-items: start;
                    padding: 1rem;
                }

                .sensor-info__block {
                    background-color: var(--white);
                    padding: 1rem;
                    border: 1px solid var(--gray-60);
                    border-radius: 0.5rem;
                }

                .sensor-info__item {
                    margin-bottom: 0.75rem;
                }

                .sensor-info__label {
                    font-weight: bold;
                    color: var(--gray-80);
                }

                .sensor-info__chart {
                    background-color: var(--white);
                    padding: 1rem;
                    border: 1px solid var(--gray-60);
                    border-radius: 0.5rem;
                }

                canvas {
                    width: 100% !important;
                    height: 250px !important;
                }
            </style>
        `;

        modal.style.display = 'block';

        // Cargar gráfico dentro del modal
        new Chart(document.getElementById('sensorChart'), {
            type: 'line',
            data: {
                labels: ['08:00', '10:00', '12:00', '14:00', '16:00'],
                datasets: [{
                    label: 'Luz (lux)',
                    data: [300, 500, 700, 650, 600],
                    borderColor: 'gold',
                    backgroundColor: 'rgba(255, 215, 0, 0.2)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    });

    closeModal.addEventListener("click", function () {
        modal.style.display = 'none';
    });

    window.addEventListener("click", function (e) {
        if (e.target.classList.contains("modal__overlay")) {
            modal.style.display = 'none';
        }
    });

    const editButtons = document.querySelectorAll('.edit-button');
    const editModal = document.getElementById('editSensorModal');
    const closeEditModal = document.getElementById('closeEditModal');
    const editForm = document.getElementById('editSensorForm');
    const saveButton = document.getElementById('saveEditSensor');

    // Función para abrir el modal y cargar datos
    function openEditModal(sensorData) {
        document.getElementById('editTipoSensor').value = sensorData.tipo;
        document.getElementById('editNombre').value = sensorData.nombre;
        document.getElementById('editUnidad').value = sensorData.unidad;
        document.getElementById('editTiempo').value = sensorData.tiempo;
        document.getElementById('editEstado').value = sensorData.estado;
        editModal.style.display = 'block';

        // Guardamos el ID del sensor que estamos editando
        editModal.dataset.sensorId = sensorData.id;
    }

    // Agregar evento a todos los botones de editar
    editButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('.content__table-row');
            const sensorData = {
                id: row.querySelector('td:nth-child(2)').textContent,
                nombre: row.querySelector('td:nth-child(1)').textContent,
                tipo: row.querySelector('td:nth-child(3)').textContent,
                unidad: row.querySelector('td:nth-child(4)').textContent,
                tiempo: row.querySelector('td:nth-child(5)').textContent,
                estado: row.querySelector('td:nth-child(6)').textContent.includes('Habilitado') ? 'habilitado' : 'deshabilitado'
            };
            openEditModal(sensorData);
        });
    });

    // Cerrar modal
    closeEditModal.addEventListener('click', () => {
        editModal.style.display = 'none';
    });

    // Guardar cambios
    saveButton.addEventListener('click', function(e) {
        e.preventDefault();
        const editModal = document.getElementById('editSensorModal');
        if (!editModal) return;
        
        const sensorId = editModal.dataset.sensorId;
        if (!sensorId) {
            alert('Error: No se pudo identificar el sensor a editar');
            return;
        }
        
        const editedData = {
            tipo: document.getElementById('editTipoSensor')?.value || '',
            nombre: document.getElementById('editNombre')?.value || '',
            unidad: document.getElementById('editUnidad')?.value || '',
            tiempo: document.getElementById('editTiempo')?.value || '',
            estado: document.getElementById('editEstado')?.value || ''
        };

        // Aquí puedes agregar la lógica para enviar los datos al servidor
        // Por ahora solo actualizamos la UI
        const rows = document.querySelectorAll('.content__table-row');
        rows.forEach(row => {
            const idCell = row.querySelector('td:nth-child(2)');
            if (!idCell) return; // Skip si no encontramos la celda del ID
            
            if (idCell.textContent === sensorId) {
                const nombreCell = row.querySelector('td:nth-child(1)');
                const tipoCell = row.querySelector('td:nth-child(3)');
                const unidadCell = row.querySelector('td:nth-child(4)');
                const tiempoCell = row.querySelector('td:nth-child(5)');
                const statusCell = row.querySelector('td:nth-child(6)');

                // Actualizar solo si las celdas existen
                if (nombreCell) nombreCell.textContent = editedData.nombre;
                if (tipoCell) tipoCell.textContent = editedData.tipo;
                if (unidadCell) unidadCell.textContent = editedData.unidad;
                if (tiempoCell) tiempoCell.textContent = editedData.tiempo;
                if (statusCell) {
                    statusCell.innerHTML = editedData.estado === 'habilitado' ?
                        'Habilitado: &nbsp;<span class="content__status-enabled"></span>&nbsp; Deshabilitado:&nbsp;<span></span>' :
                        'Habilitado: &nbsp;<span></span>&nbsp; Deshabilitado: &nbsp;<span class="content__status-disabled"></span>';
                }
            }
        });

        editModal.style.display = 'none';
        alert('Sensor actualizado exitosamente');
    });
});
