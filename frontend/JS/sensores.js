// Variables globales
let sensores = [];
let sensorActual = null;
let accionConfirmacion = null;
const API_URL = 'http://localhost:3000';

// Elementos DOM
const sensoresTableBody = document.getElementById('sensoresTableBody');
const searchInput = document.getElementById('searchInput');
const loader = document.getElementById('loader');
const emptyState = document.getElementById('emptyState');

// Modales
const sensorModal = document.getElementById('sensorModal');
const detailsModal = document.getElementById('detailsModal');
const confirmModal = document.getElementById('confirmModal');
const toast = document.getElementById('toast');

// Botones
const btnNuevoSensor = document.getElementById('btnNuevoSensor');
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
const sensorForm = document.getElementById('sensorForm');
const sensorId = document.getElementById('sensorId');
const nombre = document.getElementById('nombre');
const tipo_sensor = document.getElementById('tipo_sensor');
const estado = document.getElementById('estado');
const unidad_medida = document.getElementById('unidad_medida');
const tiempo_muestreo = document.getElementById('tiempo_muestreo');
const imagen = document.getElementById('imagen');
const descripcion = document.getElementById('descripcion');

// Detalles
const detailsId = document.getElementById('detailsId');
const detailsNombre = document.getElementById('detailsNombre');
const detailsTipo = document.getElementById('detailsTipo');
const detailsEstado = document.getElementById('detailsEstado');
const detailsUnidadMedida = document.getElementById('detailsUnidadMedida');
const detailsTiempoMuestreo = document.getElementById('detailsTiempoMuestreo');
const detailsDescripcion = document.getElementById('detailsDescripcion');
const detailsImage = document.getElementById('detailsImage');
const detailsImageContainer = document.getElementById('detailsImageContainer');

// Confirmación
const confirmTitle = document.getElementById('confirmTitle');
const confirmMessage = document.getElementById('confirmMessage');

// Toast
const toastIcon = document.getElementById('toastIcon');
const toastMessage = document.getElementById('toastMessage');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarSensores();
    
    // Event listeners
    btnNuevoSensor.addEventListener('click', abrirModalNuevoSensor);
    btnExportarExcel.addEventListener('click', exportarExcel);
    btnExportarPDF.addEventListener('click', exportarPDF);
    closeModal.addEventListener('click', cerrarModal);
    closeDetailsModal.addEventListener('click', () => toggleModal(detailsModal, false));
    closeConfirmModal.addEventListener('click', () => toggleModal(confirmModal, false));
    cancelForm.addEventListener('click', cerrarModal);
    cancelConfirm.addEventListener('click', () => toggleModal(confirmModal, false));
    confirmAction.addEventListener('click', ejecutarAccionConfirmada);
    closeToast.addEventListener('click', () => toggleModal(toast, false));
    sensorForm.addEventListener('submit', guardarSensor);
    searchInput.addEventListener('input', filtrarSensores);
    
    // Soporte para responsive
    const toggleSidebar = document.createElement('button');
    toggleSidebar.className = 'button button--secondary sidebar-toggle';
    toggleSidebar.innerHTML = '<i class="bx bx-menu"></i>';
    document.querySelector('.main__header').prepend(toggleSidebar);
    
    toggleSidebar.addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('show');
    });
});

// Funciones para gestionar sensores
async function cargarSensores() {
    mostrarLoader(true);
    try {
        const response = await fetch(`${API_URL}/sensores`);
        if (!response.ok) throw new Error('Error al cargar sensores');
        
        sensores = await response.json();
        renderizarSensores(sensores);
    } catch (error) {
        console.error('Error:', error);
        // Si no hay conexión con el servidor, cargar datos de ejemplo
        cargarDatosEjemplo();
        mostrarNotificacion('No se pudo conectar con el servidor. Mostrando datos de ejemplo.', 'warning');
    } finally {
        mostrarLoader(false);
    }
}

// Función para cargar datos de ejemplo (solo para demostración)
function cargarDatosEjemplo() {
    sensores = [
        {
            id: 1,
            nombre: 'Sensor Temp 01',
            tipo_sensor: 'temperatura',
            estado: 'habilitado',
            unidad_medida: '°C',
            tiempo_muestreo: 60,
            imagen: '/IMG/sensor-temperatura.jpg',
            descripcion: 'Sensor de temperatura para invernadero A'
        },
        {
            id: 2,
            nombre: 'Sensor Hum 01',
            tipo_sensor: 'humedad',
            estado: 'habilitado',
            unidad_medida: '%',
            tiempo_muestreo: 120,
            imagen: '/IMG/sensor-humedad.jpg',
            descripcion: 'Sensor de humedad para invernadero A'
        },
        {
            id: 3,
            nombre: 'Sensor Luz 01',
            tipo_sensor: 'luz',
            estado: 'deshabilitado',
            unidad_medida: 'lux',
            tiempo_muestreo: 300,
            imagen: '/IMG/sensor-luz.jpg',
            descripcion: 'Sensor de luz para exterior'
        }
    ];
    renderizarSensores(sensores);
}

function renderizarSensores(listaSensores) {
    sensoresTableBody.innerHTML = '';
    
    if (listaSensores.length === 0) {
        mostrarEstadoVacio(true);
        return;
    }
    
    mostrarEstadoVacio(false);
    
    listaSensores.forEach(sensor => {
        const row = document.createElement('tr');
        
        // Formatear tipo de sensor para mostrar
        const tipoFormateado = formatearTipoSensor(sensor.tipo_sensor);
        
        // Formatear tiempo de muestreo
        const tiempoMuestreo = sensor.tiempo_muestreo ? `${sensor.tiempo_muestreo} seg` : 'No definido';
        
        row.innerHTML = `
            <td>${sensor.id}</td>
            <td>${sensor.nombre}</td>
            <td>${tipoFormateado}</td>
            <td>
                <span class="status ${sensor.estado === 'habilitado' ? 'status--active' : 'status--inactive'}">
                    ${sensor.estado === 'habilitado' ? 'Habilitado' : 'Deshabilitado'}
                </span>
            </td>
            <td>${sensor.unidad_medida || 'No definida'}</td>
            <td>${tiempoMuestreo}</td>
            <td class="table__actions">
                <button class="table__action-btn table__action-btn--view" data-id="${sensor.id}" title="Ver detalles">
                    <i class='bx bx-show'></i>
                </button>
                <button class="table__action-btn table__action-btn--edit" data-id="${sensor.id}" title="Editar">
                    <i class='bx bx-edit'></i>
                </button>
                <button class="table__action-btn table__action-btn--delete" data-id="${sensor.id}" title="Eliminar">
                    <i class='bx bx-trash'></i>
                </button>
                ${sensor.estado === 'habilitado' 
                    ? `<button class="table__action-btn table__action-btn--disable" data-id="${sensor.id}" title="Deshabilitar">
                        <i class='bx bx-power-off'></i>
                      </button>`
                    : `<button class="table__action-btn table__action-btn--enable" data-id="${sensor.id}" title="Habilitar">
                        <i class='bx bx-power-off'></i>
                      </button>`
                }
            </td>
        `;
        
        sensoresTableBody.appendChild(row);
    });
    
    // Agregar event listeners a los botones de acción
    document.querySelectorAll('.table__action-btn--view').forEach(btn => {
        btn.addEventListener('click', () => verDetallesSensor(btn.dataset.id));
    });
    
    document.querySelectorAll('.table__action-btn--edit').forEach(btn => {
        btn.addEventListener('click', () => editarSensor(btn.dataset.id));
    });
    
    document.querySelectorAll('.table__action-btn--delete').forEach(btn => {
        btn.addEventListener('click', () => confirmarEliminarSensor(btn.dataset.id));
    });
    
    document.querySelectorAll('.table__action-btn--disable').forEach(btn => {
        btn.addEventListener('click', () => cambiarEstadoSensor(btn.dataset.id, 'deshabilitado'));
    });
    
    document.querySelectorAll('.table__action-btn--enable').forEach(btn => {
        btn.addEventListener('click', () => cambiarEstadoSensor(btn.dataset.id, 'habilitado'));
    });
}

function formatearTipoSensor(tipo) {
    const tipos = {
        'luz': 'Luz',
        'movimiento': 'Movimiento',
        'temperatura': 'Temperatura',
        'humedad': 'Humedad'
    };
    
    return tipos[tipo] || tipo;
}

function filtrarSensores() {
    const termino = searchInput.value.toLowerCase().trim();
    
    if (!termino) {
        renderizarSensores(sensores);
        return;
    }
    
    const sensoresFiltrados = sensores.filter(sensor => 
        sensor.nombre.toLowerCase().includes(termino) || 
        sensor.tipo_sensor.toLowerCase().includes(termino) ||
        sensor.estado.toLowerCase().includes(termino) ||
        (sensor.unidad_medida && sensor.unidad_medida.toLowerCase().includes(termino)) ||
        (sensor.descripcion && sensor.descripcion.toLowerCase().includes(termino)) ||
        sensor.id.toString().includes(termino)
    );
    
    renderizarSensores(sensoresFiltrados);
}

async function verDetallesSensor(id) {
    try {
        const sensor = await obtenerSensorPorId(id);
        if (!sensor) return;
        
        // Formatear tipo de sensor
        const tipoFormateado = formatearTipoSensor(sensor.tipo_sensor);
        
        // Formatear tiempo de muestreo
        const tiempoMuestreo = sensor.tiempo_muestreo 
            ? `${sensor.tiempo_muestreo} segundos` 
            : 'No definido';
        
        detailsId.textContent = sensor.id;
        detailsNombre.textContent = sensor.nombre;
        detailsTipo.textContent = tipoFormateado;
        detailsEstado.textContent = sensor.estado === 'habilitado' ? 'Habilitado' : 'Deshabilitado';
        detailsEstado.className = sensor.estado === 'habilitado' 
            ? 'user-details__role status--active' 
            : 'user-details__role status--inactive';
        detailsUnidadMedida.textContent = sensor.unidad_medida || 'No definida';
        detailsTiempoMuestreo.textContent = tiempoMuestreo;
        detailsDescripcion.textContent = sensor.descripcion || 'Sin descripción';
        
        // Mostrar imagen si existe
        if (sensor.imagen) {
            detailsImage.src = sensor.imagen;
            detailsImageContainer.style.display = 'block';
        } else {
            detailsImageContainer.style.display = 'none';
        }
        
        toggleModal(detailsModal, true);
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar detalles del sensor', 'error');
    }
}

async function editarSensor(id) {
    try {
        const sensor = await obtenerSensorPorId(id);
        if (!sensor) return;
        
        sensorActual = sensor;
        
        // Llenar formulario
        sensorId.value = sensor.id;
        nombre.value = sensor.nombre;
        tipo_sensor.value = sensor.tipo_sensor;
        estado.value = sensor.estado;
        unidad_medida.value = sensor.unidad_medida || '';
        tiempo_muestreo.value = sensor.tiempo_muestreo || '';
        imagen.value = sensor.imagen || '';
        descripcion.value = sensor.descripcion || '';
        
        // Cambiar título del modal
        document.getElementById('modalTitle').textContent = 'Editar Sensor';
        
        toggleModal(sensorModal, true);
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar datos del sensor', 'error');
    }
}

function confirmarEliminarSensor(id) {
    const sensor = sensores.find(s => s.id == id);
    if (!sensor) return;
    
    sensorActual = sensor;
    confirmTitle.textContent = 'Eliminar Sensor';
    confirmMessage.textContent = `¿Estás seguro de eliminar el sensor "${sensor.nombre}"?`;
    
    accionConfirmacion = 'eliminar';
    toggleModal(confirmModal, true);
}

function cambiarEstadoSensor(id, nuevoEstado) {
    const sensor = sensores.find(s => s.id == id);
    if (!sensor) return;
    
    sensorActual = sensor;
    confirmTitle.textContent = nuevoEstado === 'habilitado' ? 'Habilitar Sensor' : 'Deshabilitar Sensor';
    confirmMessage.textContent = `¿Estás seguro de ${nuevoEstado === 'habilitado' ? 'habilitar' : 'deshabilitar'} el sensor "${sensor.nombre}"?`;
    
    accionConfirmacion = 'cambiarEstado';
    sensorActual.nuevoEstado = nuevoEstado;
    toggleModal(confirmModal, true);
}

async function ejecutarAccionConfirmada() {
    if (!sensorActual || !accionConfirmacion) return;
    
    toggleModal(confirmModal, false);
    mostrarLoader(true);
    
    try {
        if (accionConfirmacion === 'eliminar') {
            await eliminarSensor(sensorActual.id);
        } else if (accionConfirmacion === 'cambiarEstado') {
            await actualizarEstadoSensor(sensorActual.id, sensorActual.nuevoEstado);
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion(`Error al ${accionConfirmacion} sensor`, 'error');
    } finally {
        mostrarLoader(false);
        sensorActual = null;
        accionConfirmacion = null;
    }
}

async function eliminarSensor(id) {
    try {
        const response = await fetch(`${API_URL}/sensores/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Error al eliminar sensor');
        
        // Actualizar lista de sensores
        sensores = sensores.filter(s => s.id != id);
        renderizarSensores(sensores);
        
        mostrarNotificacion('Sensor eliminado correctamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        
        // Si no hay conexión con el servidor, eliminar localmente
        sensores = sensores.filter(s => s.id != id);
        renderizarSensores(sensores);
        mostrarNotificacion('Sensor eliminado localmente', 'warning');
    }
}

async function actualizarEstadoSensor(id, nuevoEstado) {
    try {
        const sensor = sensores.find(s => s.id == id);
        if (!sensor) throw new Error('Sensor no encontrado');
        
        const datosActualizados = {
            ...sensor,
            estado: nuevoEstado
        };
        
        const response = await fetch(`${API_URL}/sensores/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosActualizados)
        });
        
        if (!response.ok) throw new Error('Error al actualizar estado del sensor');
        
        // Actualizar sensor en la lista
        const index = sensores.findIndex(s => s.id == id);
        if (index !== -1) {
            sensores[index].estado = nuevoEstado;
        }
        
        renderizarSensores(sensores);
        
        mostrarNotificacion(`Sensor ${nuevoEstado === 'habilitado' ? 'habilitado' : 'deshabilitado'} correctamente`, 'success');
    } catch (error) {
        console.error('Error:', error);
        
        // Si no hay conexión con el servidor, actualizar localmente
        const index = sensores.findIndex(s => s.id == id);
        if (index !== -1) {
            sensores[index].estado = nuevoEstado;
        }
        
        renderizarSensores(sensores);
        mostrarNotificacion(`Sensor ${nuevoEstado === 'habilitado' ? 'habilitado' : 'deshabilitado'} localmente`, 'warning');
    }
}

async function guardarSensor(e) {
    e.preventDefault();
    
    const formData = {
        nombre: nombre.value.trim(),
        tipo_sensor: tipo_sensor.value,
        estado: estado.value,
        unidad_medida: unidad_medida.value.trim() || null,
        tiempo_muestreo: tiempo_muestreo.value ? parseInt(tiempo_muestreo.value) : null,
        imagen: imagen.value.trim() || null,
        descripcion: descripcion.value.trim() || null
    };
    
    if (!formData.nombre || !formData.tipo_sensor || !formData.estado) {
        mostrarNotificacion('Por favor, completa los campos obligatorios', 'error');
        return;
    }
    
    mostrarLoader(true);
    cerrarModal();
    
    try {
        if (sensorId.value) {
            // Actualizar sensor existente
            await actualizarSensor(sensorId.value, formData);
        } else {
            // Crear nuevo sensor
            await crearSensor(formData);
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al guardar sensor', 'error');
    } finally {
        mostrarLoader(false);
    }
}

async function crearSensor(formData) {
    try {
        // Enviar datos al servidor para crear el sensor
        const response = await fetch(`${API_URL}/sensores`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) throw new Error('Error al crear sensor');
        
        // Obtener el sensor creado con su ID asignado
        const nuevoSensor = await response.json();
        
        // Actualizar lista de sensores
        await cargarSensores(); // Recargar todos los sensores para obtener el nuevo
        
        mostrarNotificacion('Sensor creado correctamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        
        // Si no hay conexión con el servidor, crear localmente
        const nuevoSensor = {
            ...formData,
            id: sensores.length > 0 ? Math.max(...sensores.map(s => s.id)) + 1 : 1
        };
        
        sensores.push(nuevoSensor);
        renderizarSensores(sensores);
        mostrarNotificacion('Sensor creado localmente', 'warning');
    }
}

async function actualizarSensor(id, formData) {
    try {
        const response = await fetch(`${API_URL}/sensores/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) throw new Error('Error al actualizar sensor');
        
        // Actualizar sensor en la lista
        const index = sensores.findIndex(s => s.id == id);
        if (index !== -1) {
            sensores[index] = {
                ...sensores[index],
                ...formData
            };
        }
        
        renderizarSensores(sensores);
        
        mostrarNotificacion('Sensor actualizado correctamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        
        // Si no hay conexión con el servidor, actualizar localmente
        const index = sensores.findIndex(s => s.id == id);
        if (index !== -1) {
            sensores[index] = {
                ...sensores[index],
                ...formData
            };
        }
        
        renderizarSensores(sensores);
        mostrarNotificacion('Sensor actualizado localmente', 'warning');
    }
}

async function obtenerSensorPorId(id) {
    // Primero buscamos en la lista local
    let sensor = sensores.find(s => s.id == id);
    
    // Si no lo encontramos, lo buscamos en el servidor
    if (!sensor) {
        try {
            const response = await fetch(`${API_URL}/sensores/${id}`);
            if (!response.ok) throw new Error('Error al obtener sensor');
            
            sensor = await response.json();
            
            // Actualizamos la lista local
            const index = sensores.findIndex(s => s.id == id);
            if (index !== -1) {
                sensores[index] = sensor;
            } else {
                sensores.push(sensor);
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarNotificacion('Error al obtener datos del sensor', 'error');
            return null;
        }
    }
    
    return sensor;
}

// Funciones para exportar datos
function exportarExcel() {
    // Importar la librería XLSX
    const XLSX = window.XLSX;

    try {
        // Preparar datos para exportar
        const datosExportar = sensores.map(sensor => {
            return {
                ID: sensor.id,
                Nombre: sensor.nombre,
                Tipo: formatearTipoSensor(sensor.tipo_sensor),
                Estado: sensor.estado === 'habilitado' ? 'Habilitado' : 'Deshabilitado',
                'Unidad de Medida': sensor.unidad_medida || 'No definida',
                'Tiempo de Muestreo': sensor.tiempo_muestreo ? `${sensor.tiempo_muestreo} seg` : 'No definido',
                Descripción: sensor.descripcion || ''
            };
        });
        
        // Crear libro de trabajo
        const libro = XLSX.utils.book_new();
        const hoja = XLSX.utils.json_to_sheet(datosExportar);
        
        // Añadir hoja al libro
        XLSX.utils.book_append_sheet(libro, hoja, 'Sensores');
        
        // Generar archivo y descargar
        XLSX.writeFile(libro, 'sensores.xlsx');
        
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
        doc.text('Listado de Sensores', 14, 22);
        
        // Fecha
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);
        
        // Preparar datos para la tabla
        const datosTabla = sensores.map(sensor => {
            return [
                sensor.id,
                sensor.nombre,
                formatearTipoSensor(sensor.tipo_sensor),
                sensor.estado === 'habilitado' ? 'Habilitado' : 'Deshabilitado',
                sensor.unidad_medida || 'No definida',
                sensor.tiempo_muestreo ? `${sensor.tiempo_muestreo} seg` : 'No definido'
            ];
        });
        
        // Crear tabla
        doc.autoTable({
            head: [['ID', 'Nombre', 'Tipo', 'Estado', 'Unidad Medida', 'Tiempo Muestreo']],
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
        doc.save('sensores.pdf');
        
        mostrarNotificacion('Datos exportados a PDF correctamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al exportar a PDF', 'error');
    }
}

// Funciones de UI
function abrirModalNuevoSensor() {
    // Limpiar formulario
    sensorForm.reset();
    sensorId.value = '';
    sensorActual = null;
    
    // Establecer valores por defecto
    estado.value = 'habilitado';
    
    // Cambiar título del modal
    document.getElementById('modalTitle').textContent = 'Nuevo Sensor';
    
    toggleModal(sensorModal, true);
}

function cerrarModal() {
    toggleModal(sensorModal, false);
    sensorForm.reset();
    sensorActual = null;
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