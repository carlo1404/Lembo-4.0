document.getElementById("add").onclick = function() {
    window.location.href = "Agregar_Insumo.html";
};

document.getElementById("download").onclick = function() {
    window.location.href = "informe-insumo.html";
};

document.addEventListener('DOMContentLoaded', function() {
    // Referencias del DOM
    const editModal = document.getElementById('editInsumoModal');
    const closeEditModal = document.getElementById('closeEditModal');
    const saveButton = document.getElementById('saveEditInsumo');

    // Inicializar datos solo una vez al cargar
    if (!localStorage.getItem('insumosDataInitialized')) {
        saveCurrentTableData();
        localStorage.setItem('insumosDataInitialized', 'true');
    }

    // Solo adjuntar event listeners una vez
    document.querySelectorAll('.edit-button').forEach(button => {
        button.removeEventListener('click', handleEdit);
        button.addEventListener('click', handleEdit);
    });

    if (closeEditModal) {
        closeEditModal.addEventListener('click', closeModal);
    }

    if (saveButton) {
        saveButton.removeEventListener('click', handleSave);
        saveButton.addEventListener('click', handleSave);
    }

    // Funciones de manejo
    function handleEdit(e) {
        e.preventDefault();
        const row = this.closest('.content__table-row');
        if (!row) return;

        const insumoData = {
            id: row.querySelector('td:nth-child(2)').textContent,
            nombre: row.querySelector('td:nth-child(1)').textContent,
            unidad: row.querySelector('td:nth-child(3)').textContent,
            cantidad: row.querySelector('td:nth-child(4)').textContent,
            valor: row.querySelector('td:nth-child(5)').textContent.replace('$', '').replace('.', ''),
            estado: row.querySelector('.content__status-enabled') ? 'habilitado' : 'deshabilitado'
        };

        openEditModal(insumoData);
    }

    function openEditModal(insumoData) {
        document.getElementById('editNombre').value = insumoData.nombre;
        document.getElementById('editUnidad').value = insumoData.unidad;
        document.getElementById('editCantidad').value = insumoData.cantidad;
        document.getElementById('editValor').value = insumoData.valor;
        document.getElementById('editEstado').value = insumoData.estado;
        editModal.dataset.insumoId = insumoData.id;
        editModal.style.display = 'block';
    }

    function handleSave(e) {
        e.preventDefault();
        const insumoId = editModal.dataset.insumoId;
        
        const editedData = {
            nombre: document.getElementById('editNombre').value,
            unidad: document.getElementById('editUnidad').value,
            cantidad: document.getElementById('editCantidad').value,
            valor: document.getElementById('editValor').value,
            estado: document.getElementById('editEstado').value
        };

        if (validateData(editedData)) {
            updateInsumoData(insumoId, editedData);
            closeModal();
        }
    }

    function validateData(data) {
        if (!data.nombre || !data.unidad || !data.cantidad || !data.valor) {
            alert('Todos los campos son requeridos');
            return false;
        }
        return true;
    }

    function closeModal() {
        editModal.style.display = 'none';
    }

    function updateInsumoData(insumoId, editedData) {
        // Buscar la fila correcta usando el ID
        const rows = document.querySelectorAll('.content__table-body .content__table-row');
        const row = Array.from(rows).find(row => {
            const idCell = row.querySelector('td:nth-child(2)');
            return idCell && idCell.textContent.trim() === insumoId;
        });

        if (!row) {
            console.error('Fila no encontrada para ID:', insumoId);
            return;
        }

        // Actualizar directamente usando los índices de las celdas
        const cells = row.getElementsByTagName('td');
        cells[0].textContent = editedData.nombre;
        cells[2].textContent = editedData.unidad;
        cells[3].textContent = editedData.cantidad;
        cells[4].textContent = `$${editedData.valor}`;

        // Actualizar el estado
        const estadoCell = cells[5];
        if (editedData.estado === 'habilitado') {
            estadoCell.innerHTML = `Habilitado: &nbsp;<span class="content__status-enabled"></span>&nbsp; Deshabilitado:&nbsp;<span></span>`;
        } else {
            estadoCell.innerHTML = `Habilitado: &nbsp;<span></span>&nbsp; Deshabilitado: &nbsp;<span class="content__status-disabled"></span>`;
        }

        // Forzar actualización visual
        row.style.display = 'none';
        row.offsetHeight;
        row.style.display = '';

        saveCurrentTableData();
        alert('Cambios guardados exitosamente');
    }

    function saveCurrentTableData() {
        const insumos = [];
        document.querySelectorAll('.content__table-body .content__table-row').forEach(row => {
            const cells = row.getElementsByTagName('td');
            if (cells.length >= 6) {
                insumos.push({
                    nombre: cells[0].textContent.trim(),
                    id: cells[1].textContent.trim(),
                    unidad: cells[2].textContent.trim(),
                    cantidad: cells[3].textContent.trim(),
                    valor: cells[4].textContent.trim(),
                    estado: cells[5].querySelector('.content__status-enabled') ? 'habilitado' : 'deshabilitado'
                });
            }
        });
        
        localStorage.setItem('insumosData', JSON.stringify(insumos));
    }
});
