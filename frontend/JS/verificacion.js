window.onload = function () {
const boton = document.querySelector('.verificacion__boton');
const inputs = document.querySelectorAll('.verificacion__input');

  // Función para obtener el PIN y mostrarlo
function mostrarPIN() {
    var pin = '';
    for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].value === '') {
        alert('Falta un número del PIN');
        return;
    }
    pin += inputs[i].value;
    }
    alert('Tu PIN es correcto:');
}

  // Al hacer clic en el botón
boton.onclick = function () {
    mostrarPIN();
};

  // Al presionar Enter en cualquier input
for (var i = 0; i < inputs.length; i++) {
    inputs[i].onkeydown = function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        mostrarPIN();
    }
    };
}
};
