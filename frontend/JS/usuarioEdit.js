// archivo: usuarioEdit.js

document.addEventListener('DOMContentLoaded', function () {
    const editButtons = document.querySelectorAll('.edit-button');
    const editModal = document.getElementById('editUsuarioModal');
    const closeEditModal = document.getElementById('closeEditModal');
    const saveButton = document.getElementById('saveEditUsuario');

    editButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const row = this.closest('.content__table-row');
            if (!row) return;

            const cells = row.querySelectorAll('.content__table-data');
            const userData = {
                nombre: cells[0].textContent.trim(),
                id: cells[1].textContent.trim(),
                rol: cells[2].textContent.trim(),
                estado: cells[3].querySelector('.status-enabled') ? 'habilitado' : 'deshabilitado'
            };

            document.getElementById('editNombre').value = userData.nombre;
            document.getElementById('editRol').value = userData.rol;
            document.getElementById('editEstado').value = userData.estado;
            editModal.dataset.userId = userData.id;
            editModal.style.display = 'flex';
        });
    });

    if (closeEditModal) {
        closeEditModal.addEventListener('click', () => {
            editModal.style.display = 'none';
        });
    }

    if (saveButton) {
        saveButton.addEventListener('click', function(e) {
            e.preventDefault();
            const userId = editModal.dataset.userId;
            const editedData = {
                nombre: document.getElementById('editNombre').value.trim(),
                rol: document.getElementById('editRol').value,
                estado: document.getElementById('editEstado').value
            };

            if (!editedData.nombre || !editedData.rol) {
                alert('Por favor complete todos los campos');
                return;
            }

            const row = findRowById(userId);
            if (row) {
                updateRowData(row, editedData);
                editModal.style.display = 'none';
                alert('Usuario actualizado exitosamente');
            }
        });
    }

    function findRowById(userId) {
        const rows = document.querySelectorAll('.content__table-row');
        return Array.from(rows).find(row => {
            const idCell = row.querySelector('td:nth-child(2)');
            return idCell && idCell.textContent.trim() === userId;
        });
    }

    function updateRowData(row, data) {
        const cells = row.querySelectorAll('td');
        cells[0].textContent = data.nombre;
        cells[2].textContent = data.rol;
        
        const estadoCell = cells[3];
        estadoCell.innerHTML = data.estado === 'habilitado' 
            ? 'Habilitado: &nbsp;<span class="status-enabled"></span>&nbsp; Deshabilitado:&nbsp;<span></span>'
            : 'Habilitado: &nbsp;<span></span>&nbsp; Deshabilitado: &nbsp;<span class="status-disabled"></span>';
    }
});
