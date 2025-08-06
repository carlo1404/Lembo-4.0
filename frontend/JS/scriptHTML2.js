document.getElementById("add").onclick = function () {
    window.location.href = "agregar_sensor.html";
};
document.getElementById("download").onclick = function () {
    window.location.href = "informe_sensor.html";
};

document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("cropCycleModal");
    // **Muevo la obtención de modalContent dentro del listener**
    const closeModal = document.getElementById("closeModal");
    const tablelistar = document.getElementsByClassName("content__table-body")[0];

    async function fetchSensores() {
        try {
            const response = await fetch('http://localhost:3000/sensores');
            const sensores = await response.json();
            let tableHTML = '';
            console.log(sensores);

            sensores.forEach(sensor => {
                tableHTML += `<tr class="content__table-row" data-sensor-id="${sensor.id}">
                                    <td class="content__table-data">${sensor.nombre}</td>
                                    <td class="content__table-data">${sensor.id}</td>
                                    <td class="content__table-data">${sensor.tipo_sensor}</td>
                                    <td class="content__table-data">${sensor.unidad_medida}</td>
                                    <td class="content__table-data">${sensor.tiempo_muestreo}</td>
                                    <td class="content__table-data content__table-data--status">
                                        ${sensor.estado === 'habilitado' ?
                                            'Habilitado: &nbsp;<span class="content__status-enabled"></span>&nbsp; Deshabilitado:&nbsp;<span></span>' :
                                            'Habilitado: &nbsp;<span></span>&nbsp; Deshabilitado: &nbsp;<span class="content__status-disabled"></span>'}
                                    </td>
                                    <td class="content__table-data">
                                        <div class="content__icon-container">
                                            <div class="content__icon content__icon--blue edit-button" title="Editar">
                                                <i class='bx bxs-edit'></i>
                                            </div>
                                            <div class="content__icon content__icon--red delete-button" title="Eliminar">
                                                <i class='bx bxs-trash'></i>
                                            </div>
                                            <div class="icon-container__icon icon-container__icon--green show-details-button"
                                                 title="Más información" data-sensor-id="${sensor.id}">
                                                <i class='bx bx-plus-circle'></i>
                                            </div>
                                        </div>
                                    </td>
                                </tr>`;
            });

            if (tablelistar) {
                tablelistar.innerHTML = tableHTML;
                attachEditEventListeners();
                attachDeleteEventListeners();
                attachShowDetailsEventListeners();
            }

        } catch (error) {
            console.error('Error fetching sensores:', error);
            alert('Error al cargar los sensores.');
        }
    }
    fetchSensores();

    if (closeModal) {
        closeModal.addEventListener("click", function () {
            modal.style.display = 'none';
        });
    }

    window.addEventListener("click", function (e) {
        if (e.target.classList.contains("modal__overlay")) {
            modal.style.display = 'none';
        }
    });

    const editModal = document.getElementById('editSensorModal');
    const closeEditModal = document.getElementById('closeEditModal');
    const saveButton = document.getElementById('saveEditSensor');

    function attachEditEventListeners() {
        const editButtons = document.querySelectorAll('.edit-button');
        editButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const row = this.closest('.content__table-row');
                if (!row) return;

                const sensorId = row.dataset.sensorId;
                fetchSensorDetails(sensorId);
            });
        });
    }

    async function fetchSensorDetails(id) {
        try {
            const response = await fetch(`http://localhost:3000/sensores/${id}`);
            const sensorData = await response.json();
            openEditModal(sensorData);
        } catch (error) {
            console.error('Error fetching detalles del sensor:', error);
            alert('Error al cargar los detalles del sensor.');
        }
    }

    function openEditModal(sensorData) {
        if (!editModal) return;

        document.getElementById('editTipoSensor').value = sensorData.tipo_sensor;
        document.getElementById('editNombre').value = sensorData.nombre;
        document.getElementById('editUnidad').value = sensorData.unidad_medida;
        document.getElementById('editTiempo').value = sensorData.tiempo_muestreo;
        document.getElementById('editEstado').value = sensorData.estado;
        editModal.style.display = 'block';
        editModal.dataset.sensorId = sensorData.id;
    }

    if (closeEditModal) {
        closeEditModal.addEventListener('click', () => {
            if (editModal) editModal.style.display = 'none';
        });
    }

    if (saveButton) {
        saveButton.addEventListener('click', async function(e) {
            e.preventDefault();
            if (!editModal) return;

            const sensorId = editModal.dataset.sensorId;
            if (!sensorId) {
                alert('Error: No se pudo identificar el sensor a editar');
                return;
            }

            const editedData = {
                tipo_sensor: document.getElementById('editTipoSensor')?.value || '',
                nombre: document.getElementById('editNombre')?.value || '',
                unidad_medida: document.getElementById('editUnidad')?.value || '',
                tiempo_muestreo: document.getElementById('editTiempo')?.value || '',
                estado: document.getElementById('editEstado')?.value || ''
            };

            try {
                const response = await fetch(`http://localhost:3000/sensores/${sensorId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(editedData)
                });

                if (response.ok) {
                    const result = await response.json();
                    alert(result.message || 'Sensor actualizado exitosamente');
                    fetchSensores(); // Recargar la tabla después de la edición
                    editModal.style.display = 'none';
                } else {
                    const errorResult = await response.json();
                    alert(errorResult.error || 'Error al actualizar el sensor');
                }
            } catch (error) {
                console.error('Error al actualizar el sensor:', error);
                alert('Error de red al actualizar el sensor.');
            }
        });
    }

    function attachDeleteEventListeners() {
        const deleteButtons = document.querySelectorAll('.delete-button');
        deleteButtons.forEach(button => {
            button.addEventListener('click', async function() {
                const row = this.closest('.content__table-row');
                if (!row) return;
                const sensorId = row.dataset.sensorId;

                if (confirm('¿Estás seguro de que deseas eliminar este sensor?')) {
                    try {
                        const response = await fetch(`http://localhost:3000/sensores/${sensorId}`, {
                            method: 'DELETE'
                        });

                        if (response.ok) {
                            const result = await response.json();
                            alert(result.message || 'Sensor eliminado correctamente');
                            fetchSensores(); // Recargar la tabla después de la eliminación
                        } else {
                            const errorResult = await response.json();
                            alert(errorResult.error || 'Error al eliminar el sensor');
                        }
                    } catch (error) {
                        console.error('Error al eliminar el sensor:', error);
                        alert('Error de red al eliminar el sensor.');
                    }
                }
            });
        });
    }

    function attachShowDetailsEventListeners() {
        const showDetailsButtons = document.querySelectorAll('.show-details-button');
        console.log(showDetailsButtons);
        showDetailsButtons.forEach(button => {
            button.addEventListener('click', async function() {
                const sensorId = this.dataset.sensorId;
                try {
                    const response = await fetch(`http://localhost:3000/sensores/${sensorId}`);
                    const sensor = await response.json();
                    if (sensor) {
                        // **Obtengo modalContent aquí dentro del listener**
                        const modalContent = document.getElementById('modalContent');
                        if (modalContent) {
                            modalContent.innerHTML = `
                                <header class="sensor-info__header">
                                    <h1 class="sensor-info__title">Detalles del Sensor</h1>
                                </header>
                                <section class="sensor-info__content">
                                    <div class="sensor-info__block">
                                        <div class="sensor-info__item"><span class="sensor-info__label">Nombre:</span> ${sensor.nombre}</div>
                                        <div class="sensor-info__item"><span class="sensor-info__label">ID:</span> ${sensor.id}</div>
                                        <div class="sensor-info__item"><span class="sensor-info__label">Tipo:</span> ${sensor.tipo_sensor}</div>
                                        <div class="sensor-info__item"><span class="sensor-info__label">Unidad:</span> ${sensor.unidad_medida}</div>
                                        <div class="sensor-info__item"><span class="sensor-info__label">Tiempo de escaneo:</span> ${sensor.tiempo_muestreo}</div>
                                        <div class="sensor-info__item"><span class="sensor-info__label">Estado:</span> ${sensor.estado}</div>
                                        <div class="sensor-info__item"><span class="sensor-info__label">Descripción:</span> ${sensor.descripcion || 'N/A'}</div>
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
                            const sensorChart = document.getElementById('sensorChart');
                            console.log(sensorChart);
                            if (sensorChart) {
                                // Aquí iría la lógica para cargar datos reales del sensor para el gráfico
                                new Chart(sensorChart, {
                                    type: 'line',
                                    data: {
                                        labels: ['Ahora', '+1h', '+2h', '+3h', '+4h'], // Ejemplo de etiquetas de tiempo
                                        datasets: [{
                                            label: `${sensor.nombre} (${sensor.unidad_medida})`,
                                            data: [Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100], // Ejemplo de datos aleatorios
                                            borderColor: 'teal',
                                            backgroundColor: 'rgba(0, 128, 128, 0.2)',
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
                            }
                        } else {
                            console.error("Error: No se encontró el elemento modalContent dentro del modal.");
                            alert('Error al mostrar los detalles del sensor.');
                        }
                    } else {
                        alert('No se encontraron detalles para este sensor.');
                    }
                } catch (error) {
                    console.error('Error fetching detalles del sensor:', error);
                    alert('Error al cargar los detalles del sensor.');
                }
            });
        });
    }
});