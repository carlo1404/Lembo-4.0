document.addEventListener('DOMContentLoaded', function() {
    const editButtons = document.querySelectorAll('.edit-button');
    const editModal = document.getElementById('editInsumoModal');
    const closeEditModal = document.getElementById('closeEditModal');
    const saveButton = document.getElementById('saveEditInsumo');

    // Cargar datos guardados al iniciar
    loadInsumosData();

    function loadInsumosData() {
        const savedInsumos = localStorage.getItem('insumosData');
        if (!savedInsumos) {
            // Si no hay datos guardados, guardar los datos actuales de la tabla
            saveCurrentTableData();
        } else {
            // Si hay datos guardados, actualizar la tabla
            updateTableFromStorage();
        }
    }

    function saveCurrentTableData() {
        const insumos = [];
        document.querySelectorAll('.content__table-row').forEach(row => {
            if (row.parentElement.tagName === 'THEAD') return;
            
            const insumo = {
                nombre: row.querySelector('td:nth-child(1)')?.textContent,
                id: row.querySelector('td:nth-child(2)')?.textContent,
                unidad: row.querySelector('td:nth-child(3)')?.textContent,
                cantidad: row.querySelector('td:nth-child(4)')?.textContent,
                valor: row.querySelector('td:nth-child(5)')?.textContent,
                estado: row.querySelector('td:nth-child(6)')?.textContent.includes('Habilitado') ? 'habilitado' : 'deshabilitado'
            };
            insumos.push(insumo);
        });
        localStorage.setItem('insumosData', JSON.stringify(insumos));
    }

    function updateTableFromStorage() {
        const savedInsumos = JSON.parse(localStorage.getItem('insumosData'));
        if (!savedInsumos) return;

        const tbody = document.querySelector('.content__table-body');
        tbody.innerHTML = '';

        savedInsumos.forEach(insumo => {
            const row = document.createElement('tr');
            row.className = 'content__table-row';
            row.innerHTML = `
                <td class="content__table-data">${insumo.nombre}</td>
                <td class="content__table-data">${insumo.id}</td>
                <td class="content__table-data">${insumo.unidad}</td>
                <td class="content__table-data">${insumo.cantidad}</td>
                <td class="content__table-data">${insumo.valor}</td>
                <td class="content__table-data content__table-data--status">
                    Habilitado: &nbsp;<span class="${insumo.estado === 'habilitado' ? 'content__status-enabled' : ''}"></span>&nbsp;
                    Deshabilitado:&nbsp;<span class="${insumo.estado === 'deshabilitado' ? 'content__status-disabled' : ''}"></span>
                </td>
                <td class="content__table-data">
                    <div class="content__icon-container">
                        <div class="content__icon content__icon--blue" title="Editar">
                            <i class='bx bxs-edit edit-button'></i>
                        </div>
                        <div class="content__icon content__icon--red" title="Eliminar">
                            <i class='bx bxs-trash'></i>
                        </div>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Recargar event listeners después de actualizar la tabla
        attachEditListeners();
    }

    function attachEditListeners() {
        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const row = this.closest('.content__table-row');
                if (!row) return;

                const insumoData = {
                    id: row.querySelector('td:nth-child(2)')?.textContent || '',
                    nombre: row.querySelector('td:nth-child(1)')?.textContent || '',
                    unidad: row.querySelector('td:nth-child(3)')?.textContent || '',
                    cantidad: row.querySelector('td:nth-child(4)')?.textContent || '',
                    valor: row.querySelector('td:nth-child(5)')?.textContent.replace('$', '') || '',
                    estado: row.querySelector('td:nth-child(6)')?.textContent.includes('Habilitado') ? 'habilitado' : 'deshabilitado'
                };
                openEditModal(insumoData);
            });
        });
    }

    function openEditModal(insumoData) {
        const modal = document.getElementById('editInsumoModal');
        if (!modal) return;
        
        document.getElementById('editNombre').value = insumoData.nombre;
        document.getElementById('editUnidad').value = insumoData.unidad;
        document.getElementById('editCantidad').value = insumoData.cantidad;
        document.getElementById('editValor').value = insumoData.valor;
        document.getElementById('editEstado').value = insumoData.estado;
        modal.style.display = 'block';
        modal.dataset.insumoId = insumoData.id;
    }

    if (closeEditModal) {
        closeEditModal.addEventListener('click', () => {
            if (editModal) editModal.style.display = 'none';
        });
    }

    if (saveButton) {
        saveButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (!editModal) return;
            
            const insumoId = editModal.dataset.insumoId;
            if (!insumoId) {
                alert('Error: No se pudo identificar el insumo a editar');
                return;
            }
            
            const editedData = {
                nombre: document.getElementById('editNombre')?.value || '',
                unidad: document.getElementById('editUnidad')?.value || '',
                cantidad: document.getElementById('editCantidad')?.value || '',
                valor: document.getElementById('editValor')?.value || '',
                estado: document.getElementById('editEstado')?.value || ''
            };

            // Validación de campos requeridos
            if (!editedData.nombre || !editedData.unidad || !editedData.cantidad || !editedData.valor) {
                alert('Todos los campos son requeridos');
                return;
            }

            // Actualizar DOM y Storage
            updateInsumoData(insumoId, editedData);
            
            editModal.style.display = 'none';
            alert('Insumo actualizado exitosamente');
        });
    }

    function updateInsumoData(insumoId, editedData) {
        const savedInsumos = JSON.parse(localStorage.getItem('insumosData'));
        const updatedInsumos = savedInsumos.map(insumo => {
            if (insumo.id === insumoId) {
                return { ...insumo, ...editedData };
            }
            return insumo;
        });
        
        localStorage.setItem('insumosData', JSON.stringify(updatedInsumos));
        updateTableFromStorage();
    }
});
