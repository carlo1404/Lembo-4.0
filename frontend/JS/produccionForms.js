// produccionForms.js

// —————— Apertura y cierre de modales ——————

function openCrearProduccionModal() {
    const modal = document.getElementById('crearProduccionModal');
    if (!modal) return;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    initFormEventListeners();
  }
  
  function closeAllModals() {
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    document.body.style.overflow = 'auto';
  }
  
  // Manejo genérico de modales de “Agregar Elemento”
  function openAgregarElementoModal(tipo) {
    const modal = document.getElementById('agregarElementoModal');
    const title = document.getElementById('agregarElementoTitulo');
    const body  = document.getElementById('elementoFormContent');
    if (!modal || !title || !body) return;
  
    const templates = {
      responsable: `
        <label class="produccion__label">Nombre:</label>
        <input id="nombreResponsable" class="produccion__input" required>
        <label class="produccion__label">Rol:</label>
        <input id="rolResponsable" class="produccion__input" required>`,
      cultivo: `
        <label class="produccion__label">Nombre:</label>
        <input id="nombreCultivo" class="produccion__input" required>
        <label class="produccion__label">Descripción:</label>
        <textarea id="descripcionCultivo" class="produccion__textarea"></textarea>`,
      ciclo: `
        <label class="produccion__label">Nombre:</label>
        <input id="nombreCiclo" class="produccion__input" required>
        <label class="produccion__label">Duración:</label>
        <input id="duracionCiclo" class="produccion__input" required>`,
      sensor: `
        <label class="produccion__label">Nombre:</label>
        <input id="nombreSensor" class="produccion__input" required>
        <label class="produccion__label">Tipo:</label>
        <input id="tipoSensor" class="produccion__input" required>
        <label class="produccion__label">Unidad:</label>
        <input id="unidadSensor" class="produccion__input" required>`,
      insumo: `
        <label class="produccion__label">Nombre:</label>
        <input id="nombreInsumo" class="produccion__input" required>
        <label class="produccion__label">Tipo:</label>
        <input id="tipoInsumo" class="produccion__input" required>
        <label class="produccion__label">Unidad:</label>
        <input id="unidadInsumo" class="produccion__input" required>
        <label class="produccion__label">Precio unitario:</label>
        <input id="precioInsumo" type="number" class="produccion__input" min="0" step="0.01" required>`
    };
  
    title.textContent     = `Agregar Nuevo ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`;
    body.innerHTML        = templates[tipo] || '';
    modal.dataset.tipo    = tipo;
    modal.style.display   = 'flex';
    document.body.style.overflow = 'hidden';
  }
  
  // —————— Validaciones y UI dinámico ——————
  
  function validateNombreProduccion() {
    const inp = document.getElementById('nombreProduccion');
    const err = document.getElementById('nombreError');
    if (!inp || !err) return false;
  
    const v = inp.value.trim();
    let msg = '';
    if (v.length < 3)         msg = 'Mínimo 3 caracteres.';
    else if (v.length > 100)  msg = 'Máximo 100 caracteres.';
    else if (!/[A-Za-z]/.test(v)) msg = 'Debe contener al menos una letra.';
    else if (produccionesData.some(p => p.nombre.toLowerCase()===v.toLowerCase()
             && p.id!==window.editingProductionId)) {
      msg = 'Nombre ya usado.';
    }
  
    err.textContent = msg;
    err.style.display = msg ? 'block' : 'none';
    inp.classList.toggle('produccion__input--error', !!msg);
    updateCreateButtonState();
    return !msg;
  }
  
  function updateSelectedSensores() {
    const sel = document.getElementById('sensores');
    const cont = document.getElementById('selectedSensores');
    if (!sel || !cont) return;
    cont.innerHTML = '';
    const opts = Array.from(sel.selectedOptions);
    if (opts.length > 3) {
      alert('Máximo 3 sensores.');
      opts.pop().selected = false;
      return updateSelectedSensores();
    }
    opts.forEach(o => {
      const s = sensoresData.find(x=> x.id=== o.value);
      if (s) {
        const div = document.createElement('div');
        div.className = 'produccion__selected-item';
        div.innerHTML = `
          ${s.nombre}
          <span data-id="${s.id}" class="produccion__selected-item-remove">&times;</span>
        `;
        cont.appendChild(div);
      }
    });
    cont.querySelectorAll('.produccion__selected-item-remove').forEach(btn=>{
      btn.onclick = e => {
        document.querySelector(`#sensores option[value="${e.target.dataset.id}"]`).selected=false;
        updateSelectedSensores();
      };
    });
    updateCreateButtonState();
  }
  
  function updateSelectedInsumos() {
    const sel = document.getElementById('insumos');
    const cont = document.getElementById('selectedInsumos');
    if (!sel || !cont) return;
    cont.innerHTML = '';
    Array.from(sel.selectedOptions).forEach(o=>{
      const i = insumosData.find(x=> x.id=== o.value);
      if (i) {
        const div = document.createElement('div');
        div.className = 'produccion__selected-item';
        div.innerHTML = `
          ${i.nombre} (${i.precio}/${i.unidad})
          <span data-id="${i.id}" class="produccion__selected-item-remove">&times;</span>
          <button data-id="${i.id}" class="produccion__button produccion__button--small">Usar</button>
        `;
        cont.appendChild(div);
      }
    });
    cont.querySelectorAll('.produccion__selected-item-remove').forEach(btn=>{
      btn.onclick = e => {
        document.querySelector(`#insumos option[value="${e.target.dataset.id}"]`).selected=false;
        updateSelectedInsumos();
        updateInversionEstimada();
      };
    });
    cont.querySelectorAll('.produccion__button--small').forEach(btn=>{
      btn.onclick = e => openUsarInsumoModal(e.target.dataset.id);
    });
    updateInversionEstimada();
    updateCreateButtonState();
  }
  
  function updateInversionEstimada() {
    const sel = document.getElementById('insumos');
    if (!sel) return;
    let total = 0;
    Array.from(sel.selectedOptions).forEach(o=>{
      const i = insumosData.find(x=> x.id===o.value);
      if (i) total += i.precio * 10; // ajusta tu regla
    });
    const inv = document.getElementById('inversionEstimada');
    const meta = document.getElementById('metaGanancias');
    if (inv) inv.textContent = `$${total.toFixed(2)}`;
    if (meta) meta.textContent = `$${(total*1.3).toFixed(2)}`;
  }
  
  function updateCreateButtonState() {
    const btn = document.getElementById('crearProduccion');
    if (!btn) return;
    const ok = 
      !!document.getElementById('responsable')?.value &&
      !!document.getElementById('nombreProduccion')?.value.trim() &&
      !!document.getElementById('cultivo')?.value &&
      !!document.getElementById('cicloCultivo')?.value &&
      (document.getElementById('sensores')?.selectedOptions.length>0) &&
      (document.getElementById('insumos')?.selectedOptions.length>0) &&
      !!document.getElementById('fechaInicio')?.value;
    btn.disabled = !ok;
  }
  
  
  // —————— Crear/Actualizar via API ——————
  
  async function submitProduccionForm(isDraft = false) {
    if (!isDraft && !validateNombreProduccion()) return;
  
    // Recolectar datos
    const get = id => document.getElementById(id);
    const parseDate = d => {
      const [dd,mm,yy] = d.split('/');
      return `${yy}-${mm}-${dd}`;
    };
    const payload = {
      id: get('produccionId').value,
      nombre: get('nombreProduccion').value.trim(),
      responsable: +get('responsable').value,
      cultivo: +get('cultivo').value,
      ciclo: +get('cicloCultivo').value,
      sensores: Array.from(get('sensores').selectedOptions).map(o=>+o.value),
      insumos: Array.from(get('insumos').selectedOptions).map(o=>+o.value),
      fecha_inicio: parseDate(get('fechaInicio').value),
      fecha_fin: get('fechaFin').value ? parseDate(get('fechaFin').value) : null,
      inversion: parseFloat(get('inversionEstimada').textContent.replace('$',''))||0,
      meta: parseFloat(get('metaGanancias').textContent.replace('$',''))||0,
      estado: isDraft?'borrador':'activo'
    };
  
    try {
      const method = window.editingProductionId ? 'PUT' : 'POST';
      const url    = window.editingProductionId 
        ? `/api/producciones/${encodeURIComponent(payload.id)}` 
        : '/api/producciones';
  
      const res = await fetch(url, {
        method,
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
  
      if (!res.ok) {
        let msg = res.statusText;
        try {
          const err = await res.json();
          msg = err.message||err.error||msg;
        } catch {}
        throw new Error(msg);
      }
  
      // No necesitamos el JSON de respuesta, ya refrescaremos
      alert(`Producción ${window.editingProductionId?'actualizada':'creada'} exitosamente`);
      await loadProduccionesFromAPI();
      resetForm();
  
    } catch (e) {
      console.error(e);
      alert(`Error: ${e.message}`);
    }
  }
  
  
  // —————— Agregar elemento (Responsable, cultivo…) ——————
  
  function submitAgregarElementoForm() {
    const form = document.getElementById('agregarElementoForm');
    if (!form) return;
    const tipo = form.dataset.tipo;
    let nuevo;
  
    switch(tipo) {
      case 'responsable':
        nuevo = {
          id: String(usuariosData.length+1),
          nombre: document.getElementById('nombreResponsable').value.trim(),
          rol:    document.getElementById('rolResponsable').value.trim()
        };
        usuariosData.push(nuevo);
        loadUsuarios();
        break;
      case 'cultivo':
        nuevo = {
          id: String(cultivosData.length+1),
          nombre: document.getElementById('nombreCultivo').value.trim(),
          description: document.getElementById('descripcionCultivo').value.trim()
        };
        cultivosData.push(nuevo);
        loadCultivos();
        break;
      case 'ciclo':
        nuevo = {
          id: String(ciclosData.length+1),
          nombre: document.getElementById('nombreCiclo').value.trim(),
          duracion: document.getElementById('duracionCiclo').value.trim()
        };
        ciclosData.push(nuevo);
        loadCiclos();
        break;
      case 'sensor':
        nuevo = {
          id: String(sensoresData.length+1),
          nombre: document.getElementById('nombreSensor').value.trim(),
          tipo: document.getElementById('tipoSensor').value.trim(),
          unidad: document.getElementById('unidadSensor').value.trim()
        };
        sensoresData.push(nuevo);
        loadSensores();
        break;
      case 'insumo':
        nuevo = {
          id: String(insumosData.length+1),
          nombre: document.getElementById('nombreInsumo').value.trim(),
          tipo: document.getElementById('tipoInsumo').value.trim(),
          unidad: document.getElementById('unidadInsumo').value.trim(),
          precio: parseFloat(document.getElementById('precioInsumo').value)
        };
        insumosData.push(nuevo);
        loadInsumos();
        break;
    }
  
    alert(`${tipo.charAt(0).toUpperCase()+tipo.slice(1)} agregado exitosamente`);
    form.reset();
    closeAllModals();
  }
  
  
  // —————— Reset, ID y carga inicial ——————
  
  function resetForm() {
    window.editingProductionId = null;
    const frm = document.getElementById('crearProduccionForm');
    if (frm) frm.reset();
    document.getElementById('selectedSensores').innerHTML = '';
    document.getElementById('selectedInsumos').innerHTML = '';
    const btn = document.getElementById('crearProduccion');
    if (btn) btn.textContent = 'Crear Producción';
    generateNextProduccionId();
  }
  

  function generateNextProduccionId() {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2,'0');
    const mm = String(now.getMonth()+1).padStart(2,'0');
    const yy = String(now.getFullYear()).slice(-2);
    let count = produccionesData.length + 1;
    let nextId = `P${yy}${mm}${dd}-${String(count).padStart(3,'0')}`;

    // Verificar unicidad (por si hay conflicto con ID existentes)
    while (produccionesData.some(p => p.id === nextId)) {
      count++;
      nextId = `P${yy}${mm}${dd}-${String(count).padStart(3,'0')}`;
    }

    const idInput = document.getElementById('produccionId');
    if (idInput) idInput.value = nextId;
  }

  // —————— Eventos iniciales ——————

  function initFormEventListeners() {
    const nombreInput = document.getElementById('nombreProduccion');
    if (nombreInput) nombreInput.oninput = validateNombreProduccion;

    const sensoresSelect = document.getElementById('sensores');
    if (sensoresSelect) sensoresSelect.onchange = updateSelectedSensores;

    const insumosSelect = document.getElementById('insumos');
    if (insumosSelect) insumosSelect.onchange = updateSelectedInsumos;

    const selects = document.querySelectorAll('#crearProduccionForm select, #crearProduccionForm input');
    selects.forEach(sel => sel.onchange = updateCreateButtonState);

    updateCreateButtonState();
  }


  async function loadProduccionesFromAPI() {
    try {
      const res = await fetch('/api/producciones');
      if (!res.ok) throw new Error('Error al cargar producciones');
      produccionesData = await res.json();
      updateProduccionesTable();
      updateEstadoTable();
      updateReportesTable();
      updatePagination();
    } catch(e) {
      console.error(e);
      alert('No se pudo cargar producciones');
    }
  }
  
 
  
  // Atar botones
  document.getElementById('crearProduccion')?.addEventListener('click', ()=> submitProduccionForm(false));
  document.getElementById('guardarBorrador')?.addEventListener('click', ()=> submitProduccionForm(true));
  document.getElementById('agregarElementoModal')?.querySelector('.modal__content') // dummy to ensure script loads
  
  // Inicialización
  document.addEventListener('DOMContentLoaded', async ()=>{
    initDatePickers();       // de produccionData.js
    await loadProduccionesFromAPI();
    generateNextProduccionId();
  });
  