// Variables globales
let ciclos = [];
let cicloActual = null;
let accionConfirmacion = null;
const API_URL = 'http://localhost:3000';

// Elementos DOM
const ciclosTableBody = document.getElementById('ciclosTableBody');
const searchInput = document.getElementById('searchInput');
const loader = document.getElementById('loader');
const emptyState = document.getElementById('emptyState');

// Modales
const cicloModal = document.getElementById('cicloModal');
const detailsModal = document.getElementById('detailsModal');
const confirmModal = document.getElementById('confirmModal');
const toast = document.getElementById('toast');

// Botones
const btnNuevoCiclo = document.getElementById('btnNuevoCiclo');
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
const cicloForm = document.getElementById('cicloForm');
const cicloId = document.getElementById('cicloId');
const nombre = document.getElementById('nombre');
const duracion = document.getElementById('duracion');

// Detalles
const detailsId = document.getElementById('detailsId');
const detailsNombre = document.getElementById('detailsNombre');
const detailsDuracion = document.getElementById('detailsDuracion');
const detailsFechaRegistro = document.getElementById('detailsFechaRegistro');

// Confirmación
const confirmTitle = document.getElementById('confirmTitle');
const confirmMessage = document.getElementById('confirmMessage');

// Toast
const toastIcon = document.getElementById('toastIcon');
const toastMessage = document.getElementById('toastMessage');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarCiclos();
    
    // Event listeners
    btnNuevoCiclo.addEventListener('click', abrirModalNuevoCiclo);
    btnExportarExcel.addEventListener('click', exportarExcel);
    btnExportarPDF.addEventListener('click', exportarPDF);
    closeModal.addEventListener('click', cerrarModal);
    closeDetailsModal.addEventListener('click', () => toggleModal(detailsModal, false));
    closeConfirmModal.addEventListener('click', () => toggleModal(confirmModal, false));
    cancelForm.addEventListener('click', cerrarModal);
    cancelConfirm.addEventListener('click', () => toggleModal(confirmModal, false));
    confirmAction.addEventListener('click', ejecutarAccionConfirmada);
    closeToast.addEventListener('click', () => toggleModal(toast, false));
    cicloForm.addEventListener('submit', guardarCiclo);
    searchInput.addEventListener('input', filtrarCiclos);
    
    // Soporte para responsive
    const toggleSidebar = document.createElement('button');
    toggleSidebar.className = 'button button--secondary sidebar-toggle';
    toggleSidebar.innerHTML = '<i class="bx bx-menu"></i>';
    document.querySelector('.main__header').prepend(toggleSidebar);
    
    toggleSidebar.addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('show');
    });
});

// Funciones para gestionar ciclos
async function cargarCiclos() {
    mostrarLoader(true);
    try {
        const response = await fetch(`${API_URL}/ciclos`);
        if (!response.ok) throw new Error('Error al cargar ciclos');
        
        ciclos = await response.json();
        renderizarCiclos(ciclos);
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar ciclos', 'error');
    } finally {
        mostrarLoader(false);
    }
}

function renderizarCiclos(listaCiclos) {
    ciclosTableBody.innerHTML = '';
    
    if (listaCiclos.length === 0) {
        mostrarEstadoVacio(true);
        return;
    }
    
    mostrarEstadoVacio(false);
    
    listaCiclos.forEach(ciclo => {
        const row = document.createElement('tr');
        
        // Formatear fecha
        const fecha = new Date(ciclo.fecha_registro);
        const fechaFormateada = fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        row.innerHTML = `
            <td>${ciclo.id}</td>
            <td>${ciclo.nombre}</td>
            <td>${ciclo.duracion}</td>
            <td>${fechaFormateada}</td>
            <td class="table__actions">
                <button class="table__action-btn table__action-btn--view" data-id="${ciclo.id}" title="Ver detalles">
                    <i class='bx bx-show'></i>
                </button>
                <button class="table__action-btn table__action-btn--edit" data-id="${ciclo.id}" title="Editar">
                    <i class='bx bx-edit'></i>
                </button>
                <button class="table__action-btn table__action-btn--delete" data-id="${ciclo.id}" title="Eliminar">
                    <i class='bx bx-trash'></i>
                </button>
            </td>
        `;
        
        ciclosTableBody.appendChild(row);
    });
    
    // Agregar event listeners a los botones de acción
    document.querySelectorAll('.table__action-btn--view').forEach(btn => {
        btn.addEventListener('click', () => verDetallesCiclo(btn.dataset.id));
    });
    
    document.querySelectorAll('.table__action-btn--edit').forEach(btn => {
        btn.addEventListener('click', () => editarCiclo(btn.dataset.id));
    });
    
    document.querySelectorAll('.table__action-btn--delete').forEach(btn => {
        btn.addEventListener('click', () => confirmarEliminarCiclo(btn.dataset.id));
    });
}

function filtrarCiclos() {
    const termino = searchInput.value.toLowerCase().trim();
    
    if (!termino) {
        renderizarCiclos(ciclos);
        return;
    }
    
    const ciclosFiltrados = ciclos.filter(ciclo => 
        ciclo.nombre.toLowerCase().includes(termino) || 
        ciclo.duracion.toLowerCase().includes(termino) ||
        ciclo.id.toString().includes(termino)
    );
    
    renderizarCiclos(ciclosFiltrados);
}

async function verDetallesCiclo(id) {
    try {
        const ciclo = await obtenerCicloPorId(id);
        if (!ciclo) return;
        
        // Formatear fecha
        const fecha = new Date(ciclo.fecha_registro);
        const fechaFormateada = fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        detailsId.textContent = ciclo.id;
        detailsNombre.textContent = ciclo.nombre;
        detailsDuracion.textContent = ciclo.duracion;
        detailsFechaRegistro.textContent = fechaFormateada;
        
        toggleModal(detailsModal, true);
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar detalles del ciclo', 'error');
    }
}

async function editarCiclo(id) {
    try {
        const ciclo = await obtenerCicloPorId(id);
        if (!ciclo) return;
        
        cicloActual = ciclo;
        
        // Llenar formulario
        cicloId.value = ciclo.id;
        nombre.value = ciclo.nombre;
        duracion.value = ciclo.duracion;
        
        // Cambiar título del modal
        document.getElementById('modalTitle').textContent = 'Editar Ciclo';
        
        toggleModal(cicloModal, true);
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar datos del ciclo', 'error');
    }
}

function confirmarEliminarCiclo(id) {
    const ciclo = ciclos.find(c => c.id == id);
    if (!ciclo) return;
    
    cicloActual = ciclo;
    confirmTitle.textContent = 'Eliminar Ciclo';
    confirmMessage.textContent = `¿Estás seguro de eliminar el ciclo "${ciclo.nombre}"?`;
    
    accionConfirmacion = 'eliminar';
    toggleModal(confirmModal, true);
}

async function ejecutarAccionConfirmada() {
    if (!cicloActual || !accionConfirmacion) return;
    
    toggleModal(confirmModal, false);
    mostrarLoader(true);
    
    try {
        if (accionConfirmacion === 'eliminar') {
            await eliminarCiclo(cicloActual.id);
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion(`Error al ${accionConfirmacion} ciclo`, 'error');
    } finally {
        mostrarLoader(false);
        cicloActual = null;
        accionConfirmacion = null;
    }
}

async function eliminarCiclo(id) {
    try {
        const response = await fetch(`${API_URL}/ciclos/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Error al eliminar ciclo');
        
        // Actualizar lista de ciclos
        ciclos = ciclos.filter(c => c.id != id);
        renderizarCiclos(ciclos);
        
        mostrarNotificacion('Ciclo eliminado correctamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function guardarCiclo(e) {
    e.preventDefault();
    
    const formData = {
        nombre: nombre.value.trim(),
        duracion: duracion.value.trim()
    };
    
    if (!formData.nombre || !formData.duracion) {
        mostrarNotificacion('Por favor, completa los campos obligatorios', 'error');
        return;
    }
    
    mostrarLoader(true);
    cerrarModal();
    
    try {
        if (cicloId.value) {
            // Actualizar ciclo existente
            await actualizarCiclo(cicloId.value, formData);
        } else {
            // Crear nuevo ciclo
            await crearCiclo(formData);
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al guardar ciclo', 'error');
    } finally {
        mostrarLoader(false);
    }
}

async function crearCiclo(formData) {
    try {
        // Enviar datos al servidor para crear el ciclo
        const response = await fetch(`${API_URL}/ciclos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) throw new Error('Error al crear ciclo');
        
        // Obtener el ciclo creado con su ID asignado
        const nuevoCiclo = await response.json();
        
        // Actualizar lista de ciclos
        await cargarCiclos(); // Recargar todos los ciclos para obtener el nuevo
        
        mostrarNotificacion('Ciclo creado correctamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function actualizarCiclo(id, formData) {
    try {
        const response = await fetch(`${API_URL}/ciclos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) throw new Error('Error al actualizar ciclo');
        
        // Actualizar ciclo en la lista
        const index = ciclos.findIndex(c => c.id == id);
        if (index !== -1) {
            ciclos[index] = {
                ...ciclos[index],
                ...formData
            };
        }
        
        renderizarCiclos(ciclos);
        
        mostrarNotificacion('Ciclo actualizado correctamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function obtenerCicloPorId(id) {
    // Primero buscamos en la lista local
    let ciclo = ciclos.find(c => c.id == id);
    
    // Si no lo encontramos, lo buscamos en el servidor
    if (!ciclo) {
        try {
            const response = await fetch(`${API_URL}/ciclos/${id}`);
            if (!response.ok) throw new Error('Error al obtener ciclo');
            
            ciclo = await response.json();
            
            // Actualizamos la lista local
            const index = ciclos.findIndex(c => c.id == id);
            if (index !== -1) {
                ciclos[index] = ciclo;
            } else {
                ciclos.push(ciclo);
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarNotificacion('Error al obtener datos del ciclo', 'error');
            return null;
        }
    }
    
    return ciclo;
}

// Funciones para exportar datos
function exportarExcel() {
    // Importar la librería XLSX
    const XLSX = window.XLSX;

    try {
        // Preparar datos para exportar
        const datosExportar = ciclos.map(ciclo => {
            // Formatear fecha
            const fecha = new Date(ciclo.fecha_registro);
            const fechaFormateada = fecha.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            
            return {
                ID: ciclo.id,
                Nombre: ciclo.nombre,
                Duración: ciclo.duracion,
                'Fecha Registro': fechaFormateada
            };
        });
        
        // Crear libro de trabajo
        const libro = XLSX.utils.book_new();
        const hoja = XLSX.utils.json_to_sheet(datosExportar);
        
        // Añadir hoja al libro
        XLSX.utils.book_append_sheet(libro, hoja, 'Ciclos');
        
        // Generar archivo y descargar
        XLSX.writeFile(libro, 'ciclos.xlsx');
        
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
        doc.text('Listado de Ciclos', 14, 22);
        
        // Fecha
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);
        
        // Preparar datos para la tabla
        const datosTabla = ciclos.map(ciclo => {
            // Formatear fecha
            const fecha = new Date(ciclo.fecha_registro);
            const fechaFormateada = fecha.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            
            return [
                ciclo.id,
                ciclo.nombre,
                ciclo.duracion,
                fechaFormateada
            ];
        });
        
        // Crear tabla
        doc.autoTable({
            head: [['ID', 'Nombre', 'Duración', 'Fecha Registro']],
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
        doc.save('ciclos.pdf');
        
        mostrarNotificacion('Datos exportados a PDF correctamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al exportar a PDF', 'error');
    }
}

// Funciones de UI
function abrirModalNuevoCiclo() {
    // Limpiar formulario
    cicloForm.reset();
    cicloId.value = '';
    cicloActual = null;
    
    // Cambiar título del modal
    document.getElementById('modalTitle').textContent = 'Nuevo Ciclo';
    
    toggleModal(cicloModal, true);
}

function cerrarModal() {
    toggleModal(cicloModal, false);
    cicloForm.reset();
    cicloActual = null;
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