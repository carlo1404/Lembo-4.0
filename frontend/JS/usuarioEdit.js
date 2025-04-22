document.addEventListener('DOMContentLoaded', function() {
    const editButtons = document.querySelectorAll('.edit-button');
    const editModal = document.getElementById('editUsuarioModal');
    const closeEditModal = document.getElementById('closeEditModal');
    const saveButton = document.getElementById('saveEditUsuario');

    function openEditModal(userData) {
        const modal = document.getElementById('editUsuarioModal');
        if (!modal) return;
        
        document.getElementById('editNombre').value = userData.nombre;
        document.getElementById('editEmail').value = userData.email;
        document.getElementById('editRol').value = userData.rol;
        document.getElementById('editEstado').value = userData.estado;
        modal.style.display = 'block';
        modal.dataset.userId = userData.id;
    }

    editButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('.content__table-row');
            if (!row) return;

            const userData = {
                id: row.querySelector('td:nth-child(2)')?.textContent || '',
                nombre: row.querySelector('td:nth-child(1)')?.textContent || '',
                email: row.querySelector('td:nth-child(3)')?.textContent || '',
                rol: row.querySelector('td:nth-child(4)')?.textContent || '',
                estado: row.querySelector('td:nth-child(5)')?.textContent.includes('Habilitado') ? 'habilitado' : 'deshabilitado'
            };
            openEditModal(userData);
        });
    });

    // Eventos para cerrar y guardar
    if (closeEditModal) {
        closeEditModal.addEventListener('click', () => {
            if (editModal) editModal.style.display = 'none';
        });
    }

    if (saveButton) {
        saveButton.addEventListener('click', function(e) {
            // Implementar lógica de guardado similar a la de sensores
            // ...
        });
    }
});
