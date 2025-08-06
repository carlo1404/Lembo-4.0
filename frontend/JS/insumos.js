// Variables globales
let insumos = [];
let insumoActual = null;
let accionConfirmacion = null;
const API_URL = 'http://localhost:3000';

// Elementos DOM
const insumosTableBody = document.getElementById('insumosTableBody');
const searchInput = document.getElementById('searchInput');
const loader = document.getElementById('loader');
const emptyState = document.getElementById('emptyState');

// Modales
const insumoModal = document.getElementById('insumoModal');
const detailsModal = document.getElementById('detailsModal');
const confirmModal = document.getElementById('confirmModal');
const toast = document.getElementById('toast');

// Botones
const btnNuevoInsumo = document.getElementById('btnNuevoInsumo');
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
const insumoForm = document.getElementById('insumoForm');
const insumoId = document.getElementById('insumoId');
const nombre = document.getElementById('nombre');
const valor_unitario = document.getElementById('valor_unitario');
const cantidad = document.getElementById('cantidad');
const unidad = document.getElementById('unidad');
const descripcion = document.getElementById('descripcion');
const imagen = document.getElementById('imagen');

// Detalles
const detailsId = document.getElementById('detailsId');
const detailsNombre = document.getElementById('detailsNombre');
const detailsValorUnitario = document.getElementById('detailsValorUnitario');
const detailsCantidad = document.getElementById('detailsCantidad');
const detailsUnidad = document.getElementById('detailsUnidad');
const detailsDescripcion = document.getElementById('detailsDescripcion');
const detailsFechaRegistro = document.getElementById('detailsFechaRegistro');

// Confirmación
const confirmTitle = document.getElementById('confirmTitle');
const confirmMessage = document.getElementById('confirmMessage');

// Toast
const toastIcon = document.getElementById('toastIcon');
const toastMessage = document.getElementById('toastMessage');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarInsumos();
    
    // Event listeners
    btnNuevoInsumo.addEventListener('click', abrirModalNuevoInsumo);
    btnExportarExcel.addEventListener('click', exportarExcel);
    btnExportarPDF.addEventListener('click', exportarPDF);
    closeModal.addEventListener('click', cerrarModal);
    closeDetailsModal.addEventListener('click', () => toggleModal(detailsModal, false));
    closeConfirmModal.addEventListener('click', () => toggleModal(confirmModal, false));
    cancelForm.addEventListener('click', cerrarModal);
    cancelConfirm.addEventListener('click', () => toggleModal(confirmModal, false));
    confirmAction.addEventListener('click', ejecutarAccionConfirmada);
    closeToast.addEventListener('click', () => toggleModal(toast, false));
    insumoForm.addEventListener('submit', guardarInsumo);
    searchInput.addEventListener('input', filtrarInsumos);
    
    // Soporte para responsive
    const toggleSidebar = document.createElement('button');
    toggleSidebar.className = 'button button--secondary sidebar-toggle';
    toggleSidebar.innerHTML = '<i class="bx bx-menu"></i>';
    document.querySelector('.main__header').prepend(toggleSidebar);
    
    toggleSidebar.addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('show');
    });
});

// Funciones para gestionar insumos
async function cargarInsumos() {
    mostrarLoader(true);
    try {
        const response = await fetch(`${API_URL}/insumos`);
        if (!response.ok) throw new Error('Error al cargar insumos');
        
        insumos = await response.json();
        renderizarInsumos(insumos);
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar insumos', 'error');
    } finally {
        mostrarLoader(false);
    }
}

function renderizarInsumos(listaInsumos) {
    insumosTableBody.innerHTML = '';
    
    if (listaInsumos.length === 0) {
        mostrarEstadoVacio(true);
        return;
    }
    
    mostrarEstadoVacio(false);
    
    listaInsumos.forEach(insumo => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${insumo.id}</td>
            <td>${insumo.nombre}</td>
            <td>$${parseFloat(insumo.valor_unitario || 0).toFixed(2)}</td>
            <td>${insumo.cantidad}</td>
            <td>${formatearUnidad(insumo.unidad)}</td>
            <td>${formatearFecha(insumo.fecha_registro)}</td>
            <td class="table__actions">
                <button class="table__action-btn table__action-btn--view" data-id="${insumo.id}" title="Ver detalles">
                    <i class='bx bx-show'></i>
                </button>
                <button class="table__action-btn table__action-btn--edit" data-id="${insumo.id}" title="Editar">
                    <i class='bx bx-edit'></i>
                </button>
                <button class="table__action-btn table__action-btn--delete" data-id="${insumo.id}" title="Eliminar">
                    <i class='bx bx-trash'></i>
                </button>
            </td>
        `;
        
        insumosTableBody.appendChild(row);
    });
    
    // Agregar event listeners a los botones de acción
    document.querySelectorAll('.table__action-btn--view').forEach(btn => {
        btn.addEventListener('click', () => verDetallesInsumo(btn.dataset.id));
    });
    
    document.querySelectorAll('.table__action-btn--edit').forEach(btn => {
        btn.addEventListener('click', () => editarInsumo(btn.dataset.id));
    });
    
    document.querySelectorAll('.table__action-btn--delete').forEach(btn => {
        btn.addEventListener('click', () => confirmarEliminarInsumo(btn.dataset.id));
    });
}

function filtrarInsumos() {
    const termino = searchInput.value.toLowerCase().trim();
    
    if (!termino) {
        renderizarInsumos(insumos);
        return;
    }
    
    const insumosFiltrados = insumos.filter(insumo => 
        insumo.nombre?.toLowerCase().includes(termino) || 
        insumo.descripcion?.toLowerCase().includes(termino) ||
        insumo.unidad?.toLowerCase().includes(termino) ||
        insumo.id.toString().includes(termino)
    );
    
    renderizarInsumos(insumosFiltrados);
}

async function verDetallesInsumo(id) {
    try {
        const insumo = await obtenerInsumoPorId(id);
        if (!insumo) return;
        
        detailsId.textContent = insumo.id;
        detailsNombre.textContent = insumo.nombre;
        detailsValorUnitario.textContent = `$${parseFloat(insumo.valor_unitario || 0).toFixed(2)}`;
        detailsCantidad.textContent = insumo.cantidad;
        detailsUnidad.textContent = formatearUnidad(insumo.unidad);
        detailsDescripcion.textContent = insumo.descripcion || 'Sin descripción';
        detailsFechaRegistro.textContent = formatearFecha(insumo.fecha_registro);
        
        toggleModal(detailsModal, true);
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar detalles del insumo', 'error');
    }
}

async function editarInsumo(id) {
    try {
        const insumo = await obtenerInsumoPorId(id);
        if (!insumo) return;
        
        insumoActual = insumo;
        
        // Llenar formulario
        insumoId.value = insumo.id;
        nombre.value = insumo.nombre || '';
        valor_unitario.value = insumo.valor_unitario || '';
        cantidad.value = insumo.cantidad || '';
        unidad.value = insumo.unidad || '';
        descripcion.value = insumo.descripcion || '';
        
        // No podemos establecer el valor del input file por seguridad
        
        // Cambiar título del modal
        document.getElementById('modalTitle').textContent = 'Editar Insumo';
        
        toggleModal(insumoModal, true);
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar datos del insumo', 'error');
    }
}

function confirmarEliminarInsumo(id) {
    const insumo = insumos.find(i => i.id == id);
    if (!insumo) return;
    
    insumoActual = insumo;
    confirmTitle.textContent = 'Eliminar Insumo';
    confirmMessage.textContent = `¿Estás seguro de eliminar el insumo "${insumo.nombre}"?`;
    
    accionConfirmacion = 'eliminar';
    toggleModal(confirmModal, true);
}

async function ejecutarAccionConfirmada() {
    if (!insumoActual || !accionConfirmacion) return;
    
    toggleModal(confirmModal, false);
    mostrarLoader(true);
    
    try {
        if (accionConfirmacion === 'eliminar') {
            await eliminarInsumo(insumoActual.id);
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion(`Error al ${accionConfirmacion} insumo`, 'error');
    } finally {
        mostrarLoader(false);
        insumoActual = null;
        accionConfirmacion = null;
    }
}

async function eliminarInsumo(id) {
    try {
        const response = await fetch(`${API_URL}/insumos/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Error al eliminar insumo');
        
        // Actualizar lista de insumos
        insumos = insumos.filter(i => i.id != id);
        renderizarInsumos(insumos);
        
        mostrarNotificacion('Insumo eliminado correctamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function guardarInsumo(e) {
    e.preventDefault();
    
    const formData = {
        nombre: nombre.value.trim(),
        valor_unitario: parseFloat(valor_unitario.value),
        cantidad: parseInt(cantidad.value),
        unidad: unidad.value,
        descripcion: descripcion.value.trim() || null
    };
    
    if (!formData.nombre || isNaN(formData.valor_unitario) || isNaN(formData.cantidad) || !formData.unidad) {
        mostrarNotificacion('Por favor, completa los campos obligatorios correctamente', 'error');
        return;
    }
    
    mostrarLoader(true);
    cerrarModal();
    
    try {
        if (insumoId.value) {
            // Actualizar insumo existente
            await actualizarInsumo(insumoId.value, formData);
        } else {
            // Crear nuevo insumo
            await crearInsumo(formData);
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al guardar insumo', 'error');
    } finally {
        mostrarLoader(false);
    }
}

async function crearInsumo(formData) {
    try {
        // Enviar datos al servidor para crear el insumo
        const response = await fetch(`${API_URL}/insumos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) throw new Error('Error al crear insumo');
        
        // Obtener el insumo creado con su ID asignado
        const nuevoInsumo = await response.json();
        
        // Actualizar lista de insumos
        await cargarInsumos(); // Recargar todos los insumos para obtener el nuevo
        
        mostrarNotificacion('Insumo creado correctamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function actualizarInsumo(id, formData) {
    try {
        const response = await fetch(`${API_URL}/insumos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) throw new Error('Error al actualizar insumo');
        
        // Actualizar insumo en la lista
        const index = insumos.findIndex(i => i.id == id);
        if (index !== -1) {
            insumos[index] = {
                ...insumos[index],
                ...formData
            };
        }
        
        renderizarInsumos(insumos);
        
        mostrarNotificacion('Insumo actualizado correctamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function obtenerInsumoPorId(id) {
    // Primero buscamos en la lista local
    let insumo = insumos.find(i => i.id == id);
    
    // Si no lo encontramos, lo buscamos en el servidor
    if (!insumo) {
        try {
            const response = await fetch(`${API_URL}/insumos/${id}`);
            if (!response.ok) throw new Error('Error al obtener insumo');
            
            insumo = await response.json();
            
            // Actualizamos la lista local
            const index = insumos.findIndex(i => i.id == id);
            if (index !== -1) {
                insumos[index] = insumo;
            } else {
                insumos.push(insumo);
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarNotificacion('Error al obtener datos del insumo', 'error');
            return null;
        }
    }
    
    return insumo;
}

// Funciones para exportar datos
function exportarExcel() {
    // Importar la librería XLSX
    const XLSX = window.XLSX;

    try {
        // Preparar datos para exportar
        const datosExportar = insumos.map(insumo => ({
            ID: insumo.id,
            Nombre: insumo.nombre,
            'Valor Unitario': `$${parseFloat(insumo.valor_unitario || 0).toFixed(2)}`,
            Cantidad: insumo.cantidad,
            Unidad: formatearUnidad(insumo.unidad),
            Descripción: insumo.descripcion || '-',
            'Fecha Registro': formatearFecha(insumo.fecha_registro)
        }));
        
        // Crear libro de trabajo
        const libro = XLSX.utils.book_new();
        const hoja = XLSX.utils.json_to_sheet(datosExportar);
        
        // Añadir hoja al libro
        XLSX.utils.book_append_sheet(libro, hoja, 'Insumos');
        
        // Generar archivo y descargar
        XLSX.writeFile(libro, 'insumos.xlsx');
        
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
        doc.text('Listado de Insumos', 14, 22);
        
        // Fecha
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);
        
        // Preparar datos para la tabla
        const datosTabla = insumos.map(insumo => [
            insumo.id,
            insumo.nombre,
            `$${parseFloat(insumo.valor_unitario || 0).toFixed(2)}`,
            insumo.cantidad,
            formatearUnidad(insumo.unidad),
            formatearFecha(insumo.fecha_registro)
        ]);
        
        // Crear tabla
        doc.autoTable({
            head: [['ID', 'Nombre', 'Valor Unitario', 'Cantidad', 'Unidad', 'Fecha Registro']],
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
        doc.save('insumos.pdf');
        
        mostrarNotificacion('Datos exportados a PDF correctamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al exportar a PDF', 'error');
    }
}

// Funciones de UI
function abrirModalNuevoInsumo() {
    // Limpiar formulario
    insumoForm.reset();
    insumoId.value = '';
    insumoActual = null;
    
    // Cambiar título del modal
    document.getElementById('modalTitle').textContent = 'Nuevo Insumo';
    
    toggleModal(insumoModal, true);
}

function cerrarModal() {
    toggleModal(insumoModal, false);
    insumoForm.reset();
    insumoActual = null;
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

function formatearUnidad(unidad) {
    if (!unidad) return '-';
    
    const unidades = {
        'kilo': 'Kilo',
        'gramos': 'Gramos',
        'pascal': 'Pascal',
        'metros': 'Metros'
    };
    
    return unidades[unidad] || unidad;
}