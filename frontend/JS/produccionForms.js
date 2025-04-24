
  document.addEventListener('DOMContentLoaded', async function () {
    const modal = document.querySelector('.modal');
    const closeModal = () => modal.style.display = 'none';

    const guardarBtn = document.querySelector('.produccion__button--primary');
    if (guardarBtn) {
      guardarBtn.addEventListener('click', function () {
        closeModal();
      });
    }

    // Cargar opciones de selects desde la base de datos
    async function fetchAndPopulateSelect(url, selectId) {
      try {
        const response = await fetch(url);
        const data = await response.json();
        const select = document.getElementById(selectId);
        if (select) {
          data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.nombre;
            select.appendChild(option);
          });
        }
      } catch (error) {
        console.error(`Error cargando ${selectId}:`, error);
      }
    }

    await fetchAndPopulateSelect('/api/usuarios?rol=responsable', 'selectResponsable');
    await fetchAndPopulateSelect('/api/ciclos', 'selectCiclo');
    await fetchAndPopulateSelect('/api/sensores', 'selectSensores');
    await fetchAndPopulateSelect('/api/insumos', 'selectInsumos');
  });
