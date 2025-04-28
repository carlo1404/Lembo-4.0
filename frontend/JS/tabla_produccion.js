// JavaScript para cambiar el estado de habilitado a deshabilitado
document.addEventListener("DOMContentLoaded", function() {
    const statusButton = document.querySelector('.status');
    
    statusButton.addEventListener('click', function() {
      if (statusButton.classList.contains('enabled')) {
        statusButton.classList.remove('enabled');
        statusButton.classList.add('disabled');
        statusButton.textContent = 'Deshabilitado'; // Cambia el texto del botón
      } else {
        statusButton.classList.remove('disabled');
        statusButton.classList.add('enabled');
        statusButton.textContent = 'Habilitado'; // Cambia el texto del botón
        }
    });
});
