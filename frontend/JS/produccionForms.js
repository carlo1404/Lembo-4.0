/* produccionForms.js */
// Funciones para el manejo de formularios y modales

function openCrearProduccionModal() {
    const crearProduccionModal = document.getElementById('crearProduccionModal');
    if (crearProduccionModal) {
        crearProduccionModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        initFormEventListeners();
    }
}

function openAgregarElementoModal(tipo) {
    const agregarElementoModal = document.getElementById('agregarElementoModal');
    const modalTitle = document.getElementById('agregarElementoTitulo');
    const formContent = document.getElementById('elementoFormContent');
    
    if (!modalTitle || !formContent || !agregarElementoModal) return;
    
    switch(tipo) {
        case 'responsable':
            modalTitle.textContent = 'Agregar Nuevo Responsable';
            formContent.innerHTML = `
                <label for="nombreResponsable" class="produccion__label">Nombre:</label>
                <input type="text" id="nombreResponsable" class="produccion__input" required>
                <label for="rolResponsable" class="produccion__label">Rol:</label>
                <input type="text" id="rolResponsable" class="produccion__input" required>
            `;
            break;
        case 'cultivo':
            modalTitle.textContent = 'Agregar Nuevo Cultivo';
            formContent.innerHTML = `
                <label for="nombreCultivo" class="produccion__label">Nombre:</label>
                <input type="text" id="nombreCultivo" class="produccion__input" required>
                <label for="descripcionCultivo" class="produccion__label">Descripción:</label>
                <textarea id="descripcionCultivo" class="produccion__textarea"></textarea>
            `;
            break;
        case 'ciclo':
            modalTitle.textContent = 'Agregar Nuevo Ciclo de Cultivo';
            formContent.innerHTML = `
                <label for="nombreCiclo" class="produccion__label">Nombre:</label>
                <input type="text" id="nombreCiclo" class="produccion__input" required>
                <label for="duracionCiclo" class="produccion__label">Duración:</label>
                <input type="text" id="duracionCiclo" class="produccion__input" required>
            `;
            break;
        case 'sensor':
            modalTitle.textContent = 'Agregar Nuevo Sensor';
            formContent.innerHTML = `
                <label for="nombreSensor" class="produccion__label">Nombre:</label>
                <input type="text" id="nombreSensor" class="produccion__input" required>
                <label for="tipoSensor" class="produccion__label">Tipo:</label>
                <input type="text" id="tipoSensor" class="produccion__input" required>
                <label for="unidadSensor" class="produccion__label">Unidad de medida:</label>
                <input type="text" id="unidadSensor" class="produccion__input" required>
            `;
            break;
        case 'insumo':
            modalTitle.textContent = 'Agregar Nuevo Insumo';
            formContent.innerHTML = `
                <label for="nombreInsumo" class="produccion__label">Nombre:</label>
                <input type="text" id="nombreInsumo" class="produccion__input" required>
                <label for="tipoInsumo" class="produccion__label">Tipo:</label>
                <input type="text" id="tipoInsumo" class="produccion__input" required>
                <label for="unidadInsumo" class="produccion__label">Unidad:</label>
                <input type="text" id="unidadInsumo" class="produccion__input" required>
                <label for="precioInsumo" class="produccion__label">Precio unitario:</label>
                <input type="number" id="precioInsumo" class="produccion__input" min="0" step="0.01" required>
            `;
            break;
    }
    
    const agregarElementoForm = document.getElementById('agregarElementoForm');
    if (agregarElementoForm) {
        agregarElementoForm.dataset.tipo = tipo;
        agregarElementoModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function openUsarInsumoModal(insumoId) {
    const usarInsumoModal = document.getElementById('usarInsumoModal');
    const insumo = insumosData.find(i => i.id === insumoId);
    if (!insumo || !usarInsumoModal) return;
    
    const insumoSeleccionado = document.getElementById('insumoSeleccionado');
    const fechaUso = document.getElementById('fechaUso');
    const cantidad = document.getElementById('cantidad');
    const valorUnitario = document.getElementById('valorUnitario');
    const valorTotal = document.getElementById('valorTotal');
    const observaciones = document.getElementById('observaciones');
    
    if(insumoSeleccionado) insumoSeleccionado.value = insumo.nombre;
    if(fechaUso && fechaUso._flatpickr) fechaUso._flatpickr.setDate(new Date());
    if(cantidad) cantidad.value = '';
    if(valorUnitario) valorUnitario.value = insumo.precio;
    if(valorTotal) valorTotal.value = '';
    if(observaciones) observaciones.value = '';
    
    usarInsumoModal.dataset.insumoId = insumoId;
    usarInsumoModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function openLecturasSensorModal(produccionId) {
    selectedProduccion = produccionId;
    const lecturasSensorModal = document.getElementById('lecturasSensorModal');
    if (lecturasSensorModal) {
        lecturasSensorModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    const produccion = produccionesData.find(p => p.id === produccionId);
    const sensorSeleccionadoSelect = document.getElementById('sensorSeleccionado');
    if (produccion && produccion.sensores && produccion.sensores.length > 0 && sensorSeleccionadoSelect) {
        sensorSeleccionadoSelect.value = produccion.sensores[0];
        if (typeof filtrarLecturasSensores === 'function') {
            filtrarLecturasSensores();
        }
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('#crearProduccionModal, #agregarElementoModal, #usarInsumoModal, #lecturasSensorModal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

function validateNombreProduccion() {
    const nombreProduccionInput = document.getElementById('nombreProduccion');
    const nombreError = document.getElementById('nombreError');
    if (!nombreProduccionInput || !nombreError) return false;
    
    const value = nombreProduccionInput.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    if (value.length < 3) {
        isValid = false;
        errorMessage = 'El nombre debe tener al menos 3 caracteres.';
    } else if (value.length > 100) {
        isValid = false;
        errorMessage = 'El nombre no puede exceder los 100 caracteres.';
    } else if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
        isValid = false;
        errorMessage = 'El nombre solo puede contener letras, números y espacios.';
    } else if (window.editingProductionId === null && produccionesData.some(p => p.nombre.toLowerCase() === value.toLowerCase())) {
        isValid = false;
        errorMessage = 'Este nombre de producción ya existe.';
    }
    
    nombreError.textContent = errorMessage;
    nombreError.style.display = isValid ? 'none' : 'block';
    nombreProduccionInput.classList.toggle('produccion__input--error', !isValid);
    
    updateCreateButtonState();
    return isValid;
}

function updateSelectedSensores() {
    const sensoresSelect = document.getElementById('sensores');
    const selectedSensoresContainer = document.getElementById('selectedSensores');
    if (!sensoresSelect || !selectedSensoresContainer) return;
    
    selectedSensoresContainer.innerHTML = '';
    const selectedOptions = Array.from(sensoresSelect.selectedOptions);
    
    if (selectedOptions.length > 3) {
        alert('Solo puedes seleccionar un máximo de 3 sensores.');
        selectedOptions[selectedOptions.length - 1].selected = false;
        return updateSelectedSensores();
    }
    
    selectedOptions.forEach(option => {
        const sensor = sensoresData.find(s => s.id === option.value);
        if (sensor) {
            const chip = document.createElement('div');
            chip.className = 'produccion__selected-item';
            chip.innerHTML = `
                ${sensor.nombre}
                <span class="produccion__selected-item-remove" data-id="${sensor.id}">&times;</span>
            `;
            selectedSensoresContainer.appendChild(chip);
        }
    });
    
    document.querySelectorAll('.produccion__selected-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const sensorId = e.target.dataset.id;
            const option = document.querySelector(`#sensores option[value="${sensorId}"]`);
            if (option) option.selected = false;
            updateSelectedSensores();
        });
    });
    
    updateCreateButtonState();
}

function updateSelectedInsumos() {
    const insumosSelect = document.getElementById('insumos');
    const selectedInsumosContainer = document.getElementById('selectedInsumos');
    if (!insumosSelect || !selectedInsumosContainer) return;
    
    selectedInsumosContainer.innerHTML = '';
    const selectedOptions = Array.from(insumosSelect.selectedOptions);
    
    selectedOptions.forEach(option => {
        const insumo = insumosData.find(i => i.id === option.value);
        if (insumo) {
            const chip = document.createElement('div');
            chip.className = 'produccion__selected-item';
            chip.innerHTML = `
                ${insumo.nombre} (${insumo.precio}/${insumo.unidad})
                <span class="produccion__selected-item-remove" data-id="${insumo.id}">&times;</span>
                <button class="produccion__button produccion__button--small" data-id="${insumo.id}">Usar</button>
            `;
            selectedInsumosContainer.appendChild(chip);
        }
    });
    
    document.querySelectorAll('.produccion__selected-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const insumoId = e.target.dataset.id;
            const option = document.querySelector(`#insumos option[value="${insumoId}"]`);
            if (option) option.selected = false;
            updateSelectedInsumos();
            updateInversionEstimada();
        });
    });
    
    document.querySelectorAll('.produccion__button--small').forEach(btn => {
        if (btn.textContent === 'Usar') {
            btn.addEventListener('click', (e) => {
                openUsarInsumoModal(e.target.dataset.id);
            });
        }
    });
    
    updateInversionEstimada();
    updateCreateButtonState();
}

function updateInversionEstimada() {
    const insumosSelect = document.getElementById('insumos');
    const inversionEstimada = document.getElementById('inversionEstimada');
    const metaGanancias = document.getElementById('metaGanancias');
    if (!insumosSelect || !inversionEstimada || !metaGanancias) return;
    
    const selectedOptions = Array.from(insumosSelect.selectedOptions);
    let total = 0;
    selectedOptions.forEach(option => {
        const insumo = insumosData.find(i => i.id === option.value);
        if (insumo) {
            total += insumo.precio * 10; // Ejemplo de cálculo
        }
    });
    
    inversionEstimada.textContent = `$${total.toFixed(2)}`;
    metaGanancias.textContent = `$${(total * 1.3).toFixed(2)}`;
}

function updateCreateButtonState() {
    const responsableSelect = document.getElementById('responsable');
    const nombreProduccionInput = document.getElementById('nombreProduccion');
    const cultivoSelect = document.getElementById('cultivo');
    const cicloCultivoSelect = document.getElementById('cicloCultivo');
    const sensoresSelect = document.getElementById('sensores');
    const insumosSelect = document.getElementById('insumos');
    const fechaInicioInput = document.getElementById('fechaInicio');
    
    const hasResponsable = responsableSelect && responsableSelect.value !== '';
    const hasNombre = nombreProduccionInput && nombreProduccionInput.value.trim() !== '';
    const hasCultivo = cultivoSelect && cultivoSelect.value !== '';
    const hasCiclo = cicloCultivoSelect && cicloCultivoSelect.value !== '';
    const hasSensores = sensoresSelect && sensoresSelect.selectedOptions.length > 0;
    const hasInsumos = insumosSelect && insumosSelect.selectedOptions.length > 0;
    const hasFechaInicio = fechaInicioInput && fechaInicioInput.value !== '';
    
    const crearProduccionSubmit = document.getElementById('crearProduccion');
    if (crearProduccionSubmit) {
        const allFieldsValid = hasResponsable && hasNombre && hasCultivo && 
                             hasCiclo && hasSensores && hasInsumos && hasFechaInicio;
        crearProduccionSubmit.disabled = !allFieldsValid;
    }
}

function loadProduccionDetails(id, isEdit) {
    const produccion = produccionesData.find(p => p.id === id);
    if (!produccion) return;
    if (isEdit) {
        // Cargar datos de la producción en el formulario para edición
        const produccionIdInput = document.getElementById('produccionId');
        const nombreProduccionInput = document.getElementById('nombreProduccion');
        const responsableSelect = document.getElementById('responsable');
        const cultivoSelect = document.getElementById('cultivo');
        const cicloCultivoSelect = document.getElementById('cicloCultivo');
        const fechaInicioInput = document.getElementById('fechaInicio');
        const fechaFinInput = document.getElementById('fechaFin');
        if (produccionIdInput) produccionIdInput.value = produccion.id;
        if (nombreProduccionInput) nombreProduccionInput.value = produccion.nombre;
        if (responsableSelect) responsableSelect.value = produccion.responsable;
        if (cultivoSelect) cultivoSelect.value = produccion.cultivo;
        if (cicloCultivoSelect) cicloCultivoSelect.value = produccion.ciclo;
        if (fechaInicioInput) fechaInicioInput.value = produccion.fechaInicio;
        if (fechaFinInput) fechaFinInput.value = produccion.fechaFin;
        
        // Actualiza selects de sensores e insumos
        const sensoresSelect = document.getElementById('sensores');
        if (sensoresSelect) {
            Array.from(sensoresSelect.options).forEach(option => {
                option.selected = produccion.sensores.includes(option.value);
            });
            updateSelectedSensores();
        }
        const insumosSelect = document.getElementById('insumos');
        if (insumosSelect) {
            Array.from(insumosSelect.options).forEach(option => {
                option.selected = produccion.insumos.includes(option.value);
            });
            updateSelectedInsumos();
        }
        
        // Indicar que se está en modo edición
        window.editingProductionId = produccion.id;
        const crearProduccionSubmit = document.getElementById('crearProduccion');
        if (crearProduccionSubmit) {
            crearProduccionSubmit.textContent = "Actualizar Producción";
        }
    } else {
        // En modo visualización, se podría mostrar información en otro apartado
        alert(`Visualizando producción: ${produccion.nombre}`);
    }
}

function submitProduccionForm(isDraft = false) {
    if (!isDraft && !validateNombreProduccion()) return;
    
    // Obtener valores del formulario
    const produccionIdInput = document.getElementById('produccionId');
    const nombreProduccionInput = document.getElementById('nombreProduccion');
    const responsableSelect = document.getElementById('responsable');
    const cultivoSelect = document.getElementById('cultivo');
    const cicloCultivoSelect = document.getElementById('cicloCultivo');
    const sensoresSelect = document.getElementById('sensores');
    const insumosSelect = document.getElementById('insumos');
    const fechaInicioInput = document.getElementById('fechaInicio');
    const fechaFinInput = document.getElementById('fechaFin');
    const inversionEstimadaElem = document.getElementById('inversionEstimada');
    const metaGananciasElem = document.getElementById('metaGanancias');
    
    const formProduction = {
        id: produccionIdInput ? produccionIdInput.value : '',
        nombre: nombreProduccionInput ? nombreProduccionInput.value.trim() : '',
        responsable: responsableSelect ? responsableSelect.value : '',
        cultivo: cultivoSelect ? cultivoSelect.value : '',
        ciclo: cicloCultivoSelect ? cicloCultivoSelect.value : '',
        sensores: sensoresSelect ? Array.from(sensoresSelect.selectedOptions).map(o => o.value) : [],
        insumos: insumosSelect ? Array.from(insumosSelect.selectedOptions).map(o => o.value) : [],
        fechaInicio: fechaInicioInput ? fechaInicioInput.value : '',
        fechaFin: fechaFinInput ? fechaFinInput.value : '',
        inversion: inversionEstimadaElem ? parseFloat(inversionEstimadaElem.textContent.replace('$', '')) : 0,
        meta: metaGananciasElem ? parseFloat(metaGananciasElem.textContent.replace('$', '')) : 0,
        estado: isDraft ? 'borrador' : 'activo',
        lecturas: [],
        usosInsumos: []
    };
    
    if (window.editingProductionId) {
        // Actualizar producción existente
        const index = produccionesData.findIndex(p => p.id === window.editingProductionId);
        if (index !== -1) {
            produccionesData[index] = formProduction;
        }
        window.editingProductionId = null;
        const crearProduccionSubmit = document.getElementById('crearProduccion');
        if (crearProduccionSubmit) {
            crearProduccionSubmit.textContent = "Crear Producción";
        }
    } else {
        // Agregar nueva producción al inicio del array
        produccionesData.unshift(formProduction);
    }

    // Asegurarse que los cambios se reflejen en la UI
    currentPage = 1; // Volver a la primera página
    updateProduccionesTable();
    updateEstadoTable();
    updateReportesTable();
    updatePagination();
    
    alert(`Producción ${isDraft ? 'guardada' : window.editingProductionId ? 'actualizada exitosamente' : 'creada exitosamente'}`);
    
    closeAllModals();
    const produccionForm = document.getElementById('crearProduccionForm');
    if (produccionForm) produccionForm.reset();
    const selectedSensoresContainer = document.getElementById('selectedSensores');
    if (selectedSensoresContainer) selectedSensoresContainer.innerHTML = '';
    const selectedInsumosContainer = document.getElementById('selectedInsumos');
    if (selectedInsumosContainer) selectedInsumosContainer.innerHTML = '';
    
    // Generar un nuevo ID para la siguiente producción (si se creaba nueva)
    if (produccionIdInput && !window.editingProductionId) {
        const lastId = produccionIdInput.value;
        const parts = lastId.split('-');
        const nextNum = String(parseInt(parts[2]) + 1).padStart(4, '0');
        produccionIdInput.value = `${parts[0]}-${parts[1]}-${nextNum}`;
    }
}

function submitAgregarElementoForm() {
    const agregarElementoForm = document.getElementById('agregarElementoForm');
    if (!agregarElementoForm) return;
    const tipo = agregarElementoForm.dataset.tipo;
    let nuevoElemento = {};
    
    switch(tipo) {
        case 'responsable':
            nuevoElemento = {
                id: String(usuariosData.length + 1),
                nombre: document.getElementById('nombreResponsable').value.trim(),
                rol: document.getElementById('rolResponsable').value.trim()
            };
            usuariosData.push(nuevoElemento);
            loadUsuarios();
            break;
        case 'cultivo':
            nuevoElemento = {
                id: String(cultivosData.length + 1),
                nombre: document.getElementById('nombreCultivo').value.trim(),
                descripcion: document.getElementById('descripcionCultivo').value.trim()
            };
            cultivosData.push(nuevoElemento);
            loadCultivos();
            break;
        case 'ciclo':
            nuevoElemento = {
                id: String(ciclosData.length + 1),
                nombre: document.getElementById('nombreCiclo').value.trim(),
                duracion: document.getElementById('duracionCiclo').value.trim()
            };
            ciclosData.push(nuevoElemento);
            loadCiclos();
            break;
        case 'sensor':
            nuevoElemento = {
                id: String(sensoresData.length + 1),
                nombre: document.getElementById('nombreSensor').value.trim(),
                tipo: document.getElementById('tipoSensor').value.trim(),
                unidad: document.getElementById('unidadSensor').value.trim()
            };
            sensoresData.push(nuevoElemento);
            loadSensores();
            break;
        case 'insumo':
            nuevoElemento = {
                id: String(insumosData.length + 1),
                nombre: document.getElementById('nombreInsumo').value.trim(),
                tipo: document.getElementById('tipoInsumo').value.trim(),
                unidad: document.getElementById('unidadInsumo').value.trim(),
                precio: parseFloat(document.getElementById('precioInsumo').value)
            };
            insumosData.push(nuevoElemento);
            loadInsumos();
            break;
    }
    
    alert(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} agregado exitosamente`);
    
    closeAllModals();
    agregarElementoForm.reset();
}

function initFormEventListeners() {
    const form = document.getElementById('crearProduccionForm');
    if (!form) return;

    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', updateCreateButtonState);
        input.addEventListener('change', updateCreateButtonState);
    });

    const nombreProduccionInput = document.getElementById('nombreProduccion');
    if (nombreProduccionInput) {
        nombreProduccionInput.addEventListener('input', validateNombreProduccion);
    }

    const sensoresSelect = document.getElementById('sensores');
    if (sensoresSelect) {
        sensoresSelect.addEventListener('change', () => {
            updateSelectedSensores();
            updateCreateButtonState();
        });
    }

    const insumosSelect = document.getElementById('insumos');
    if (insumosSelect) {
        insumosSelect.addEventListener('change', () => {
            updateSelectedInsumos();
            updateCreateButtonState();
        });
    }
}
