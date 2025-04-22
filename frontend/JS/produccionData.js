/* produccionData.js */
// Variables globales y configuración
let currentTab = 'listar';
let currentPage = 1;
const itemsPerPage = 10;
let produccionesData = [];
let usuariosData = [];
let cultivosData = [];
let ciclosData = [];
let sensoresData = [];
let insumosData = [];
let selectedProduccion = null;
// Variable para controlar el modo edición (cuando no es nulo, se actualizará una producción existente)
window.editingProductionId = null;

// Inicialización de componentes externos (por ejemplo, flatpickr)
function initDatePickers() {
    flatpickr('.produccion__input--date', {
        dateFormat: 'd/m/Y',
        allowInput: true,
        clickOpens: true,
        disableMobile: true,
        locale: flatpickr.l10ns.es
    });
}

// Funciones para cargar datos (simulados)
function loadUsuarios() {
    usuariosData = [
        { id: '1', nombre: 'Juan Pérez', rol: 'Administrador' },
        { id: '2', nombre: 'María García', rol: 'Agricultor' },
        { id: '3', nombre: 'Carlos López', rol: 'Técnico' }
    ];
    const responsableSelect = document.getElementById('responsable');
    if (responsableSelect) {
        responsableSelect.innerHTML = '';
        usuariosData.forEach(usuario => {
            const option = document.createElement('option');
            option.value = usuario.id;
            option.textContent = `${usuario.nombre} (${usuario.rol})`;
            responsableSelect.appendChild(option);
        });
    }
    // Actualizar select para uso de insumos (si existe)
    const responsableUsoSelect = document.getElementById('responsableUso');
    if (responsableUsoSelect) {
        responsableUsoSelect.innerHTML = '';
        usuariosData.forEach(usuario => {
            const option = document.createElement('option');
            option.value = usuario.id;
            option.textContent = `${usuario.nombre} (${usuario.rol})`;
            responsableUsoSelect.appendChild(option);
        });
    }
}

function loadCultivos() {
    cultivosData = [
        { id: '1', nombre: 'Verdura', description: 'Verduras frescas' },
        { id: '2', nombre: 'Hortaliza', description: 'Su consumo puede ser crudo' },
        { id: '3', nombre: 'Tubérculo', description: 'Las raíces' },
        { id: '4', nombre: 'Fruta', description: 'Frutas frescas' }
    ];
    const cultivoSelect = document.getElementById('cultivo');
    if (cultivoSelect) {
        cultivoSelect.innerHTML = '';
        cultivosData.forEach(cultivo => {
            const option = document.createElement('option');
            option.value = cultivo.id;
            option.textContent = cultivo.nombre;
            cultivoSelect.appendChild(option);
        });
    }
    // Filtro de cultivos
    const filterCultivo = document.getElementById('filterCultivo');
    if (filterCultivo) {
        filterCultivo.innerHTML = '<option value="">Todos</option>';
        cultivosData.forEach(cultivo => {
            const option = document.createElement('option');
            option.value = cultivo.id;
            option.textContent = cultivo.nombre;
            filterCultivo.appendChild(option);
        });
    }
}

function loadCiclos() {
    ciclosData = [
        { id: '1', nombre: 'Primavera-Verano', duracion: '6 meses' },
        { id: '2', nombre: 'Otoño-Invierno', duracion: '6 meses' },
        { id: '3', nombre: 'Anual', duracion: '12 meses' }
    ];
    const cicloCultivoSelect = document.getElementById('cicloCultivo');
    if (cicloCultivoSelect) {
        cicloCultivoSelect.innerHTML = '';
        ciclosData.forEach(ciclo => {
            const option = document.createElement('option');
            option.value = ciclo.id;
            option.textContent = `${ciclo.nombre} (${ciclo.duracion})`;
            cicloCultivoSelect.appendChild(option);
        });
    }
}

function loadSensores() {
    sensoresData = [
        { id: '1', nombre: 'Sensor de Humedad A1', tipo: 'Humedad del suelo', unidad: '%' },
        { id: '2', nombre: 'Sensor de Temperatura B2', tipo: 'Temperatura ambiente', unidad: '°C' },
        { id: '3', nombre: 'Sensor de Luz C3', tipo: 'Intensidad lumínica', unidad: 'lux' }
    ];
    const sensoresSelect = document.getElementById('sensores');
    if (sensoresSelect) {
        sensoresSelect.innerHTML = '';
        sensoresData.forEach(sensor => {
            const option = document.createElement('option');
            option.value = sensor.id;
            option.textContent = `${sensor.nombre} (${sensor.tipo})`;
            sensoresSelect.appendChild(option);
        });
    }
    // Para lecturas de sensores
    const sensorSeleccionadoSelect = document.getElementById('sensorSeleccionado');
    if (sensorSeleccionadoSelect) {
        sensorSeleccionadoSelect.innerHTML = '';
        sensoresData.forEach(sensor => {
            const option = document.createElement('option');
            option.value = sensor.id;
            option.textContent = sensor.nombre;
            sensorSeleccionadoSelect.appendChild(option);
        });
    }
}

function loadInsumos() {
    insumosData = [
        { id: '1', nombre: 'Fertilizante NPK', tipo: 'Fertilizante', unidad: 'kg', precio: 15.5 },
        { id: '2', nombre: 'Herbicida Total', tipo: 'Herbicida', unidad: 'L', precio: 22.8 },
        { id: '3', nombre: 'Semilla Maíz Híbrido', tipo: 'Semilla', unidad: 'kg', precio: 45.0 }
    ];
    const insumosSelect = document.getElementById('insumos');
    if (insumosSelect) {
        insumosSelect.innerHTML = '';
        insumosData.forEach(insumo => {
            const option = document.createElement('option');
            option.value = insumo.id;
            option.textContent = `${insumo.nombre} (${insumo.tipo}) - $${insumo.precio}/${insumo.unidad}`;
            insumosSelect.appendChild(option);
        });
    }
}

function loadProducciones() {
    produccionesData = [
        {
            id: 'PROD-09042025-0001',
            nombre: 'Maíz Primavera 2025',
            responsable: '1',
            cultivo: '1',
            ciclo: '1',
            sensores: ['1', '2'],
            insumos: ['1', '3'],
            fechaInicio: '09/04/2025',
            fechaFin: '09/10/2025',
            inversion: 1250.75,
            meta: 3500.00,
            estado: 'activo',
            lecturas: [
                { sensor: '1', fecha: '10/04/2025 08:00', valor: 65, unidad: '%' },
                { sensor: '1', fecha: '10/04/2025 14:00', valor: 60, unidad: '%' },
                { sensor: '2', fecha: '10/04/2025 08:00', valor: 22, unidad: '°C' },
                { sensor: '2', fecha: '10/04/2025 14:00', valor: 28, unidad: '°C' }
            ],
            usosInsumos: [
                { insumo: '1', fecha: '10/04/2025', cantidad: 5, responsable: '2', valorUnitario: 15.5, valorTotal: 77.5, observaciones: 'Aplicación inicial' }
            ]
        },
        {
            id: 'PROD-01032025-0002',
            nombre: 'Trigo Otoño 2025',
            responsable: '2',
            cultivo: '2',
            ciclo: '2',
            sensores: ['2', '3'],
            insumos: ['2'],
            fechaInicio: '01/03/2025',
            fechaFin: '01/09/2025',
            inversion: 980.50,
            meta: 2800.00,
            estado: 'activo'
        },
        {
            id: 'PROD-15122024-0003',
            nombre: 'Soja Anual 2024',
            responsable: '3',
            cultivo: '3',
            ciclo: '3',
            sensores: ['1', '2', '3'],
            insumos: ['1', '2', '3'],
            fechaInicio: '15/12/2024',
            fechaFin: '15/12/2025',
            inversion: 3200.25,
            meta: 8500.00,
            estado: 'inactivo'
        }
    ];
    updateProduccionesTable();
    updateEstadoTable();
    updateReportesTable();
    updatePagination();
}

// Función para inicializar la carga de datos
function loadInitialData() {
    setTimeout(() => {
        const produccionIdInput = document.getElementById('produccionId');
        if (produccionIdInput) {
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            produccionIdInput.value = `PROD-${day}${month}${year}-0001`;
        }
        const fechaInicioInput = document.getElementById('fechaInicio');
        if (fechaInicioInput && fechaInicioInput._flatpickr) {
            fechaInicioInput._flatpickr.setDate(new Date());
        }
        
        loadUsuarios();
        loadCultivos();
        loadCiclos();
        loadSensores();
        loadInsumos();
        loadProducciones();
        
        const responsableSelect = document.getElementById('responsable');
        if (responsableSelect && usuariosData.length > 0) {
            responsableSelect.value = usuariosData[0].id;
        }

        // Inicializar event listeners después de cargar los datos
        if (typeof initFormEventListeners === 'function') {
            initFormEventListeners();
        }
        
        // Actualizar estado inicial del botón
        if (typeof updateCreateButtonState === 'function') {
            updateCreateButtonState();
        }
    }, 500);
}
