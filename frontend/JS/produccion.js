document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let selectedSensors = [];
    let selectedSupplies = [];
    let supplyUsages = [];
    let currentTab = 'basic';
    
    // Elementos del DOM
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const productionForm = document.getElementById('productionForm');
    const createProductionBtn = document.getElementById('createProduction');
    const saveDraftBtn = document.getElementById('saveDraft');
    
    // Modales
    const modals = document.querySelectorAll('.modal');
    const modalCloses = document.querySelectorAll('.modal-close');
    
    // Botones para abrir modales
    const addResponsibleBtn = document.getElementById('addResponsible');
    const addCropBtn = document.getElementById('addCrop');
    const addCropCycleBtn = document.getElementById('addCropCycle');
    const addSensorBtn = document.getElementById('addSensor');
    const addSupplyBtn = document.getElementById('addSupply');
    const addSupplyUsageBtn = document.getElementById('addSupplyUsage');
    
    // Formularios de modales
    const responsibleForm = document.getElementById('responsibleForm');
    const cropForm = document.getElementById('cropForm');
    const cropCycleForm = document.getElementById('cropCycleForm');
    const sensorForm = document.getElementById('sensorForm');
    const supplyForm = document.getElementById('supplyForm');
    const supplyUsageForm = document.getElementById('supplyUsageForm');
    
    // Funciones de validación
    function validateProductionName() {
        const name = document.getElementById('productionName').value;
        const errorElement = document.getElementById('productionNameError');
        
        if (!name) {
            errorElement.textContent = 'Este campo es obligatorio';
            errorElement.style.display = 'block';
            return false;
        }
        
        if (name.length < 3 || name.length > 100) {
            errorElement.textContent = 'El nombre debe tener entre 3 y 100 caracteres';
            errorElement.style.display = 'block';
            return false;
        }
        
        if (/^[0-9\s\W]+$/.test(name) || !/[a-zA-Z]/.test(name)) {
            errorElement.textContent = 'Debe contener al menos una letra del alfabeto latino';
            errorElement.style.display = 'block';
            return false;
        }
        
        // Aquí deberías verificar también que el nombre sea único (requeriría una llamada al backend)
        
        errorElement.style.display = 'none';
        return true;
    }
    
    function validateRequiredSelect(selectId, errorId) {
        const select = document.getElementById(selectId);
        const errorElement = document.getElementById(errorId);
        
        if (!select.value) {
            errorElement.style.display = 'block';
            return false;
        }
        
        errorElement.style.display = 'none';
        return true;
    }
    
    function validateDates() {
        const startDate = new Date(document.getElementById('startDate').value);
        const endDate = new Date(document.getElementById('endDate').value);
        const errorElement = document.getElementById('endDateError');
        
        if (!endDate) {
            errorElement.style.display = 'none';
            return true;
        }
        
        if (endDate <= startDate) {
            errorElement.style.display = 'block';
            return false;
        }
        
        errorElement.style.display = 'none';
        return true;
    }
    
    function validateSensors() {
        const errorElement = document.getElementById('sensorError');
        
        if (selectedSensors.length === 0) {
            errorElement.textContent = 'Debe seleccionar al menos un sensor';
            errorElement.style.display = 'block';
            return false;
        }
        
        if (selectedSensors.length > 3) {
            errorElement.textContent = 'Puede seleccionar hasta 3 sensores';
            errorElement.style.display = 'block';
            return false;
        }
        
        errorElement.style.display = 'none';
        return true;
    }
    
    function validateForm() {
        const basicValid = validateProductionName() && 
                          validateRequiredSelect('responsible', 'responsibleError') && 
                          validateRequiredSelect('crop', 'cropError') && 
                          validateRequiredSelect('cropCycle', 'cropCycleError') && 
                          validateDates();
        
        const sensorsValid = validateSensors();
        
        // En una implementación real, podrías querer validar también los insumos
        
        // Solo habilitar el botón de crear si todas las validaciones pasan
        createProductionBtn.disabled = !(basicValid && sensorsValid);
        
        return basicValid && sensorsValid;
    }
    
    // Funciones para manejar pestañas
    function switchTab(tabId) {
        // Ocultar todas las pestañas
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Desactivar todos los botones de pestaña
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Activar la pestaña seleccionada
        document.getElementById(`${tabId}-tab`).classList.add('active');
        
        // Activar el botón de la pestaña seleccionada
        document.querySelector(`.tab[data-tab="${tabId}"]`).classList.add('active');
        
        currentTab = tabId;
    }
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // Funciones para manejar sensores
    function addSensor() {
        const sensorSelect = document.getElementById('sensor');
        const sensorId = sensorSelect.value;
        
        if (!sensorId) return;
        
        // Verificar si el sensor ya está seleccionado
        if (selectedSensors.some(s => s.id === sensorId)) {
            alert('Este sensor ya ha sido seleccionado');
            return;
        }
        
        // Verificar límite de sensores
        if (selectedSensors.length >= 3) {
            alert('Solo puedes seleccionar hasta 3 sensores');
            return;
        }
        
        // Agregar sensor a la lista
        const sensorName = sensorSelect.options[sensorSelect.selectedIndex].text;
        selectedSensors.push({ id: sensorId, name: sensorName });
        
        // Actualizar la visualización
        updateSelectedSensors();
        validateForm();
        
        // Limpiar selección
        sensorSelect.value = '';
        
        // Actualizar gráfico (simulado)
        updateSensorChart();
    }
    
    function removeSensor(sensorId) {
        selectedSensors = selectedSensors.filter(s => s.id !== sensorId);
        updateSelectedSensors();
        validateForm();
        updateSensorChart();
    }
    
    function updateSelectedSensors() {
        const container = document.getElementById('selectedSensors');
        container.innerHTML = '';
        
        selectedSensors.forEach(sensor => {
            const chip = document.createElement('div');
            chip.className = 'chip';
            chip.innerHTML = `
                ${sensor.name}
                <span class="chip-remove" onclick="removeSensor('${sensor.id}')">&times;</span>
            `;
            container.appendChild(chip);
        });
    }
    
    function updateSensorChart() {
        const chartContainer = document.getElementById('sensorChart');
        
        if (selectedSensors.length === 0) {
            chartContainer.innerHTML = '<p>Seleccione sensores para visualizar los datos</p>';
            return;
        }
        
        // En una implementación real, aquí harías una llamada al backend para obtener los datos
        // y usarías una librería como Chart.js para renderizar el gráfico
        
        // Simulación de datos
        const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        const datasets = selectedSensors.map((sensor, i) => {
            const color = ['#4CAF50', '#2196F3', '#FFC107'][i];
            const data = days.map(() => Math.floor(Math.random() * 100));
            
            return {
                label: sensor.name,
                data: data,
                borderColor: color,
                backgroundColor: `${color}20`,
                tension: 0.1
            };
        });
        
        // Simulación de gráfico con HTML básico
        chartContainer.innerHTML = `
            <div style="height: 100%; display: flex; flex-direction: column;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    ${selectedSensors.map(sensor => `
                        <div style="display: flex; align-items: center;">
                            <div style="width: 15px; height: 15px; background-color: ${['#4CAF50', '#2196F3', '#FFC107'][selectedSensors.indexOf(sensor)]}; margin-right: 5px;"></div>
                            <span>${sensor.name}</span>
                        </div>
                    `).join('')}
                </div>
                <div style="flex: 1; display: flex; align-items: flex-end; gap: 5px; padding-top: 20px;">
                    ${days.map((day, i) => `
                        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%;">
                            ${datasets.map(dataset => `
                                <div 
                                    style="
                                        width: 20px; 
                                        background-color: ${dataset.backgroundColor}; 
                                        border: 1px solid ${dataset.borderColor};
                                        height: ${dataset.data[i]}%;
                                        margin-bottom: 2px;
                                    "
                                    title="${dataset.label}: ${dataset.data[i]}"
                                ></div>
                            `).join('')}
                            <div style="margin-top: 5px; font-size: 12px;">${day}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Funciones para manejar insumos
    function addSupply() {
        const supplySelect = document.getElementById('supply');
        const supplyId = supplySelect.value;
        
        if (!supplyId) return;
        
        // Verificar si el insumo ya está seleccionado
        if (selectedSupplies.some(s => s.id === supplyId)) {
            alert('Este insumo ya ha sido seleccionado');
            return;
        }
        
        // Agregar insumo a la lista
        const supplyName = supplySelect.options[supplySelect.selectedIndex].text;
        selectedSupplies.push({ id: supplyId, name: supplyName });
        
        // Actualizar la visualización
        updateSelectedSupplies();
        validateForm();
        
        // Limpiar selección
        supplySelect.value = '';
    }
    
    function removeSupply(supplyId) {
        selectedSupplies = selectedSupplies.filter(s => s.id !== supplyId);
        updateSelectedSupplies();
        validateForm();
        
        // También eliminar usos de este insumo
        supplyUsages = supplyUsages.filter(usage => usage.supplyId !== supplyId);
        updateSupplyUsageTable();
        updateInvestment();
    }
    
    function updateSelectedSupplies() {
        const container = document.getElementById('selectedSupplies');
        container.innerHTML = '';
        
        selectedSupplies.forEach(supply => {
            const chip = document.createElement('div');
            chip.className = 'chip';
            chip.innerHTML = `
                ${supply.name}
                <span class="chip-remove" onclick="removeSupply('${supply.id}')">&times;</span>
            `;
            container.appendChild(chip);
        });
    }
    
    // Funciones para manejar el uso de insumos
    function openSupplyUsageModal(usage = null) {
        const modal = document.getElementById('supplyUsageModal');
        const supplySelect = document.getElementById('usageSupply');
        const responsibleSelect = document.getElementById('usageResponsible');
        
        // Limpiar selects
        supplySelect.innerHTML = '<option value="">Seleccione un insumo</option>';
        responsibleSelect.innerHTML = '<option value="">Seleccione un responsable</option>';
        
        // Llenar select de insumos con los seleccionados
        selectedSupplies.forEach(supply => {
            const option = document.createElement('option');
            option.value = supply.id;
            option.textContent = supply.name;
            supplySelect.appendChild(option);
        });
        
        // Llenar select de responsables (simulado)
        ['Juan Pérez', 'María García', 'Carlos López'].forEach((resp, i) => {
            const option = document.createElement('option');
            option.value = i + 1;
            option.textContent = resp;
            responsibleSelect.appendChild(option);
        });
        
        // Si se está editando un uso, llenar el formulario
        if (usage) {
            document.getElementById('usageId').value = usage.id;
            supplySelect.value = usage.supplyId;
            document.getElementById('usageDate').value = usage.date;
            document.getElementById('usageQuantity').value = usage.quantity;
            responsibleSelect.value = usage.responsibleId;
            document.getElementById('usageUnitPrice').value = usage.unitPrice;
            document.getElementById('usageTotalPrice').value = usage.totalPrice;
            document.getElementById('usageNotes').value = usage.notes || '';
        } else {
            // Resetear formulario
            document.getElementById('usageId').value = '';
            document.getElementById('supplyUsageForm').reset();
            
            // Establecer fecha actual por defecto
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('usageDate').value = today;
        }
        
        // Mostrar modal
        modal.style.display = 'flex';
    }
    
    function saveSupplyUsage(event) {
        event.preventDefault();
        
        const form = document.getElementById('supplyUsageForm');
        const usageId = document.getElementById('usageId').value;
        const supplyId = document.getElementById('usageSupply').value;
        const supplyName = document.getElementById('usageSupply').options[document.getElementById('usageSupply').selectedIndex].text;
        const date = document.getElementById('usageDate').value;
        const quantity = parseFloat(document.getElementById('usageQuantity').value);
        const responsibleId = document.getElementById('usageResponsible').value;
        const responsibleName = document.getElementById('usageResponsible').options[document.getElementById('usageResponsible').selectedIndex].text;
        const unitPrice = parseFloat(document.getElementById('usageUnitPrice').value);
        const totalPrice = quantity * unitPrice;
        const notes = document.getElementById('usageNotes').value;
        
        const usage = {
            id: usageId || Date.now().toString(),
            supplyId,
            supplyName,
            date,
            quantity,
            responsibleId,
            responsibleName,
            unitPrice,
            totalPrice,
            notes
        };
        
        // Si es edición, reemplazar el uso existente
        if (usageId) {
            const index = supplyUsages.findIndex(u => u.id === usageId);
            if (index !== -1) {
                supplyUsages[index] = usage;
            }
        } else {
            // Agregar nuevo uso
            supplyUsages.push(usage);
        }
        
        // Actualizar tabla y cálculos
        updateSupplyUsageTable();
        updateInvestment();
        
        // Cerrar modal
        closeModal('supplyUsageModal');
    }
    
    function editSupplyUsage(usageId) {
        const usage = supplyUsages.find(u => u.id === usageId);
        if (usage) {
            openSupplyUsageModal(usage);
        }
    }
    
    function deleteSupplyUsage(usageId) {
        if (confirm('¿Está seguro de eliminar este registro de uso de insumo?')) {
            supplyUsages = supplyUsages.filter(u => u.id !== usageId);
            updateSupplyUsageTable();
            updateInvestment();
        }
    }
    
    function updateSupplyUsageTable() {
        const tbody = document.querySelector('#supplyUsageTable tbody');
        tbody.innerHTML = '';
        
        if (supplyUsages.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="7" style="text-align: center;">No hay registros de uso de insumos</td>';
            tbody.appendChild(row);
            return;
        }
        
        supplyUsages.forEach(usage => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${usage.supplyName}</td>
                <td>${usage.date}</td>
                <td>${usage.quantity}</td>
                <td>${usage.responsibleName}</td>
                <td>$${usage.unitPrice.toFixed(2)}</td>
                <td>$${usage.totalPrice.toFixed(2)}</td>
                <td>
                    <button onclick="editSupplyUsage('${usage.id}')" style="background: none; border: none; color: #2196F3; cursor: pointer;">Editar</button>
                    <button onclick="deleteSupplyUsage('${usage.id}')" style="background: none; border: none; color: #F44336; cursor: pointer;">Eliminar</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    function updateInvestment() {
        const totalInvestment = supplyUsages.reduce((sum, usage) => sum + usage.totalPrice, 0);
        document.getElementById('totalInvestment').value = `$${totalInvestment.toFixed(2)}`;
        
        // Simular cálculo de meta (en una implementación real esto vendría del backend)
        const estimatedGoal = totalInvestment * 2.5; // Ejemplo: 2.5 veces la inversión
        document.getElementById('estimatedGoal').value = `$${estimatedGoal.toFixed(2)}`;
    }
    
    // Funciones para manejar modales
    function openModal(modalId) {
        document.getElementById(modalId).style.display = 'flex';
    }
    
    function closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }
    
    // Event listeners
    productionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Aquí iría el código para enviar el formulario al backend
            alert('Producción creada exitosamente');
            // productionForm.reset();
            // Resetear otros estados si es necesario
        }
    });
    
    saveDraftBtn.addEventListener('click', function() {
        // Aquí iría el código para guardar como borrador
        alert('Borrador guardado exitosamente');
    });
    
    // Event listeners para abrir modales
    addResponsibleBtn.addEventListener('click', () => openModal('responsibleModal'));
    addCropBtn.addEventListener('click', () => openModal('cropModal'));
    addCropCycleBtn.addEventListener('click', () => openModal('cropCycleModal'));
    addSensorBtn.addEventListener('click', () => openModal('sensorModal'));
    addSupplyBtn.addEventListener('click', () => openModal('supplyModal'));
    addSupplyUsageBtn.addEventListener('click', () => openSupplyUsageModal());
    
    // Event listeners para cerrar modales
    modalCloses.forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });
    
    // Cerrar modal al hacer clic fuera del contenido
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
    
    // Event listeners para formularios de modales
    responsibleForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Aquí iría el código para guardar el nuevo responsable
        alert('Responsable agregado exitosamente');
        closeModal('responsibleModal');
        // En una implementación real, actualizarías el select de responsables
    });
    
    cropForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Aquí iría el código para guardar el nuevo cultivo
        alert('Cultivo agregado exitosamente');
        closeModal('cropModal');
        // En una implementación real, actualizarías el select de cultivos
    });
    
    cropCycleForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Aquí iría el código para guardar el nuevo ciclo de cultivo
        alert('Ciclo de cultivo agregado exitosamente');
        closeModal('cropCycleModal');
        // En una implementación real, actualizarías el select de ciclos
    });
    
    sensorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Aquí iría el código para guardar el nuevo sensor
        alert('Sensor agregado exitosamente');
        closeModal('sensorModal');
        // En una implementación real, actualizarías el select de sensores
    });
    
    supplyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Aquí iría el código para guardar el nuevo insumo
        alert('Insumo agregado exitosamente');
        closeModal('supplyModal');
        // En una implementación real, actualizarías el select de insumos
    });
    
    supplyUsageForm.addEventListener('submit', saveSupplyUsage);
    
    // Event listeners para validación en tiempo real
    document.getElementById('productionName').addEventListener('input', validateProductionName);
    document.getElementById('productionName').addEventListener('blur', validateProductionName);
    
    document.getElementById('responsible').addEventListener('change', function() {
        validateRequiredSelect('responsible', 'responsibleError');
        validateForm();
    });
    
    document.getElementById('crop').addEventListener('change', function() {
        validateRequiredSelect('crop', 'cropError');
        validateForm();
    });
    
    document.getElementById('cropCycle').addEventListener('change', function() {
        validateRequiredSelect('cropCycle', 'cropCycleError');
        validateForm();
    });
    
    document.getElementById('startDate').addEventListener('change', function() {
        // Establecer fecha mínima para fin de producción
        document.getElementById('endDate').min = this.value;
        validateDates();
        validateForm();
    });
    
    document.getElementById('endDate').addEventListener('change', validateDates);
    
    document.getElementById('sensor').addEventListener('change', addSensor);
    
    document.getElementById('supply').addEventListener('change', addSupply);
    
    // Event listener para calcular total cuando cambia cantidad o precio unitario
    document.getElementById('usageQuantity').addEventListener('input', calculateTotalPrice);
    document.getElementById('usageUnitPrice').addEventListener('input', calculateTotalPrice);
    
    function calculateTotalPrice() {
        const quantity = parseFloat(document.getElementById('usageQuantity').value) || 0;
        const unitPrice = parseFloat(document.getElementById('usageUnitPrice').value) || 0;
        document.getElementById('usageTotalPrice').value = (quantity * unitPrice).toFixed(2);
    }
    
    // Inicialización
    function init() {
        // Establecer fecha actual por defecto
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('startDate').value = today;
        document.getElementById('startDate').min = today;
        
        // Hacer disponibles las funciones en el ámbito global para los eventos en línea
        window.removeSensor = removeSensor;
        window.removeSupply = removeSupply;
        window.editSupplyUsage = editSupplyUsage;
        window.deleteSupplyUsage = deleteSupplyUsage;
        
        // Validar formulario inicialmente
        validateForm();
    }
    
    init();
});