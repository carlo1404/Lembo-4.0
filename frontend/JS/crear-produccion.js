document.addEventListener("DOMContentLoaded", () => {
    // Inicialización fechas
    const inicio = document.getElementById("fecha-inicio");
    const fin    = document.getElementById("fecha-fin");
    const hoy    = new Date().toISOString().split("T")[0];
  
    inicio.value = hoy;
    inicio.min   = hoy;
    fin.min      = hoy;
  
    inicio.addEventListener("change", () => {
      fin.min = inicio.value;
    });
  
    // Botón Agregar Otra
    document.getElementById("add-another").addEventListener("click", () => {
      alert("¿Deseas agregar otra producción?");
    });
  
    // Lógica de Inversión Recomendada
    const insumosSelect = document.getElementById("insumos");
    const cantidadInput = document.getElementById("cantidad");
    const sensoresSelect = document.getElementById("sensores");
    const cultivoSelect  = document.getElementById("cultivo");
    const inversionInput = document.getElementById("inversion");
  
    function calcularInversion() {
      // 1. Total insumos: precio unitario * cantidad
      const cantidad = parseFloat(cantidadInput.value) || 0;
      let totalInsumos = 0;
      Array.from(insumosSelect.selectedOptions).forEach(opt => {
        const price = parseFloat(opt.dataset.price) || 0;
        totalInsumos += price * cantidad;
      });
  
      // 2. Factor sensores: +5% por sensor
      const numSensores = sensoresSelect.selectedOptions.length;
      const factorSensores = 1 + (numSensores * 0.05);
  
      // 3. Factor cultivo desde data-factor de la opción seleccionada
      const selectedCultivo = cultivoSelect.selectedOptions[0];
      const cultivoFactor = selectedCultivo
        ? parseFloat(selectedCultivo.dataset.factor) || 1
        : 1;
  
      // 4. Cálculo final
      const inversionRecomendada = totalInsumos * factorSensores * cultivoFactor;
      inversionInput.value = inversionRecomendada.toFixed(2);
    }
  
    // Escuchar cambios
    insumosSelect.addEventListener("change", calcularInversion);
    cantidadInput.addEventListener("input", calcularInversion);
    sensoresSelect.addEventListener("change", calcularInversion);
    cultivoSelect.addEventListener("change", calcularInversion);
  
    // Inicializa cálculo
    calcularInversion();
  });

  // Captura el submit y redirige
document.getElementById("form-production").addEventListener("submit", function(e) {
    e.preventDefault();             // Evita recarga
    // Aquí podrías validar / enviar datos…
    window.location.href = "/frontend/public/views/produccion.html";
  });
  
  