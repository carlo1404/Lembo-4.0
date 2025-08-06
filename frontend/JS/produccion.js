// Global variables
let producciones = [];
let usuarios = [];
let cultivos = [];
let ciclos = [];
let sensores = [];
let insumos = [];
let currentProduccionId = null;
let charts = {};

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    initApp();

    // Event listeners
    document.getElementById('btnNuevaProduccion').addEventListener('click', showCreateModal);
    document.getElementById('closeModal').addEventListener('click', hideModal);
    document.getElementById('cancelarForm').addEventListener('click', hideModal);
    document.getElementById('closeDetalleModal').addEventListener('click', hideDetalleModal);
    document.getElementById('closeToast').addEventListener('click', hideToast);
    document.getElementById('produccionForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('searchProduccion').addEventListener('input', filterProducciones);
    document.getElementById('btnExportExcel').addEventListener('click', exportToExcel);
    document.getElementById('btnExportPDF').addEventListener('click', exportToPDF);

    // Dropdown toggle
    const dropdownTrigger = document.querySelector('.dropdown__trigger');
    dropdownTrigger.addEventListener('click', () => {
        document.querySelector('.dropdown__menu').classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            document.querySelector('.dropdown__menu').classList.remove('show');
        }
    });

    // Tab navigation
    const tabButtons = document.querySelectorAll('.tabs__button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and panels
            document.querySelectorAll('.tabs__button').forEach(btn => {
                btn.classList.remove('tabs__button--active');
            });
            document.querySelectorAll('.tabs__panel').forEach(panel => {
                panel.classList.remove('tabs__panel--active');
            });
            
            // Add active class to current button and panel
            button.classList.add('tabs__button--active');
            document.querySelector(`.tabs__panel[data-tab="${tabId}"]`).classList.add('tabs__panel--active');
        });
    });

    // Sensor filter change
    document.getElementById('sensorFilter').addEventListener('change', filterSensorData);
    
    // Make investment and goal fields read-only
    const inversionField = document.getElementById('inversion');
    const metaField = document.getElementById('meta');
    
    if (inversionField) {
        inversionField.readOnly = true;
        inversionField.classList.add('read-only-field');
    }
    
    if (metaField) {
        metaField.readOnly = true;
        metaField.classList.add('read-only-field');
    }
    
    // Add info text about automatic calculation
    const inversionGroup = inversionField.closest('.form__group');
    const metaGroup = metaField.closest('.form__group');
    
    const inversionInfo = document.createElement('small');
    inversionInfo.className = 'form__info';
    inversionInfo.textContent = 'Calculado automáticamente según insumos seleccionados';
    inversionGroup.appendChild(inversionInfo);
    
    const metaInfo = document.createElement('small');
    metaInfo.className = 'form__info';
    metaInfo.textContent = 'Calculado automáticamente como 130% de la inversión';
    metaGroup.appendChild(metaInfo);
});

// Initialize the application
async function initApp() {
    try {
        // Fetch all necessary data
        await Promise.all([
            fetchProducciones(),
            fetchUsuarios(),
            fetchCultivos(),
            fetchCiclos(),
            fetchSensores(),
            fetchInsumos()
        ]);

        // Render the dashboard
        renderDashboard();
    } catch (error) {
        console.error('Error initializing app:', error);
        showToast('Error al cargar los datos. Por favor, recarga la página.', 'error');
    }
}

// Fetch functions
async function fetchProducciones() {
    try {
        const response = await fetch('http://localhost:3000/producciones');
        producciones = await response.json();
        renderProduccionesTable();
        updateStats();
    } catch (error) {
        console.error('Error fetching producciones:', error);
        throw error;
    }
}

async function fetchUsuarios() {
    try {
        const response = await fetch('http://localhost:3000/usuarios');
        usuarios = await response.json();
        populateUsuariosSelect();
    } catch (error) {
        console.error('Error fetching usuarios:', error);
        throw error;
    }
}

async function fetchCultivos() {
    try {
        const response = await fetch('http://localhost:3000/cultivos');
        cultivos = await response.json();
        populateCultivosSelect();
    } catch (error) {
        console.error('Error fetching cultivos:', error);
        throw error;
    }
}

async function fetchCiclos() {
    try {
        const response = await fetch('http://localhost:3000/ciclos');
        ciclos = await response.json();
        populateCiclosSelect();
    } catch (error) {
        console.error('Error fetching ciclos:', error);
        throw error;
    }
}

async function fetchSensores() {
    try {
        const response = await fetch('http://localhost:3000/sensores');
        sensores = await response.json();
        populateSensoresCheckboxes();
    } catch (error) {
        console.error('Error fetching sensores:', error);
        throw error;
    }
}

async function fetchInsumos() {
    try {
        const response = await fetch('http://localhost:3000/insumos');
        insumos = await response.json();
        populateInsumosCheckboxes();
    } catch (error) {
        console.error('Error fetching insumos:', error);
        throw error;
    }
}

// Render functions
function renderDashboard() {
    renderProduccionesTable();
    renderCharts();
    updateStats();
}

function renderProduccionesTable() {
    const tableBody = document.getElementById('produccionesTableBody');
    tableBody.innerHTML = '';
    producciones.forEach(produccion => {
        const row = document.createElement('tr');
        // Format dates
        const fechaInicio = new Date(produccion.fecha_inicio).toLocaleDateString();
        const fechaFin = produccion.fecha_fin ? new Date(produccion.fecha_fin).toLocaleDateString() : '-';
        
        // Create badge based on estado
        let badgeClass = '';
        switch(produccion.estado) {
            case 'activo':
                badgeClass = 'badge--active';
                break;
            case 'inactivo':
                badgeClass = 'badge--inactive';
                break;
            case 'completado':
                badgeClass = 'badge--completed';
                break;
            default:
                badgeClass = 'badge--inactive';
        }
        
        row.innerHTML = `
            <td>${produccion.id}</td>
            <td>${produccion.nombre}</td>
            <td>${fechaInicio}</td>
            <td>${fechaFin}</td>
            <td><span class="badge ${badgeClass}">${produccion.estado}</span></td>
            <td>$${produccion.inversion}</td>
            <td class="table__actions">
                <button class="button button--icon button--secondary" onclick="viewProduccion('${produccion.id}')">
                    <i class='bx bx-show'></i>
                </button>
                <button class="button button--icon button--secondary" onclick="editProduccion('${produccion.id}')">
                    <i class='bx bx-edit'></i>
                </button>
                <button class="button button--icon button--danger" onclick="deleteProduccion('${produccion.id}')">
                    <i class='bx bx-trash'></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

function renderCharts() {
    renderEstadoChart();
    renderInversionChart();
}

function renderEstadoChart() {
    const ctx = document.getElementById('estadoProduccionesChart').getContext('2d');
    
    // Count producciones by estado
    const estadoCount = {
        activo: 0,
        inactivo: 0,
        completado: 0
    };
    
    producciones.forEach(produccion => {
        if (estadoCount.hasOwnProperty(produccion.estado)) {
            estadoCount[produccion.estado]++;
        }
    });
    
    // Destroy existing chart if it exists
    if (charts.estadoChart) {
        charts.estadoChart.destroy();
    }
    
    // Create new chart
    charts.estadoChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Activo', 'Inactivo', 'Completado'],
            datasets: [{
                data: [estadoCount.activo, estadoCount.inactivo, estadoCount.completado],
                backgroundColor: [
                    '#93D074', // green-500
                    '#C5C5C5', // gray-40
                    '#50E5F9'  // secondary-blue
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            cutout: '70%'
        }
    });
}

function renderInversionChart() {
    const ctx = document.getElementById('inversionChart').getContext('2d');
    
    // Get top 5 producciones by inversion
    const topProducciones = [...producciones]
        .sort((a, b) => b.inversion - a.inversion)
        .slice(0, 5);
    
    // Destroy existing chart if it exists
    if (charts.inversionChart) {
        charts.inversionChart.destroy();
    }
    
    // Create new chart
    charts.inversionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topProducciones.map(p => p.nombre),
            datasets: [{
                label: 'Inversión ($)',
                data: topProducciones.map(p => p.inversion),
                backgroundColor: '#39A900', // green-950
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                }
            }
        }
    });
}

function updateStats() {
    // Total producciones
    document.getElementById('totalProducciones').textContent = producciones.length;
    
    // Producciones activas
    const activas = producciones.filter(p => p.estado === 'activo').length;
    document.getElementById('produccionesActivas').textContent = activas;
    
    // Inversión total
    const inversionTotal = producciones.reduce((total, p) => {
        const inversionSinCeros = String(p.inversion).replace(/^0+/, '');
        const inversionNumerica = inversionSinCeros === '' ? 0 : Number(inversionSinCeros);
        return total + inversionNumerica;
    }, 0);
    document.getElementById('inversionTotal').textContent = '$' + inversionTotal;
}

// Form functions
function populateUsuariosSelect() {
    const select = document.getElementById('responsable_id');
    select.innerHTML = '<option value="">Seleccionar responsable</option>';
    
    usuarios.forEach(usuario => {
        const option = document.createElement('option');
        option.value = usuario.id;
        option.textContent = `${usuario.nombre} ${usuario.apellido}`;
        select.appendChild(option);
    });
}

function populateCultivosSelect() {
    const select = document.getElementById('cultivo_id');
    select.innerHTML = '<option value="">Seleccionar cultivo</option>';
    
    cultivos.forEach(cultivo => {
        const option = document.createElement('option');
        option.value = cultivo.id;
        option.textContent = cultivo.nombre;
        select.appendChild(option);
    });
}

function populateCiclosSelect() {
    const select = document.getElementById('ciclo_id');
    select.innerHTML = '<option value="">Seleccionar ciclo</option>';
    
    ciclos.forEach(ciclo => {
        const option = document.createElement('option');
        option.value = ciclo.id;
        option.textContent = ciclo.nombre;
        select.appendChild(option);
    });
}

function populateSensoresCheckboxes() {
    const container = document.getElementById('sensoresContainer');
    container.innerHTML = '';
    
    sensores.forEach(sensor => {
        const div = document.createElement('div');
        div.className = 'form__checkbox-item';
        
        div.innerHTML = `
            <input type="checkbox" id="sensor_${sensor.id}" name="sensores" value="${sensor.id}" class="sensor-checkbox">
            <label for="sensor_${sensor.id}">${sensor.nombre} (${sensor.tipo_sensor})</label>
        `;
        
        container.appendChild(div);
    });
    
    // Add event listener to limit selection to 3 sensors
    const checkboxes = document.querySelectorAll('.sensor-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checked = document.querySelectorAll('.sensor-checkbox:checked');
            if (checked.length > 3) {
                this.checked = false;
                showToast('Solo se permiten máximo 3 sensores por producción', 'warning');
            }
        });
    });
}

// Function to calculate investment based on selected inputs
function calculateInvestment() {
    const selectedInsumos = Array.from(document.querySelectorAll('input[name="insumos"]:checked'))
        .map(el => el.value);
    
    let totalInversion = 0;
    
    // Calculate total cost of selected inputs
    selectedInsumos.forEach(insumoId => {
        const insumo = insumos.find(i => i.id == insumoId);
        if (insumo) {
            totalInversion += insumo.valor_unitario * insumo.cantidad;
        }
    });
    
    // Round to 2 decimal places
    return parseFloat(totalInversion.toFixed(2));
}

// Function to calculate meta (goal) based on investment
function calculateMeta(inversion) {
    // Goal is 30% more than investment
    return parseFloat((inversion * 1.3).toFixed(2));
}

// Add event listeners to insumo checkboxes to recalculate values
function setupInsumoListeners() {
    document.querySelectorAll('input[name="insumos"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateCalculatedValues);
    });
}

// Update the investment and goal fields
function updateCalculatedValues() {
    const inversion = calculateInvestment();
    const meta = calculateMeta(inversion);
    
    const inversionField = document.getElementById('inversion');
    const metaField = document.getElementById('meta');
    
    // Update values with animation
    animateValue(inversionField, parseFloat(inversionField.value) || 0, inversion, 500);
    animateValue(metaField, parseFloat(metaField.value) || 0, meta, 500);
    
    // Highlight fields to show they've been updated
    highlightField(inversionField);
    highlightField(metaField);
}

// Animate value change for better UX
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = progress * (end - start) + start;
        element.value = value.toFixed(2);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            element.value = end.toFixed(2);
        }
    };
    window.requestAnimationFrame(step);
}

// Highlight a field to show it's been updated
function highlightField(element) {
    element.classList.add('field-updated');
    setTimeout(() => {
        element.classList.remove('field-updated');
    }, 1000);
}

function populateInsumosCheckboxes() {
    const container = document.getElementById('insumosContainer');
    container.innerHTML = '';
    
    // Add a summary element to show total cost
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'insumos-summary';
    summaryDiv.innerHTML = `
        <div class="insumos-summary__header">
            <h4>Resumen de costos</h4>
        </div>
        <div class="insumos-summary__content" id="insumosSummary">
            <p>Seleccione insumos para ver el costo total</p>
        </div>
    `;
    container.appendChild(summaryDiv);
    insumos.forEach(insumo => {
        const div = document.createElement('div');
        div.className = 'form__checkbox-item';
        
        const costoTotal = insumo.valor_unitario;
        div.innerHTML = `
            <input type="checkbox" id="insumo_${insumo.id}" name="insumos" value="${insumo.id}" data-costo="${costoTotal}">
            <label for="insumo_${insumo.id}">
                ${insumo.nombre} (${insumo.cantidad} ${insumo.unidad}) - $${insumo.valor_unitario} c/u
                <span class="insumo-costo">Costo total: $${costoTotal}</span>
            </label>
        `;
        
        container.appendChild(div);
    });
    
    // Add event listeners to checkboxes
    setupInsumoListeners();
    
    // Add event listener to update summary when checkboxes change
    document.querySelectorAll('input[name="insumos"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateInsumosSummary);
    });
}

// Update the insumos summary
function updateInsumosSummary() {
    const summaryElement = document.getElementById('insumosSummary');
    const selectedInsumos = Array.from(document.querySelectorAll('input[name="insumos"]:checked'));
    
    if (selectedInsumos.length === 0) {
        summaryElement.innerHTML = '<p>Seleccione insumos para ver el costo total</p>';
        return;
    }
    
    let html = '<ul class="insumos-summary__list">';
    let totalCost = 0;
    
    selectedInsumos.forEach(checkbox => {
        const insumoId = checkbox.value;
        const insumo = insumos.find(i => i.id == insumoId);
        if (insumo) {
            const costo = insumo.valor_unitario * insumo.cantidad;
            totalCost += costo;
            html += `
                <li>
                    <span>${insumo.nombre}</span>
                    <span>$${costo.toFixed(2)}</span>
                </li>
            `;
        }
    });
    
    html += `
        <li class="insumos-summary__total">
            <span>Total inversión:</span>
            <span>$${totalCost.toFixed(2)}</span>
        </li>
        <li class="insumos-summary__meta">
            <span>Meta estimada (30%):</span>
            <span>$${(totalCost * 1.3).toFixed(2)}</span>
        </li>
    </ul>`;
    
    summaryElement.innerHTML = html;
}

function resetForm() {
    document.getElementById('produccionForm').reset();
    currentProduccionId = null;
    document.getElementById('modalTitle').textContent = 'Nueva Producción';
    
    // Uncheck all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Reset calculated values
    document.getElementById('inversion').value = "0.00";
    document.getElementById('meta').value = "0.00";
    
    // Reset insumos summary
    updateInsumosSummary();
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Recalculate investment and goal to ensure they're up to date
    updateCalculatedValues();
    
    // Get form data
    const formData = new FormData(e.target);
    const produccionData = {
        id: formData.get('id'),
        nombre: formData.get('nombre'),
        responsable_id: formData.get('responsable_id'),
        cultivo_id: formData.get('cultivo_id'),
        ciclo_id: formData.get('ciclo_id'),
        fecha_inicio: formData.get('fecha_inicio'),
        fecha_fin: formData.get('fecha_fin') || null,
        inversion: parseFloat(formData.get('inversion')) || 0,
        meta: parseFloat(formData.get('meta')) || 0,
        estado: formData.get('estado'),
        sensores: Array.from(document.querySelectorAll('input[name="sensores"]:checked')).map(el => el.value),
        insumos: Array.from(document.querySelectorAll('input[name="insumos"]:checked')).map(el => el.value)
    };
    
    try {
        let response;
        
        if (currentProduccionId) {
            // Update existing produccion
            response = await fetch(`http://localhost:3000/producciones/${currentProduccionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produccionData)
            });
            
            if (response.ok) {
                showToast('Producción actualizada correctamente');
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Error al actualizar la producción');
            }
        } else {
            // Create new produccion
            response = await fetch('http://localhost:3000/producciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produccionData)
            });
            
            if (response.ok) {
                showToast('Producción creada correctamente');
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Error al crear la producción');
            }
        }
        
        // Refresh data and hide modal
        await fetchProducciones();
        renderDashboard();
        hideModal();
    } catch (error) {
        console.error('Error saving produccion:', error);
        showToast(error.message, 'error');
    }
}

// CRUD operations
function showCreateModal() {
    resetForm();
    document.getElementById('produccionModal').classList.add('show');
    
    // Generate a unique ID for the new produccion
    const uniqueId = 'PROD-' + Date.now().toString().slice(-6);
    document.getElementById('id').value = uniqueId;
    
    // Initialize investment and goal to 0
    document.getElementById('inversion').value = "0.00";
    document.getElementById('meta').value = "0.00";
}

async function editProduccion(id) {
    try {
        resetForm();
        currentProduccionId = id;
        document.getElementById('modalTitle').textContent = 'Editar Producción';
        
        // Fetch produccion details
        const response = await fetch(`http://localhost:3000/producciones/${id}`);
        const produccion = await response.json();
        
        // Fill form with produccion data
        document.getElementById('id').value = produccion.id;
        document.getElementById('nombre').value = produccion.nombre;
        document.getElementById('responsable_id').value = produccion.responsable_id;
        document.getElementById('cultivo_id').value = produccion.cultivo_id;
        document.getElementById('ciclo_id').value = produccion.ciclo_id;
        document.getElementById('estado').value = produccion.estado;
        document.getElementById('fecha_inicio').value = new Date(produccion.fecha_inicio).toISOString().split('T')[0];
        
        if (produccion.fecha_fin) {
            document.getElementById('fecha_fin').value = new Date(produccion.fecha_fin).toISOString().split('T')[0];
        }
        
        // Check insumos first, then calculate values
        produccion.insumos.forEach(insumo => {
            const checkbox = document.getElementById(`insumo_${insumo.id}`);
            if (checkbox) checkbox.checked = true;
        });
        
        // Update insumos summary
        updateInsumosSummary();
        
        // Calculate investment and goal based on selected inputs
        updateCalculatedValues();
        
        // Check sensores
        produccion.sensores.forEach(sensor => {
            const checkbox = document.getElementById(`sensor_${sensor.id}`);
            if (checkbox) checkbox.checked = true;
        });
        
        // Show modal
        document.getElementById('produccionModal').classList.add('show');
    } catch (error) {
        console.error('Error editing produccion:', error);
        showToast('Error al cargar los datos de la producción', 'error');
    }
}

async function deleteProduccion(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta producción? Esta acción no se puede deshacer.')) {
        try {
            const response = await fetch(`http://localhost:3000/producciones/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                showToast('Producción eliminada correctamente');
                await fetchProducciones();
                renderDashboard();
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Error al eliminar la producción');
            }
        } catch (error) {
            console.error('Error deleting produccion:', error);
            showToast(error.message, 'error');
        }
    }
}

async function viewProduccion(id) {
    try {
        // Fetch produccion details
        const response = await fetch(`http://localhost:3000/producciones/${id}`);
        const produccion = await response.json();
        console.log(produccion);
        // Fill detalle modal with produccion data
        document.getElementById('detalle-id').textContent = produccion.id;
        document.getElementById('detalle-nombre').textContent = produccion.nombre;
        
        // Find responsable name
        const responsable = usuarios.find(u => u.id === produccion.responsable_id);
        document.getElementById('detalle-responsable').textContent = responsable ? `${responsable.nombre} ${responsable.apellido}` : '-';
        
        // Find cultivo name
        const cultivo = cultivos.find(c => c.id === produccion.cultivo_id);
        document.getElementById('detalle-cultivo').textContent = cultivo ? cultivo.nombre : '-';
        
        // Find ciclo name
        const ciclo = ciclos.find(c => c.id === produccion.ciclo_id);
        document.getElementById('detalle-ciclo').textContent = ciclo ? ciclo.nombre : '-';
        
        // Estado with proper formatting
        const estadoElement = document.getElementById('detalle-estado');
        estadoElement.textContent = produccion.estado;
        estadoElement.className = '';
        estadoElement.classList.add(`badge`, `badge--${produccion.estado}`);
        
        // Format dates
        document.getElementById('detalle-fecha-inicio').textContent = new Date(produccion.fecha_inicio).toLocaleDateString();
        document.getElementById('detalle-fecha-fin').textContent = produccion.fecha_fin ? new Date(produccion.fecha_fin).toLocaleDateString() : '-';
        
        // Format numbers
        document.getElementById('detalle-inversion').textContent = `$${produccion.inversion}`;
        document.getElementById('detalle-meta').textContent = `$${produccion.meta}`;
        
        // Render sensor list
        renderSensorList(produccion);
        
        // Render insumos list
        renderInsumosList(produccion);
        
        // Render sensor chart
        renderSensorChart(produccion);
        
        // Render insumos chart
        renderInsumosChart(produccion);
        
        // Show modal
        document.getElementById('detalleModal').classList.add('show');
        
        // Reset to first tab
        document.querySelector('.tabs__button[data-tab="info"]').click();
    } catch (error) {
        console.error('Error viewing produccion:', error);
        showToast('Error al cargar los detalles de la producción', 'error');
    }
}

function renderSensorList(produccion) {
    const sensorList = document.getElementById('sensorList');
    sensorList.innerHTML = '';
    
    // Also populate the sensor filter dropdown
    const sensorFilter = document.getElementById('sensorFilter');
    sensorFilter.innerHTML = '<option value="all">Todos los sensores</option>';
    
    if (!produccion.sensores || produccion.sensores.length === 0) {
        sensorList.innerHTML = '<p class="empty-message">No hay sensores asociados a esta producción</p>';
        return;
    }
    
    produccion.sensores.forEach(sensor => {
        // Add to filter dropdown
        const option = document.createElement('option');
        option.value = sensor.id;
        option.textContent = sensor.nombre;
        sensorFilter.appendChild(option);
        
        // Create sensor card
        const card = document.createElement('div');
        card.className = 'sensor-card';
        card.innerHTML = `
            <div class="sensor-card__header">
                <div class="sensor-card__icon">
                    <i class='bx bx-chip'></i>
                </div>
                <h4 class="sensor-card__title">${sensor.nombre}</h4>
            </div>
            <div class="sensor-card__info">
                <div class="sensor-card__item">
                    <span class="sensor-card__label">Tipo:</span>
                    <span class="sensor-card__value">${sensor.tipo_sensor}</span>
                </div>
                <div class="sensor-card__item">
                    <span class="sensor-card__label">Unidad:</span>
                    <span class="sensor-card__value">${sensor.unidad_medida}</span>
                </div>
                <div class="sensor-card__item">
                    <span class="sensor-card__label">Estado:</span>
                    <span class="sensor-card__value">${sensor.estado}</span>
                </div>
                <div class="sensor-card__item">
                    <span class="sensor-card__label">Tiempo muestreo:</span>
                    <span class="sensor-card__value">${sensor.tiempo_muestreo}</span>
                </div>
            </div>
        `;
        
        sensorList.appendChild(card);
    });
}

function renderInsumosList(produccion) {
    const insumosList = document.getElementById('insumosList');
    insumosList.innerHTML = '';
    
    if (!produccion.insumos || produccion.insumos.length === 0) {
        insumosList.innerHTML = '<p class="empty-message">No hay insumos asociados a esta producción</p>';
        return;
    }
    
    // Add a summary of total costs
    const totalCost = produccion.insumos.reduce((sum, insumo) => {
        return sum + (insumo.valor_unitario * insumo.cantidad);
    }, 0);
    
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'insumos-summary';
    summaryDiv.innerHTML = `
        <div class="insumos-summary__header">
            <h4>Resumen de costos</h4>
        </div>
        <div class="insumos-summary__content">
            <ul class="insumos-summary__list">
                <li class="insumos-summary__total">
                    <span>Total inversión:</span>
                    <span>$${totalCost}</span>
                </li>
                <li class="insumos-summary__meta">
                    <span>Meta estimada (30%):</span>
                    <span>$${(totalCost * 1.3)}</span>
                </li>
            </ul>
        </div>
    `;
    insumosList.appendChild(summaryDiv);
    
    produccion.insumos.forEach(insumo => {
        const card = document.createElement('div');
        card.className = 'insumo-card';
        
        const costoTotal = (insumo.valor_unitario * insumo.cantidad).toFixed(2);
        card.innerHTML = `
            <div class="insumo-card__header">
                <div class="insumo-card__icon">
                    <i class='bx bx-package'></i>
                </div>
                <h4 class="insumo-card__title">${insumo.nombre}</h4>
            </div>
            <div class="insumo-card__info">
                <div class="insumo-card__item">
                    <span class="insumo-card__label">Valor unitario:</span>
                    <span class="insumo-card__value">$${insumo.valor_unitario}</span>
                </div>
                <div class="insumo-card__item">
                    <span class="insumo-card__label">Cantidad:</span>
                    <span class="insumo-card__value">${insumo.cantidad} ${insumo.unidad}</span>
                </div>
                <div class="insumo-card__item">
                    <span class="insumo-card__label">Costo total:</span>
                    <span class="insumo-card__value">$${costoTotal}</span>
                </div>
                <div class="insumo-card__item">
                    <span class="insumo-card__label">Descripción:</span>
                    <span class="insumo-card__value">${insumo.descripcion || '-'}</span>
                </div>
            </div>
        `;
        
        insumosList.appendChild(card);
    });
}

async function renderSensorChart(produccion) {
    try {
        // Fetch sensor readings for this produccion
        const response = await fetch(`http://localhost:3000/lecturas_sensor/produccion/${produccion.id}`);
        const lecturas = await response.json();
        
        if (lecturas.length === 0) {
            document.getElementById('sensoresChart').style.display = 'none';
            return;
        }
        
        document.getElementById('sensoresChart').style.display = 'block';
        
        // Group readings by sensor
        const lecturasBySensor = {};
        lecturas.forEach(lectura => {
            if (!lecturasBySensor[lectura.sensor_id]) {
                lecturasBySensor[lectura.sensor_id] = [];
            }
            lecturasBySensor[lectura.sensor_id].push(lectura);
        });
        
        // Prepare data for chart
        const datasets = [];
        const colors = ['#39A900', '#007832', '#50E5F9']; // green-950, secondary-green, secondary-blue
        
        let colorIndex = 0;
        for (const sensorId in lecturasBySensor) {
            const sensorData = lecturasBySensor[sensorId];
            const sensor = produccion.sensores.find(s => s.id == sensorId);
            
            if (!sensor) continue;
            
            // Sort by date
            sensorData.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
            
            datasets.push({
                label: `${sensor.nombre} (${sensor.unidad_medida})`,
                data: sensorData.map(l => l.valor),
                borderColor: colors[colorIndex % colors.length],
                backgroundColor: colors[colorIndex % colors.length] + '33', // Add transparency
                tension: 0.3,
                fill: true
            });
            
            colorIndex++;
        }
        
        // Get all unique dates
        const allDates = new Set();
        lecturas.forEach(l => allDates.add(new Date(l.fecha).toLocaleDateString()));
        const labels = Array.from(allDates).sort((a, b) => new Date(a) - new Date(b));
        
        // Destroy existing chart if it exists
        if (charts.sensoresChart) {
            charts.sensoresChart.destroy();
        }
        
        // Create chart
        const ctx = document.getElementById('sensoresChart').getContext('2d');
        charts.sensoresChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error rendering sensor chart:', error);
        document.getElementById('sensoresChart').style.display = 'none';
    }
}

async function renderInsumosChart(produccion) {
    try {
        // Fetch insumo usage for this produccion
        const response = await fetch(`http://localhost:3000/uso_insumos/${produccion.id}`);
        const usoInsumos = await response.json();
        
        if (usoInsumos.length === 0) {
            document.getElementById('insumosChart').style.display = 'none';
            return;
        }
        
        document.getElementById('insumosChart').style.display = 'block';
        
        // Group by insumo
        const insumoUsage = {};
        usoInsumos.forEach(uso => {
            if (!insumoUsage[uso.insumo_id]) {
                insumoUsage[uso.insumo_id] = 0;
            }
            insumoUsage[uso.insumo_id] += parseFloat(uso.cantidad);
        });
        
        // Prepare data for chart
        const labels = [];
        const data = [];
        const backgroundColors = [];
        const colors = ['#39A900', '#007832', '#50E5F9', '#FDC300', '#93D074', '#81C85D'];
        
        let colorIndex = 0;
        for (const insumoId in insumoUsage) {
            const insumo = produccion.insumos.find(i => i.id == insumoId);
            if (!insumo) continue;
            
            labels.push(insumo.nombre);
            data.push(insumoUsage[insumoId]);
            backgroundColors.push(colors[colorIndex % colors.length]);
            colorIndex++;
        }
        
        // Destroy existing chart if it exists
        if (charts.insumosChart) {
            charts.insumosChart.destroy();
        }
        
        // Create chart
        const ctx = document.getElementById('insumosChart').getContext('2d');
        charts.insumosChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const insumoId = Object.keys(insumoUsage)[context.dataIndex];
                                const insumo = produccion.insumos.find(i => i.id == insumoId);
                                return `${context.label}: ${context.raw} ${insumo ? insumo.unidad : ''}`;
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error rendering insumos chart:', error);
        document.getElementById('insumosChart').style.display = 'none';
    }
}

function filterSensorData() {
    const sensorId = document.getElementById('sensorFilter').value;
    
    // Update chart to show only selected sensor
    if (charts.sensoresChart) {
        if (sensorId === 'all') {
            charts.sensoresChart.data.datasets.forEach(dataset => {
                dataset.hidden = false;
            });
        } else {
            charts.sensoresChart.data.datasets.forEach(dataset => {
                if (dataset.label.includes(sensorId)) {
                    dataset.hidden = false;
                } else {
                    dataset.hidden = true;
                }
            });
        }
        charts.sensoresChart.update();
    }
}

// Filter functions
function filterProducciones() {
    const searchTerm = document.getElementById('searchProduccion').value.toLowerCase();
    const tableBody = document.getElementById('produccionesTableBody');
    const rows = tableBody.getElementsByTagName('tr');
    
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.getElementsByTagName('td');
        let found = false;
        
        for (let j = 0; j < cells.length - 1; j++) { // Skip actions column
            const cellText = cells[j].textContent.toLowerCase();
            if (cellText.includes(searchTerm)) {
                found = true;
                break;
            }
        }
        
        row.style.display = found ? '' : 'none';
    }
}


function exportToExcel() {
    try {
        // Create a new workbook
        const wb = XLSX.utils.book_new();
        
        // Create worksheet from table
        const table = document.querySelector('.table');
        const ws = XLSX.utils.table_to_sheet(table);
        
        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Producciones');
        
        // Generate Excel file and trigger download
        XLSX.writeFile(wb, 'Producciones.xlsx');
        
        showToast('Reporte exportado a Excel correctamente');
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        showToast('Error al exportar a Excel', 'error');
    }
}

function exportToPDF() {
    try {
        // Initialize jsPDF
        const doc = new jspdf.jsPDF();
        
        // Add title
        doc.setFontSize(18);
        doc.text('Reporte de Producciones', 14, 22);
        
        // Add date
        doc.setFontSize(11);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);
        
        // Add table
        const table = document.querySelector('.table');
        doc.autoTable({
            html: table,
            startY: 40,
            styles: { fontSize: 8 },
            columnStyles: { 6: { cellWidth: 30 } }, // Adjust action column width
            didDrawCell: (data) => {
                // Hide action buttons in PDF
                if (data.column.index === 6) {
                    return false;
                }
            }
        });
        
        // Add stats
        const totalProducciones = document.getElementById('totalProducciones').textContent;
        const produccionesActivas = document.getElementById('produccionesActivas').textContent;
        const inversionTotal = document.getElementById('inversionTotal').textContent;
        
        const finalY = doc.lastAutoTable.finalY || 40;
        doc.text(`Total Producciones: ${totalProducciones}`, 14, finalY + 10);
        doc.text(`Producciones Activas: ${produccionesActivas}`, 14, finalY + 20);
        doc.text(`Inversión Total: ${inversionTotal}`, 14, finalY + 30);
        
        // Save PDF
        doc.save('Producciones.pdf');
        
        showToast('Reporte exportado a PDF correctamente');
    } catch (error) {
        console.error('Error exporting to PDF:', error);
        showToast('Error al exportar a PDF', 'error');
    }
}

// UI helpers
function showModal() {
    document.getElementById('produccionModal').classList.add('show');
}

function hideModal() {
    document.getElementById('produccionModal').classList.remove('show');
    resetForm();
}

function hideDetalleModal() {
    document.getElementById('detalleModal').classList.remove('show');
    
    // Destroy charts to prevent memory leaks
    if (charts.sensoresChart) {
        charts.sensoresChart.destroy();
        charts.sensoresChart = null;
    }
    
    if (charts.insumosChart) {
        charts.insumosChart.destroy();
        charts.insumosChart = null;
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.querySelector('.toast__icon i');
    
    toastMessage.textContent = message;
    
    // Set icon based on type
    if (type === 'error') {
        toastIcon.className = 'bx bx-x-circle';
        toastIcon.style.color = 'var(--expired)';
    } else if (type === 'warning') {
        toastIcon.className = 'bx bx-error-circle';
        toastIcon.style.color = 'var(--warning)';
    } else {
        toastIcon.className = 'bx bx-check-circle';
        toastIcon.style.color = 'var(--green-950)';
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        hideToast();
    }, 3000);
}

function hideToast() {
    document.getElementById('toast').classList.remove('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
        document.querySelector('.dropdown__menu').classList.remove('show');
    }
});

// Window resize event to update charts
window.addEventListener('resize', () => {
    if (charts.estadoChart) charts.estadoChart.resize();
    if (charts.inversionChart) charts.inversionChart.resize();
    if (charts.sensoresChart) charts.sensoresChart.resize();
    if (charts.insumosChart) charts.insumosChart.resize();
});

// Add CSS for new features
const style = document.createElement('style');
style.textContent = `
.read-only-field {
    background-color: #f5f5f5;
    cursor: not-allowed;
}

.field-updated {
    animation: highlight 1s ease-in-out;
}

@keyframes highlight {
    0% { background-color: #39A90033; }
    100% { background-color: transparent; }
}

.form__info {
    display: block;
    color: #666;
    font-size: 0.8rem;
    margin-top: 4px;
}

.insumos-summary {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 16px;
}

.insumos-summary__header {
    margin-bottom: 8px;
}

.insumos-summary__header h4 {
    margin: 0;
    color: #333;
}

.insumos-summary__list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.insumos-summary__list li {
    display: flex;
    justify-content: space-between;
    padding: 4px 0;
    border-bottom: 1px solid #eee;
}

.insumos-summary__total, 
.insumos-summary__meta {
    font-weight: bold;
    padding-top: 8px;
}

.insumos-summary__meta {
    color: #39A900;
}

.insumo-costo {
    display: block;
    font-size: 0.85em;
    color: #666;
    margin-top: 2px;
}
`;
document.head.appendChild(style);

