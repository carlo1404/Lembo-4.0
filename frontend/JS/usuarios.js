// Variables globales
let usuarios = [];
let usuarioActual = null;
let accionConfirmacion = null;
const API_URL = 'http://localhost:3000';

// Elementos DOM
const usuariosTableBody = document.getElementById('usuariosTableBody');
const searchInput = document.getElementById('searchInput');
const loader = document.getElementById('loader');
const emptyState = document.getElementById('emptyState');

// Modales
const userModal = document.getElementById('userModal');
const detailsModal = document.getElementById('detailsModal');
const confirmModal = document.getElementById('confirmModal');
const toast = document.getElementById('toast');

// Botones
const btnNuevoUsuario = document.getElementById('btnNuevoUsuario');
const btnExportarExcel = document.getElementById('btnExportarExcel');
const btnExportarPDF = document.getElementById('btnExportarPDF');
const closeModal = document.getElementById('closeModal');
const closeDetailsModal = document.getElementById('closeDetailsModal');
const closeConfirmModal = document.getElementById('closeConfirmModal');
const cancelForm = document.getElementById('cancelForm');
const cancelConfirm = document.getElementById('cancelConfirm');
const confirmAction = document.getElementById('confirmAction');
const closeToast = document.getElementById('closeToast');

// Formulario
const userForm = document.getElementById('userForm');
const userId = document.getElementById('userId');
const nombre = document.getElementById('nombre');
const apellido = document.getElementById('apellido');
const numero_telefonico = document.getElementById('numero_telefonico');
const rol = document.getElementById('rol');

// Detalles
const detailsId = document.getElementById('detailsId');
const detailsNombre = document.getElementById('detailsNombre');
const detailsApellido = document.getElementById('detailsApellido');
const detailsTelefono = document.getElementById('detailsTelefono');
const detailsRole = document.getElementById('detailsRole');

// Confirmación
const confirmTitle = document.getElementById('confirmTitle');
const confirmMessage = document.getElementById('confirmMessage');

// Toast
const toastIcon = document.getElementById('toastIcon');
const toastMessage = document.getElementById('toastMessage');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarUsuarios();
    
    // Event listeners
    btnNuevoUsuario.addEventListener('click', abrirModalNuevoUsuario);
    btnExportarExcel.addEventListener('click', exportarExcel);
    btnExportarPDF.addEventListener('click', exportarPDF);
    closeModal.addEventListener('click', cerrarModal);
    closeDetailsModal.addEventListener('click', () => toggleModal(detailsModal, false));
    closeConfirmModal.addEventListener('click', () => toggleModal(confirmModal, false));
    cancelForm.addEventListener('click', cerrarModal);
    cancelConfirm.addEventListener('click', () => toggleModal(confirmModal, false));
    confirmAction.addEventListener('click', ejecutarAccionConfirmada);
    closeToast.addEventListener('click', () => toggleModal(toast, false));
    userForm.addEventListener('submit', guardarUsuario);
    searchInput.addEventListener('input', filtrarUsuarios);
    
    // Soporte para responsive
    const toggleSidebar = document.createElement('button');
    toggleSidebar.className = 'button button--secondary sidebar-toggle';
    toggleSidebar.innerHTML = '<i class="bx bx-menu"></i>';
    document.querySelector('.main__header').prepend(toggleSidebar);
    
    toggleSidebar.addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('show');
    });
});

// Funciones para gestionar usuarios
async function cargarUsuarios() {
    mostrarLoader(true);
    try {
        const response = await fetch(`${API_URL}/usuarios`);
        if (!response.ok) throw new Error('Error al cargar usuarios');
        
        usuarios = await response.json();
        renderizarUsuarios(usuarios);
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar usuarios', 'error');
    } finally {
        mostrarLoader(false);
    }
}

function renderizarUsuarios(listaUsuarios) {
    usuariosTableBody.innerHTML = '';
    
    if (listaUsuarios.length === 0) {
        mostrarEstadoVacio(true);
        return;
    }
    
    mostrarEstadoVacio(false);
    
    listaUsuarios.forEach(usuario => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.apellido}</td>
            <td>${usuario.numero_telefonico || '-'}</td>
            <td>${formatearRol(usuario.rol)}</td>
            <td class="table__actions">
                <button class="table__action-btn table__action-btn--view" data-id="${usuario.id}" title="Ver detalles">
                    <i class='bx bx-show'></i>
                </button>
                <button class="table__action-btn table__action-btn--edit" data-id="${usuario.id}" title="Editar">
                    <i class='bx bx-edit'></i>
                </button>
                <button class="table__action-btn table__action-btn--delete" data-id="${usuario.id}" title="Eliminar">
                    <i class='bx bx-trash'></i>
                </button>
            </td>
        `;
        
        usuariosTableBody.appendChild(row);
    });
    
    // Agregar event listeners a los botones de acción
    document.querySelectorAll('.table__action-btn--view').forEach(btn => {
        btn.addEventListener('click', () => verDetallesUsuario(btn.dataset.id));
    });
    
    document.querySelectorAll('.table__action-btn--edit').forEach(btn => {
        btn.addEventListener('click', () => editarUsuario(btn.dataset.id));
    });
    
    document.querySelectorAll('.table__action-btn--delete').forEach(btn => {
        btn.addEventListener('click', () => confirmarEliminarUsuario(btn.dataset.id));
    });
}

function filtrarUsuarios() {
    const termino = searchInput.value.toLowerCase().trim();
    
    if (!termino) {
        renderizarUsuarios(usuarios);
        return;
    }
    
    const usuariosFiltrados = usuarios.filter(usuario => 
        usuario.nombre.toLowerCase().includes(termino) || 
        usuario.apellido.toLowerCase().includes(termino) || 
        (usuario.numero_telefonico && usuario.numero_telefonico.includes(termino)) ||
        usuario.rol.toLowerCase().includes(termino) ||
        usuario.id.toString().includes(termino)
    );
    
    renderizarUsuarios(usuariosFiltrados);
}

async function verDetallesUsuario(id) {
    try {
        const usuario = await obtenerUsuarioPorId(id);
        if (!usuario) return;
        
        detailsId.textContent = usuario.id;
        detailsNombre.textContent = usuario.nombre;
        detailsApellido.textContent = usuario.apellido;
        detailsTelefono.textContent = usuario.numero_telefonico || 'No disponible';
        detailsRole.textContent = formatearRol(usuario.rol);
        
        // Eliminar la referencia al elemento detailsEstado
        const estadoElement = document.getElementById('detailsEstado');
        if (estadoElement) {
            estadoElement.parentElement.remove();
        }
        
        toggleModal(detailsModal, true);
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar detalles del usuario', 'error');
    }
}

async function editarUsuario(id) {
    try {
        const usuario = await obtenerUsuarioPorId(id);
        if (!usuario) return;
        
        usuarioActual = usuario;
        
        // Llenar formulario
        userId.value = usuario.id;
        nombre.value = usuario.nombre;
        apellido.value = usuario.apellido;
        numero_telefonico.value = usuario.numero_telefonico || '';
        rol.value = usuario.rol;
        
        // Cambiar título del modal
        document.getElementById('modalTitle').textContent = 'Editar Usuario';
        
        toggleModal(userModal, true);
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar datos del usuario', 'error');
    }
}

function confirmarEliminarUsuario(id) {
    const usuario = usuarios.find(u => u.id == id);
    if (!usuario) return;
    
    usuarioActual = usuario;
    confirmTitle.textContent = 'Eliminar Usuario';
    confirmMessage.textContent = `¿Estás seguro de eliminar al usuario ${usuario.nombre} ${usuario.apellido}?`;
    
    accionConfirmacion = 'eliminar';
    toggleModal(confirmModal, true);
}

async function ejecutarAccionConfirmada() {
    if (!usuarioActual || !accionConfirmacion) return;
    
    toggleModal(confirmModal, false);
    mostrarLoader(true);
    
    try {
        if (accionConfirmacion === 'eliminar') {
            await eliminarUsuario(usuarioActual.id);
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion(`Error al ${accionConfirmacion} usuario`, 'error');
    } finally {
        mostrarLoader(false);
        usuarioActual = null;
        accionConfirmacion = null;
    }
}

async function eliminarUsuario(id) {
    try {
        const response = await fetch(`${API_URL}/usuarios/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Error al eliminar usuario');
        
        // Actualizar lista de usuarios
        usuarios = usuarios.filter(u => u.id != id);
        renderizarUsuarios(usuarios);
        
        mostrarNotificacion('Usuario eliminado correctamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function guardarUsuario(e) {
    e.preventDefault();
    
    const formData = {
        nombre: nombre.value.trim(),
        apellido: apellido.value.trim(),
        numero_telefonico: numero_telefonico.value.trim() || null,
        rol: rol.value
    };
    
    if (!formData.nombre || !formData.apellido || !formData.rol) {
        mostrarNotificacion('Por favor, completa los campos obligatorios', 'error');
        return;
    }
    
    mostrarLoader(true);
    cerrarModal();
    
    try {
        if (userId.value) {
            // Actualizar usuario existente
            await actualizarUsuario(userId.value, formData);
        } else {
            // Crear nuevo usuario
            await crearUsuario(formData);
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al guardar usuario', 'error');
    } finally {
        mostrarLoader(false);
    }
}

async function crearUsuario(formData) {
    try {
        // Enviar datos al servidor para crear el usuario
        const response = await fetch(`${API_URL}/usuarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) throw new Error('Error al crear usuario');
        
        // Obtener el usuario creado con su ID asignado
        const nuevoUsuario = await response.json();
        
        // Actualizar lista de usuarios
        await cargarUsuarios(); // Recargar todos los usuarios para obtener el nuevo
        
        mostrarNotificacion('Usuario creado correctamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function actualizarUsuario(id, formData) {
    try {
        const response = await fetch(`${API_URL}/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) throw new Error('Error al actualizar usuario');
        
        // Actualizar usuario en la lista
        const index = usuarios.findIndex(u => u.id == id);
        if (index !== -1) {
            usuarios[index] = {
                ...usuarios[index],
                ...formData
            };
        }
        
        renderizarUsuarios(usuarios);
        
        mostrarNotificacion('Usuario actualizado correctamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function obtenerUsuarioPorId(id) {
    // Primero buscamos en la lista local
    let usuario = usuarios.find(u => u.id == id);
    
    // Si no lo encontramos, lo buscamos en el servidor
    if (!usuario) {
        try {
            const response = await fetch(`${API_URL}/usuarios/${id}`);
            if (!response.ok) throw new Error('Error al obtener usuario');
            
            usuario = await response.json();
            
            // Actualizamos la lista local
            const index = usuarios.findIndex(u => u.id == id);
            if (index !== -1) {
                usuarios[index] = usuario;
            } else {
                usuarios.push(usuario);
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarNotificacion('Error al obtener datos del usuario', 'error');
            return null;
        }
    }
    
    return usuario;
}

// Funciones para exportar datos
function exportarExcel() {
    // Importar la librería XLSX
    const XLSX = window.XLSX;

    try {
        // Preparar datos para exportar
        const datosExportar = usuarios.map(usuario => ({
            ID: usuario.id,
            Nombre: usuario.nombre,
            Apellido: usuario.apellido,
            Teléfono: usuario.numero_telefonico || '-',
            Rol: formatearRol(usuario.rol)
        }));
        
        // Crear libro de trabajo
        const libro = XLSX.utils.book_new();
        const hoja = XLSX.utils.json_to_sheet(datosExportar);
        
        // Añadir hoja al libro
        XLSX.utils.book_append_sheet(libro, hoja, 'Usuarios');
        
        // Generar archivo y descargar
        XLSX.writeFile(libro, 'usuarios.xlsx');
        
        mostrarNotificacion('Datos exportados a Excel correctamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al exportar a Excel', 'error');
    }
}

function exportarPDF() {
    try {
        // Importar jsPDF
        const { jsPDF } = window.jspdf;
        
        // Crear documento PDF
        const doc = new jsPDF();
        
        // Título
        doc.setFontSize(18);
        doc.text('Listado de Usuarios', 14, 22);
        
        // Fecha
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);
        
        // Preparar datos para la tabla
        const datosTabla = usuarios.map(usuario => [
            usuario.id,
            usuario.nombre,
            usuario.apellido,
            usuario.numero_telefonico || '-',
            formatearRol(usuario.rol)
        ]);
        
        // Crear tabla
        doc.autoTable({
            head: [['ID', 'Nombre', 'Apellido', 'Teléfono', 'Rol']],
            body: datosTabla,
            startY: 40,
            theme: 'grid',
            styles: {
                fontSize: 10,
                cellPadding: 3
            },
            headStyles: {
                fillColor: [57, 169, 0],
                textColor: [255, 255, 255],
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240]
            }
        });
        
        // Guardar PDF
        doc.save('usuarios.pdf');
        
        mostrarNotificacion('Datos exportados a PDF correctamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al exportar a PDF', 'error');
    }
}

// Funciones de UI
function abrirModalNuevoUsuario() {
    // Limpiar formulario
    userForm.reset();
    userId.value = '';
    usuarioActual = null;
    
    // Cambiar título del modal
    document.getElementById('modalTitle').textContent = 'Nuevo Usuario';
    
    toggleModal(userModal, true);
}

function cerrarModal() {
    toggleModal(userModal, false);
    userForm.reset();
    usuarioActual = null;
}

function toggleModal(modal, show) {
    if (show) {
        modal.classList.add('show');
    } else {
        modal.classList.remove('show');
    }
}

function mostrarLoader(show) {
    if (show) {
        loader.classList.add('show');
    } else {
        loader.classList.remove('show');
    }
}

function mostrarEstadoVacio(show) {
    if (show) {
        emptyState.classList.add('show');
    } else {
        emptyState.classList.remove('show');
    }
}

function mostrarNotificacion(mensaje, tipo = 'success') {
    toastMessage.textContent = mensaje;
    
    // Cambiar icono según tipo
    toastIcon.className = 'bx toast__icon';
    
    if (tipo === 'success') {
        toastIcon.classList.add('bx-check-circle', 'toast__icon--success');
    } else if (tipo === 'error') {
        toastIcon.classList.add('bx-x-circle', 'toast__icon--error');
    } else if (tipo === 'warning') {
        toastIcon.classList.add('bx-error', 'toast__icon--warning');
    }
    
    // Mostrar toast
    toggleModal(toast, true);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        toggleModal(toast, false);
    }, 3000);
}

// Funciones de utilidad
function formatearRol(rol) {
    if (!rol) return '-';
    
    // Capitalizar primera letra de cada palabra
    return rol.split(' ').map(palabra => 
        palabra.charAt(0).toUpperCase() + palabra.slice(1)
    ).join(' ');
}