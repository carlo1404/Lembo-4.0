document.getElementById("back").onclick = function() {
    window.location.href = "home.html";
};

const asociaciones = [];
// Función para agregar una nueva asociación
function agregarAsociacion() {
    const sensor = document.getElementById('sensor').value;
    const insumo = document.getElementById('insumo').value;
    const ciclo = document.getElementById('ciclo').value;
    const usuario = document.getElementById('usuario').value;

    asociaciones.push({
        sensor, 
        insumo, 
        ciclo, 
        usuario, 
        habilitado: true
    });

    listarAsociaciones();
}

// Función para listar todas las asociaciones
function listarAsociaciones() {
    const contenedor = document.getElementById('asociaciones');
    contenedor.innerHTML = '';

    asociaciones.forEach((a, index) => {
        const item = document.createElement('div');
        item.className = 'association-item';

        item.innerHTML = `
          <span>${a.sensor} - ${a.insumo} - ${a.ciclo} - ${a.usuario}</span>
          <span class="status ${a.habilitado ? 'enabled' : 'disabled'}">
            ${a.habilitado ? 'Habilitado' : 'Deshabilitado'}
          </span>
        `;

        item.onclick = () => {
            a.habilitado = !a.habilitado;
            listarAsociaciones();
        };

        contenedor.appendChild(item);
    });
}

// Inicialización de gráficos (se ejecuta cuando el DOM está cargado)
document.addEventListener('DOMContentLoaded', function() {
    // Función para generar datos aleatorios simulados
    function generateRandomData(hours, min, max) {
        return Array.from({length: hours}, () => 
            Math.floor(Math.random() * (max - min + 1)) + min
        );
    }
    
    // Generar etiquetas de horas para las últimas 24 horas
    const now = new Date();
    const labels = Array.from({length: 24}, (_, i) => {
        const date = new Date(now);
        date.setHours(now.getHours() - 24 + i);
        return date.getHours() + ':00';
    });
    
    // Configuración común para los gráficos
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: false
            }
        }
    };
    
    // Gráfico de Temperatura
    const tempCtx = document.getElementById('tempChart').getContext('2d');
    const tempChart = new Chart(tempCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperatura',
                data: generateRandomData(24, 15, 32),
                borderColor: 'rgba(239, 68, 67, 1)',
                backgroundColor: 'rgba(239, 68, 67, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: chartOptions
    });
    
    // Gráfico de Viento
    const windCtx = document.getElementById('windChart').getContext('2d');
    const windChart = new Chart(windCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Velocidad del Viento',
                data: generateRandomData(24, 0, 25),
                backgroundColor: 'rgba(80, 229, 249, 0.7)',
                borderColor: 'rgba(80, 229, 249, 1)',
                borderWidth: 1
            }]
        },
        options: chartOptions
    });
    
    // Gráfico de Luz
    const lightCtx = document.getElementById('lightChart').getContext('2d');
    const lightChart = new Chart(lightCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Intensidad Lumínica',
                data: generateRandomData(24, 0, 10000),
                borderColor: 'rgba(253, 195, 0, 1)',
                backgroundColor: 'rgba(253, 195, 0, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: chartOptions
    });
    
    // Simular actualización de datos en tiempo real
    setInterval(() => {
        // Actualizar temperatura
        const tempData = tempChart.data.datasets[0].data;
        tempData.shift();
        tempData.push(Math.floor(Math.random() * (32 - 15 + 1)) + 15);
        tempChart.update();
        
        // Actualizar viento
        const windData = windChart.data.datasets[0].data;
        windData.shift();
        windData.push(Math.floor(Math.random() * 26));
        windChart.update();
        
        // Actualizar luz (simulando ciclo día/noche)
        const lightData = lightChart.data.datasets[0].data;
        lightData.shift();
        const hour = new Date().getHours();
        const newValue = hour > 6 && hour < 20 ? 
            Math.floor(Math.random() * 5000) + 5000 : 
            Math.floor(Math.random() * 1000);
        lightData.push(newValue);
        lightChart.update();
        
        // Rotar etiquetas
        const newLabel = new Date().getHours() + ':00';
        labels.shift();
        labels.push(newLabel);
    }, 5000);
});