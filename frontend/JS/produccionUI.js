/* produccionUI.js */
// Funciones para el manejo de la interfaz y navegación

// Cambia la pestaña activa y actualiza las secciones de la UI
function switchTab(tabId) {
    currentTab = tabId;
    const tabs = document.querySelectorAll('.produccion__tab');
    tabs.forEach(tab => {
        if (tab.dataset.tab === tabId) {
            tab.classList.add('produccion__tab--active');
        } else {
            tab.classList.remove('produccion__tab--active');
        }
    });
    const sections = document.querySelectorAll('.produccion__section');
    sections.forEach(section => {
        if (section.id === tabId) {
            section.classList.add('produccion__section--active');
        } else {
            section.classList.remove('produccion__section--active');
        }
    });
    // Si es visualizar o editar y no hay producción seleccionada, se carga la primer producción
    if ((tabId === 'visualizar' || tabId === 'actualizar') && !selectedProduccion && produccionesData.length > 0) {
        selectedProduccion = produccionesData[0].id;
        if (typeof loadProduccionDetails === 'function') {
            loadProduccionDetails(selectedProduccion);
        }
    }
}

// Función para aplicar filtros (por cultivo y estado)
function applyFilters() {
    const filterCultivo = document.getElementById('filterCultivo');
    const filterEstado = document.getElementById('filterEstado');
    let filtered = produccionesData;
    if (filterCultivo && filterCultivo.value) {
        filtered = filtered.filter(p => p.cultivo === filterCultivo.value);
    }
    if (filterEstado && filterEstado.value) {
        filtered = filtered.filter(p => p.estado === filterEstado.value);
    }
    return filtered;
}

// Actualiza la tabla de producciones utilizando los filtros
function updateProduccionesTable() {
    const produccionesTableBody = document.getElementById('produccionesTableBody');
    if (!produccionesTableBody) return;
    const filteredData = applyFilters();
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (currentPage > totalPages) currentPage = totalPages || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);
    produccionesTableBody.innerHTML = '';
    
    currentData.forEach(produccion => {
        const cultivo = cultivosData.find(c => c.id === produccion.cultivo) || { nombre: 'Desconocido' };
        const ciclo = ciclosData.find(c => c.id === produccion.ciclo) || { nombre: 'Desconocido' };
        const row = document.createElement('tr');
        row.dataset.id = produccion.id;
        row.innerHTML = `
            <td>${produccion.id}</td>
            <td>${produccion.nombre}</td>
            <td>${cultivo.nombre}</td>
            <td>${ciclo.nombre.split(' ')[0]}</td>
            <td>${produccion.fechaInicio}</td>
            <td>${produccion.fechaFin}</td>
            <td><span class="produccion__status produccion__status--${produccion.estado}">${produccion.estado === 'activo' ? 'Activo' : 'Inactivo'}</span></td>
            <td>
                <button class="produccion__action produccion__action--view" data-id="${produccion.id}" title="Visualizar">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="produccion__action produccion__action--edit" data-id="${produccion.id}" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        produccionesTableBody.appendChild(row);
    });
    
    // Asocia eventos a los botones de acción
    document.querySelectorAll('.produccion__action--view').forEach(btn => {
        btn.addEventListener('click', (e) => {
            selectedProduccion = e.currentTarget.dataset.id;
            switchTab('visualizar');
            if (typeof loadProduccionDetails === 'function') {
                loadProduccionDetails(selectedProduccion);
            }
        });
    });
    document.querySelectorAll('.produccion__action--edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            selectedProduccion = e.currentTarget.dataset.id;
            switchTab('actualizar');
            if (typeof loadProduccionDetails === 'function') {
                // En modo editar se carga la información en el formulario
                loadProduccionDetails(selectedProduccion, true);
            }
        });
    });
}

// Actualiza la tabla de estados (para habilitar/deshabilitar)
function updateEstadoTable() {
    const estadoTableBody = document.getElementById('estadoTableBody');
    if (!estadoTableBody) return;
    estadoTableBody.innerHTML = '';
    
    produccionesData.forEach(produccion => {
        const row = document.createElement('tr');
        row.dataset.id = produccion.id;
        row.innerHTML = `
            <td><input type="checkbox" class="produccion__checkbox" data-id="${produccion.id}"></td>
            <td>${produccion.id}</td>
            <td>${produccion.nombre}</td>
            <td>${(cultivosData.find(c => c.id === produccion.cultivo) || { nombre: 'Desconocido' }).nombre}</td>
            <td><span class="produccion__status produccion__status--${produccion.estado}">${produccion.estado === 'activo' ? 'Activo' : 'Inactivo'}</span></td>
        `;
        estadoTableBody.appendChild(row);
    });
}

// Actualiza la tabla de reportes (similar a producciones)
function updateReportesTable() {
    const reportesTableBody = document.getElementById('reportesTableBody');
    if (!reportesTableBody) return;
    reportesTableBody.innerHTML = '';
    
    produccionesData.forEach(produccion => {
        const cultivo = cultivosData.find(c => c.id === produccion.cultivo) || { nombre: 'Desconocido' };
        const ciclo = ciclosData.find(c => c.id === produccion.ciclo) || { nombre: 'Desconocido' };
        const row = document.createElement('tr');
        row.dataset.id = produccion.id;
        row.innerHTML = `
            <td><input type="checkbox" class="produccion__checkbox" data-id="${produccion.id}"></td>
            <td>${produccion.id}</td>
            <td>${produccion.nombre}</td>
            <td>${cultivo.nombre}</td>
            <td>${ciclo.nombre.split(' ')[0]}</td>
            <td>${produccion.fechaInicio}</td>
            <td>${produccion.fechaFin}</td>
            <td><span class="produccion__status produccion__status--${produccion.estado}">${produccion.estado === 'activo' ? 'Activo' : 'Inactivo'}</span></td>
        `;
        reportesTableBody.appendChild(row);
    });
}

// Funciones para selección múltiple en las tablas
function toggleSelectAllProducciones(e) {
    const isChecked = e.target.checked;
    document.querySelectorAll('.produccion__checkbox[data-id]').forEach(checkbox => {
        checkbox.checked = isChecked;
    });
}

function toggleSelectAllReports(e) {
    const isChecked = e.target.checked;
    document.querySelectorAll('#reportesTableBody .produccion__checkbox').forEach(checkbox => {
        checkbox.checked = isChecked;
    });
}

// Función para habilitar o deshabilitar producciones seleccionadas
function cambiarEstadoProducciones(estado) {
    const checkboxes = document.querySelectorAll('.produccion__checkbox[data-id]');
    checkboxes.forEach(cb => {
       if(cb.checked){
         const prod = produccionesData.find(p => p.id === cb.dataset.id);
         if(prod) {
            prod.estado = estado ? 'activo' : 'inactivo';
         }
       }
    });
    updateProduccionesTable();
    updateEstadoTable();
    updateReportesTable();
}

// Función para filtrar y mostrar las lecturas de sensores
function filtrarLecturasSensores() {
    const sensorId = document.getElementById('sensorSeleccionado')?.value;
    const fechaInicio = document.getElementById('fechaInicioLectura')?.value;
    const fechaFin = document.getElementById('fechaFinLectura')?.value;
    
    if (!selectedProduccion || !sensorId) return;
    
    const produccion = produccionesData.find(p => p.id === selectedProduccion);
    if (!produccion || !produccion.lecturas) return;
    
    let lecturas = produccion.lecturas.filter(l => l.sensor === sensorId);
    
    if (fechaInicio) {
        const inicio = new Date(fechaInicio.split('/').reverse().join('-'));
        lecturas = lecturas.filter(l => new Date(l.fecha.split(' ')[0].split('/').reverse().join('-')) >= inicio);
    }
    
    if (fechaFin) {
        const fin = new Date(fechaFin.split('/').reverse().join('-'));
        lecturas = lecturas.filter(l => new Date(l.fecha.split(' ')[0].split('/').reverse().join('-')) <= fin);
    }
    
    // Actualizar tabla
    const lecturasTableBody = document.getElementById('lecturasTableBody');
    if (lecturasTableBody) {
        lecturasTableBody.innerHTML = lecturas.map(l => `
            <tr>
                <td>${l.fecha}</td>
                <td>${l.valor}</td>
                <td>${l.unidad}</td>
            </tr>
        `).join('');
    }
    
    // Actualizar gráfico
    updateSensorChart(lecturas);
}

// Función para actualizar el gráfico de sensor
function updateSensorChart(lecturas) {
    const ctx = document.getElementById('sensorChart');
    if (!ctx) return;

    // Destruir gráfico existente si hay uno
    if (window.sensorChart instanceof Chart) {
        window.sensorChart.destroy();
    }

    const labels = lecturas.map(l => l.fecha);
    const valores = lecturas.map(l => l.valor);
    const unidad = lecturas[0]?.unidad || '';

    window.sensorChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `Valores (${unidad})`,
                data: valores,
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: unidad
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Fecha/Hora'
                    }
                }
            }
        }
    });
}

// Registro de event listeners de la UI
function setupEventListeners() {
    const tabs = document.querySelectorAll('.produccion__tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
    
    const crearProduccionBtn = document.getElementById('crearProduccionBtn');
    if (crearProduccionBtn) {
        crearProduccionBtn.addEventListener('click', openCrearProduccionModal);
    }
    
    const modalCloseButtons = document.querySelectorAll('.modal__close, .modal__cancel');
    modalCloseButtons.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    const nombreProduccionInput = document.getElementById('nombreProduccion');
    if (nombreProduccionInput) {
        nombreProduccionInput.addEventListener('input', validateNombreProduccion);
    }
    
    const sensoresSelect = document.getElementById('sensores');
    if (sensoresSelect) {
        sensoresSelect.addEventListener('change', updateSelectedSensores);
    }
    
    const insumosSelect = document.getElementById('insumos');
    if (insumosSelect) {
        insumosSelect.addEventListener('change', updateSelectedInsumos);
    }
    
    const crearProduccionSubmit = document.getElementById('crearProduccion');
    if (crearProduccionSubmit) {
        crearProduccionSubmit.addEventListener('click', submitProduccionForm);
    }
    
    const guardarBorradorBtn = document.getElementById('guardarBorrador');
    if (guardarBorradorBtn) {
        guardarBorradorBtn.addEventListener('click', () => submitProduccionForm(true));
    }
    
    // Eventos para agregar nuevos elementos
    const agregarResponsable = document.getElementById('agregarResponsable');
    if (agregarResponsable) {
        agregarResponsable.addEventListener('click', () => openAgregarElementoModal('responsable'));
    }
    const agregarCultivo = document.getElementById('agregarCultivo');
    if (agregarCultivo) {
        agregarCultivo.addEventListener('click', () => openAgregarElementoModal('cultivo'));
    }
    const agregarCiclo = document.getElementById('agregarCiclo');
    if (agregarCiclo) {
        agregarCiclo.addEventListener('click', () => openAgregarElementoModal('ciclo'));
    }
    const agregarSensor = document.getElementById('agregarSensor');
    if (agregarSensor) {
        agregarSensor.addEventListener('click', () => openAgregarElementoModal('sensor'));
    }
    const agregarInsumo = document.getElementById('agregarInsumo');
    if (agregarInsumo) {
        agregarInsumo.addEventListener('click', () => openAgregarElementoModal('insumo'));
    }
    
    // Eventos de paginación
    const prevPageBtn = document.getElementById('prevPage');
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => changePage(-1));
    }
    const nextPageBtn = document.getElementById('nextPage');
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => changePage(1));
    }
    
    // Checkboxes para selección múltiple
    const selectAllProducciones = document.getElementById('selectAllProducciones');
    if (selectAllProducciones) {
        selectAllProducciones.addEventListener('change', toggleSelectAllProducciones);
    }
    const selectAllReports = document.getElementById('selectAllReports');
    if (selectAllReports) {
        selectAllReports.addEventListener('change', toggleSelectAllReports);
    }
    
    // Botones de cambio de estado
    const habilitarProduccionesBtn = document.getElementById('habilitarProducciones');
    if (habilitarProduccionesBtn) {
        habilitarProduccionesBtn.addEventListener('click', () => cambiarEstadoProducciones(true));
    }
    const deshabilitarProduccionesBtn = document.getElementById('deshabilitarProducciones');
    if (deshabilitarProduccionesBtn) {
        deshabilitarProduccionesBtn.addEventListener('click', () => cambiarEstadoProducciones(false));
    }
    const generarReporteBtn = document.getElementById('generarReporte');
    if (generarReporteBtn) {
        generarReporteBtn.addEventListener('click', generarReporte);
    }
    const filtrarLecturasBtn = document.getElementById('filtrarLecturas');
    if (filtrarLecturasBtn) {
        filtrarLecturasBtn.addEventListener('click', filtrarLecturasSensores);
    }
    
    // Eventos para los filtros
    const filterCultivo = document.getElementById('filterCultivo');
    if (filterCultivo) {
        filterCultivo.addEventListener('change', () => {
            currentPage = 1;
            updateProduccionesTable();
            updatePagination();
        });
    }
    const filterEstado = document.getElementById('filterEstado');
    if (filterEstado) {
        filterEstado.addEventListener('change', () => {
            currentPage = 1;
            updateProduccionesTable();
            updatePagination();
        });
    }
}

function changePage(delta) {
    const filteredData = applyFilters();
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const newPage = currentPage + delta;
    if (newPage > 0 && newPage <= totalPages) {
        currentPage = newPage;
        updateProduccionesTable();
        updatePagination();
    }
}

function updatePagination() {
    const filteredData = applyFilters();
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
    if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages;
    const paginationNumbers = document.getElementById('paginationNumbers');
    if (paginationNumbers) {
        paginationNumbers.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            pageBtn.className = 'produccion__pagination-number';
            if (i === currentPage) {
                pageBtn.classList.add('produccion__pagination-number--active');
            }
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                updateProduccionesTable();
                updatePagination();
            });
            paginationNumbers.appendChild(pageBtn);
        }
    }
}

// Registro global de carga inicial en DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    initDatePickers();
    setupEventListeners();
    loadInitialData();
    switchTab(currentTab);
});
