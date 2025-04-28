document.querySelectorAll('.action-btn').forEach(button => {
  button.addEventListener('click', (event) => {
      const row = event.target.closest('tr');
      const statusCell = row.querySelector('.production-list__td:nth-child(3) .status');
      const actionButton = row.querySelector('.action-btn');

      if (statusCell.classList.contains('status--active')) {
          statusCell.classList.remove('status--active');
          statusCell.classList.add('status--inactive');
          statusCell.textContent = 'Inactivo';

          actionButton.classList.remove('action-btn--deactivate');
          actionButton.classList.add('action-btn--activate');
          actionButton.textContent = 'Activar';
      } else {
          statusCell.classList.remove('status--inactive');
          statusCell.classList.add('status--active');
          statusCell.textContent = 'Activo';

          actionButton.classList.remove('action-btn--activate');
          actionButton.classList.add('action-btn--deactivate');
          actionButton.textContent = 'Desactivar';
      }
  });
});
