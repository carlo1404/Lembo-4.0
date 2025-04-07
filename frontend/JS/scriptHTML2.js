document.getElementById("redirectButton").onclick = function () {
    window.location.href = "Actualizar_insumo.html";
};
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
});
