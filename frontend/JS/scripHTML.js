document.addEventListener("DOMContentLoaded", function () {
    const showCycleButton = document.getElementById("showCycleDetails");
    const modal = document.getElementById("cropCycleModal");
    const modalContent = document.getElementById("modalContent");
    const closeModal = document.getElementById("closeModal");

    showCycleButton.addEventListener("click", function () {
        modalContent.innerHTML = `
            <header class="crop-cycle__header">
                <h1 class="crop-cycle__title">Ciclo de Cultivo</h1>
            </header>
            <section class="crop-cycle__info">
                <div class="crop-cycle__general-info">
                    <div class="crop-cycle_item"><span class="crop-cycle_label">Cultivo:</span> Maíz</div>
                    <div class="crop-cycle_item"><span class="crop-cycle_label">Inicio:</span> 01/03/2025</div>
                    <div class="crop-cycle_item"><span class="crop-cycle_label">Fin:</span> 30/06/2025</div>
                    <div class="crop-cycle_item"><span class="crop-cycle_label">Estado:</span> En progreso</div>
                </div>
                <div class="crop-cycle__stages">
                    <h2 class="crop-cycle__subtitle">Etapas</h2>
                    <ul class="crop-cycle__list">
                        <li class="crop-cycle_list-item crop-cycle_list-item--active">Siembra</li>
                        <li class="crop-cycle__list-item">Crecimiento</li>
                        <li class="crop-cycle__list-item">Cosecha</li>
                    </ul>
                </div>
                <div class="crop-cycle__performance">
                    <h2 class="crop-cycle__subtitle">Indicadores de Rendimiento</h2>
                    <div class="crop-cycle_item"><span class="crop-cycle_label">Producción Estimada:</span> 500 kg</div>
                    <div class="crop-cycle_item"><span class="crop-cycle_label">Consumo de Recursos:</span> 100 L de agua</div>
                </div>
                <div class="crop-cycle__notes">
                    <h2 class="crop-cycle__subtitle">Observaciones</h2>
                    <div class="crop-cycle__item">El cultivo muestra un crecimiento saludable.</div>
                </div>
            </section>
            <style>
                .crop-cycle {
                    max-width: 50rem;
                    margin: 2.5rem auto;
                    padding: 1.25rem;
                    background-color: var(--white);
                    border-radius: 0.75rem;
                    box-shadow: 0 0.25rem 1.25rem rgba(0, 0, 0, 0.1);
                }

                .crop-cycle__header {
                    margin-bottom: 1.25rem;
                    text-align: center;
                }

                .crop-cycle__title {
                    font-size: 2rem;
                    font-weight: bold;
                    color: var(--black);
                }

                .crop-cycle__info {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1.25rem;
                }

                .crop-cycle__general-info,
                .crop-cycle__stages,
                .crop-cycle__performance,
                .crop-cycle__notes {
                    padding: 0.9375rem;
                    border: 0.0625rem solid var(--gray-60);
                    border-radius: 0.5rem;
                    background-color: var(--white);
                }

                .crop-cycle__label {
                    font-weight: bold;
                    color: var(--gray-80);
                }

                .crop-cycle__item {
                    margin-bottom: 0.625rem;
                }

                .crop-cycle__subtitle {
                    font-size: 1.25rem;
                    font-weight: bold;
                    margin-bottom: 0.625rem;
                    color: var(--gray-80);
                }

                .crop-cycle__list {
                    list-style-type: none;
                    padding-left: 0;
                }

                .crop-cycle__list-item {
                    padding: 0.625rem;
                    background-color: var(--gray-40);
                    margin-bottom: 0.3125rem;
                    border-radius: 0.25rem;
                }

                .crop-cycle__list-item--active {
                    border: 0.0625rem solid var(--green-600);
                    background-color: var(--green-600);
                    color: var(--white);
                }

                .crop-cycle__notes {
                    grid-column: span 2;
                }
            </style>
        `;
        modal.style.display = 'block';
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
