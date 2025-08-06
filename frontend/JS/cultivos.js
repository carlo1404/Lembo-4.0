// Variables globales
let cultivos = [];
let cultivoActual = null;
let accionConfirmacion = null;
const API_URL = 'http://localhost:3000';

// Elementos DOM
const cultivosTableBody = document.getElementById('cultivosTableBody');
const searchInput = document.getElementById('searchInput');
const loader = document.getElementById('loader');
const emptyState = document.getElementById('emptyState');

// Modales
const cultivoModal = document.getElementById('cultivoModal');
const detailsModal = document.getElementById('detailsModal');
const confirmModal = document.getElementById('confirmModal');
const toast = document.getElementById('toast');

// Botones
const btnNuevoCultivo = document.getElementById('btnNuevoCultivo');
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
const cultivoForm = document.getElementById('cultivoForm');
const cultivoId = document.getElementById('cultivoId');
const nombre = document.getElementById('nombre');
const tipo = document.getElementById('tipo');
const ubicacion = document.getElementById('ubicacion');
const descripcion = document.getElementById('descripcion');
const imagen = document.getElementById('imagen');

// Detalles
const detailsId = document.getElementById('detailsId');
const detailsNombre = document.getElementById('detailsNombre');
const detailsTipo = document.getElementById('detailsTipo');
const detailsDescripcion = document.getElementById('detailsDescripcion');
const detailsUbicacion = document.getElementById('detailsUbicacion');
const detailsFechaRegistro = document.getElementById('detailsFechaRegistro');

// Confirmación
const confirmTitle = document.getElementById('confirmTitle');
const confirmMessage = document.getElementById('confirmMessage');

// Toast
const toastIcon = document.getElementById('toastIcon');
const toastMessage = document.getElementById('toastMessage');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarCultivos();
    
    // Event listeners
    btnNuevoCultivo.addEventListener('click', abrirModalNuevoCultivo);
    btnExportarExcel.addEventListener('click', exportarExcel);
    btnExportarPDF.addEventListener('click', exportarPDF);
    closeModal.addEventListener('click', cerrarModal);
    closeDetailsModal.addEventListener('click', () => toggleModal(detailsModal, false));
    closeConfirmModal.addEventListener('click', () => toggleModal(confirmModal, false));
    cancelForm.addEventListener('click', cerrarModal);
    cancelConfirm.addEventListener('click', () => toggleModal(confirmModal, false));
    confirmAction.addEventListener('click', ejecutarAccionConfirmada);
    closeToast.addEventListener('click', () => toggleModal(toast, false));
    cultivoForm.addEventListener('submit', guardarCultivo);
    searchInput.addEventListener('input', filtrarCultivos);
    
    // Soporte para responsive
    const toggleSidebar = document.createElement('button');
    toggleSidebar.className = 'button button--secondary sidebar-toggle';
    toggleSidebar.innerHTML = '<i class="bx bx-menu"></i>';
    document.querySelector('.main__header').prepend(toggleSidebar);
    
    toggleSidebar.addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('show');
    });
});

// Funciones para gestionar cultivos
async function cargarCultivos() {
    mostrarLoader(true);
    try {
        const response = await fetch(`${API_URL}/cultivos`);
        if (!response.ok) throw new Error('Error al cargar cultivos');
        
        cultivos = await response.json();
        renderizarCultivos(cultivos);
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar cultivos', 'error');
    } finally {
        mostrarLoader(false);
    }
}

function renderizarCultivos(listaCultivos) {
    cultivosTableBody.innerHTML = '';
    
    if (listaCultivos.length === 0) {
        mostrarEstadoVacio(true);
        return;
    }
    
    mostrarEstadoVacio(false);
    
    listaCultivos.forEach(cultivo => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${cultivo.id}</td>
            <td>${cultivo.nombre}</td>
            <td>${cultivo.tipo || '-'}</td>
            <td>${cultivo.ubicacion || '-'}</td>
            <td>${formatearFecha(cultivo.fecha_registro)}</td>
            <td class="table__actions">
                <button class="table__action-btn table__action-btn--view" data-id="${cultivo.id}" title="Ver detalles">
                    <i class='bx bx-show'></i>
                </button>
                <button class="table__action-btn table__action-btn--edit" data-id="${cultivo.id}" title="Editar">
                    <i class='bx bx-edit'></i>
                </button>
                <button class="table__action-btn table__action-btn--delete" data-id="${cultivo.id}" title="Eliminar">
                    <i class='bx bx-trash'></i>
                </button>
            </td>
        `;
        
        cultivosTableBody.appendChild(row);
    });
    
    // Agregar event listeners a los botones de acción
    document.querySelectorAll('.table__action-btn--view').forEach(btn => {
        btn.addEventListener('click', () => verDetallesCultivo(btn.dataset.id));
    });
    
    document.querySelectorAll('.table__action-btn--edit').forEach(btn => {
        btn.addEventListener('click', () => editarCultivo(btn.dataset.id));
    });
    
    document.querySelectorAll('.table__action-btn--delete').forEach(btn => {
        btn.addEventListener('click', () => confirmarEliminarCultivo(btn.dataset.id));
    });
}

function filtrarCultivos() {
    const termino = searchInput.value.toLowerCase().trim();
    
    if (!termino) {
        renderizarCultivos(cultivos);
        return;
    }
    
    const cultivosFiltrados = cultivos.filter(cultivo => 
        cultivo.nombre?.toLowerCase().includes(termino) || 
        cultivo.tipo?.toLowerCase().includes(termino) || 
        cultivo.ubicacion?.toLowerCase().includes(termino) ||
        cultivo.descripcion?.toLowerCase().includes(termino) ||
        cultivo.id.toString().includes(termino)
    );
    
    renderizarCultivos(cultivosFiltrados);
}

async function verDetallesCultivo(id) {
    try {
        const cultivo = await obtenerCultivoPorId(id);
        if (!cultivo) return;
        
        detailsId.textContent = cultivo.id;
        detailsNombre.textContent = cultivo.nombre;
        detailsTipo.textContent = cultivo.tipo || '-';
        detailsDescripcion.textContent = cultivo.descripcion || 'Sin descripción';
        detailsUbicacion.textContent = cultivo.ubicacion || '-';
        detailsFechaRegistro.textContent = formatearFecha(cultivo.fecha_registro);
        
        toggleModal(detailsModal, true);
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar detalles del cultivo', 'error');
    }
}

async function editarCultivo(id) {
    try {
        const cultivo = await obtenerCultivoPorId(id);
        if (!cultivo) return;
        
        cultivoActual = cultivo;
        
        // Llenar formulario
        cultivoId.value = cultivo.id;
        nombre.value = cultivo.nombre || '';
        tipo.value = cultivo.tipo || '';
        ubicacion.value = cultivo.ubicacion || '';
        descripcion.value = cultivo.descripcion || '';
        
        // No podemos establecer el valor del input file por seguridad
        
        // Cambiar título del modal
        document.getElementById('modalTitle').textContent = 'Editar Cultivo';
        
        toggleModal(cultivoModal, true);
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar datos del cultivo', 'error');
    }
}

function confirmarEliminarCultivo(id) {
    const cultivo = cultivos.find(c => c.id == id);
    if (!cultivo) return;
    
    cultivoActual = cultivo;
    confirmTitle.textContent = 'Eliminar Cultivo';
    confirmMessage.textContent = `¿Estás seguro de eliminar el cultivo "${cultivo.nombre}"?`;
    
    accionConfirmacion = 'eliminar';
    toggleModal(confirmModal, true);
}

async function ejecutarAccionConfirmada() {
    if (!cultivoActual || !accionConfirmacion) return;
    
    toggleModal(confirmModal, false);
    mostrarLoader(true);
    
    try {
        if (accionConfirmacion === 'eliminar') {
            await eliminarCultivo(cultivoActual.id);
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion(`Error al ${accionConfirmacion} cultivo`, 'error');
    } finally {
        mostrarLoader(false);
        cultivoActual = null;
        accionConfirmacion = null;
    }
}

async function eliminarCultivo(id) {
    try {
        const response = await fetch(`${API_URL}/cultivos/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Error al eliminar cultivo');
        
        // Actualizar lista de cultivos
        cultivos = cultivos.filter(c => c.id != id);
        renderizarCultivos(cultivos);
        
        mostrarNotificacion('Cultivo eliminado correctamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function guardarCultivo(e) {
    e.preventDefault();
    
    const formData = {
        nombre: nombre.value.trim(),
        tipo: tipo.value,
        ubicacion: ubicacion.value,
        descripcion: descripcion.value.trim() || null
    };
    
    if (!formData.nombre || !formData.tipo || !formData.ubicacion) {
        mostrarNotificacion('Por favor, completa los campos obligatorios correctamente', 'error');
        return;
    }
    
    // Nota: No enviamos la imagen al backend en este ejemplo
    
    mostrarLoader(true);
    cerrarModal();
    
    try {
        if (cultivoId.value) {
            // Actualizar cultivo existente
            await actualizarCultivo(cultivoId.value, formData);
        } else {
            // Crear nuevo cultivo
            await crearCultivo(formData);
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al guardar cultivo', 'error');
    } finally {
        mostrarLoader(false);
    }
}

async function crearCultivo(formData) {
    try {
        // Enviar datos al servidor para crear el cultivo
        const response = await fetch(`${API_URL}/cultivos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) throw new Error('Error al crear cultivo');
        
        // Obtener el cultivo creado con su ID asignado
        const nuevoCultivo = await response.json();
        
        // Actualizar lista de cultivos
        await cargarCultivos(); // Recargar todos los cultivos para obtener el nuevo
        
        mostrarNotificacion('Cultivo creado correctamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function actualizarCultivo(id, formData) {
    try {
        const response = await fetch(`${API_URL}/cultivos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) throw new Error('Error al actualizar cultivo');
        
        // Actualizar cultivo en la lista
        const index = cultivos.findIndex(c => c.id == id);
        if (index !== -1) {
            cultivos[index] = {
                ...cultivos[index],
                ...formData
            };
        }
        
        renderizarCultivos(cultivos);
        
        mostrarNotificacion('Cultivo actualizado correctamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function obtenerCultivoPorId(id) {
    // Primero buscamos en la lista local
    let cultivo = cultivos.find(c => c.id == id);
    
    // Si no lo encontramos, lo buscamos en el servidor
    if (!cultivo) {
        try {
            const response = await fetch(`${API_URL}/cultivos/${id}`);
            if (!response.ok) throw new Error('Error al obtener cultivo');
            
            cultivo = await response.json();
            
            // Actualizamos la lista local
            const index = cultivos.findIndex(c => c.id == id);
            if (index !== -1) {
                cultivos[index] = cultivo;
            } else {
                cultivos.push(cultivo);
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarNotificacion('Error al obtener datos del cultivo', 'error');
            return null;
        }
    }
    
    return cultivo;
}

// Funciones para exportar datos
function exportarExcel() {
    // Importar la librería XLSX
    const XLSX = window.XLSX;

    try {
        // Preparar datos para exportar
        const datosExportar = cultivos.map(cultivo => ({
            ID: cultivo.id,
            Nombre: cultivo.nombre,
            Tipo: cultivo.tipo || '-',
            Descripción: cultivo.descripcion || '-',
            Ubicación: cultivo.ubicacion || '-',
            'Fecha Registro': formatearFecha(cultivo.fecha_registro)
        }));
        
        // Crear libro de trabajo
        const libro = XLSX.utils.book_new();
        const hoja = XLSX.utils.json_to_sheet(datosExportar);
        
        // Añadir hoja al libro
        XLSX.utils.book_append_sheet(libro, hoja, 'Cultivos');
        
        // Generar archivo y descargar
        XLSX.writeFile(libro, 'cultivos.xlsx');
        
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
        doc.text('Listado de Cultivos', 14, 22);
        
        // Fecha
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);
        
        // Preparar datos para la tabla
        const datosTabla = cultivos.map(cultivo => [
            cultivo.id,
            cultivo.nombre,
            cultivo.tipo || '-',
            cultivo.ubicacion || '-',
            formatearFecha(cultivo.fecha_registro)
        ]);
        
        // Crear tabla
        doc.autoTable({
            head: [['ID', 'Nombre', 'Tipo', 'Ubicación', 'Fecha Registro']],
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
        doc.save('cultivos.pdf');
        
        mostrarNotificacion('Datos exportados a PDF correctamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al exportar a PDF', 'error');
    }
}

// Funciones de UI
function abrirModalNuevoCultivo() {
    // Limpiar formulario
    cultivoForm.reset();
    cultivoId.value = '';
    cultivoActual = null;
    
    // Cambiar título del modal
    document.getElementById('modalTitle').textContent = 'Nuevo Cultivo';
    
    toggleModal(cultivoModal, true);
}

function cerrarModal() {
    toggleModal(cultivoModal, false);
    cultivoForm.reset();
    cultivoActual = null;
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
function formatearFecha(fecha) {
    if (!fecha) return '-';
    
    try {
        const date = new Date(fecha);
        if (isNaN(date.getTime())) return fecha;
        
        return date.toLocaleDateString();
    } catch (error) {
        return fecha;
    }
}