// validar-produccion.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-production");
    const btnSubmit = form.querySelector('button[type="submit"]');
  
    // Campos
    const idField         = document.getElementById("production-id");
    const nameField       = document.getElementById("production-name");
    const responsibleSel  = document.getElementById("responsible");
    const cultivoSel      = document.getElementById("cultivo");
    const cicloField      = document.getElementById("ciclo");
    const sensoresSel     = document.getElementById("sensores");
    const insumosSel      = document.getElementById("insumos");
    const zonaSel         = document.getElementById("zona");
    const inicioField     = document.getElementById("fecha-inicio");
    const finField        = document.getElementById("fecha-fin");
  
    // Helper: comprueba longitud y patrón del nombre
    function validaNombre() {
      const v = nameField.value.trim();
      if (v.length < 3 || v.length > 100) return false;
      if (!/[A-Za-z]/.test(v)) return false;
      return true;
    }
  
    // Validar selects mínimos/máximos
    function validaSelect(sel, min=1, max=Infinity) {
      const count = sel.multiple 
        ? sel.selectedOptions.length 
        : (sel.value ? 1 : 0);
      return count >= min && count <= max;
    }
  
    // Valida fechas
    function validaFechas() {
      const inicio = inicioField.value;
      const fin    = finField.value;
      if (!inicio || !fin) return false;
      return (new Date(fin) >= new Date(inicio));
    }
  
    // Activa o desactiva el botón Crear
    function toggleSubmit() {
      const ok = 
        idField.value.trim().length > 0 &&
        validaNombre() &&
        validaSelect(responsibleSel,1,1) &&
        validaSelect(cultivoSel,1,1) &&
        cicloField.value.trim().length > 0 &&
        validaSelect(sensoresSel,1,3) &&
        validaSelect(insumosSel,1,Infinity) &&
        validaSelect(zonaSel,1,1) &&
        validaFechas();
      btnSubmit.disabled = !ok;
    }
  
    // Asociar listeners
    [
      nameField,
      responsibleSel,
      cultivoSel,
      cicloField,
      sensoresSel,
      insumosSel,
      zonaSel,
      inicioField,
      finField
    ].forEach(el => {
      el.addEventListener("input", toggleSubmit);
      el.addEventListener("change", toggleSubmit);
    });
  
    // Inicial
    toggleSubmit();
  
    // Evita envío si invalid
    form.addEventListener("submit", e => {
      if (btnSubmit.disabled) {
        e.preventDefault();
        alert("Por favor, verifica los campos obligatorios y las validaciones.");
      }
    });
  });
  