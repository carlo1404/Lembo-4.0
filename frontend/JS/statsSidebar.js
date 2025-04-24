document.addEventListener('DOMContentLoaded', function() {
    // Función para generar datos aleatorios para simulación
    function generateRandomData(hours, min, max) {
        return Array.from({length: hours}, () => 
            Math.floor(Math.random() * (max - min + 1)) + min
        );
    }
    
    // Generar etiquetas de horas para las últimas 24 horas
    const labels = Array.from({length: 24}, (_, i) => {
        const date = new Date();
        date.setHours(date.getHours() - 24 + i);
        return `${date.getHours()}:00`;
    });

    // Configuración común para los gráficos
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: { beginAtZero: false },
            x: { display: true }
        },
        plugins: {
            legend: { display: false }
        }
    };

    // Inicializar gráficos
    const charts = {
        temp: new Chart(document.getElementById('tempChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Temperatura',
                    data: generateRandomData(24, 15, 32),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: commonOptions
        }),
        wind: new Chart(document.getElementById('windChart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Viento',
                    data: generateRandomData(24, 0, 25),
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: commonOptions
        }),
        light: new Chart(document.getElementById('lightChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Luz',
                    data: generateRandomData(24, 0, 1000),
                    borderColor: 'rgba(255, 206, 86, 1)',
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: commonOptions
        })
    };

    // Actualizar datos cada 5 minutos
    setInterval(() => {
        for (let chart of Object.values(charts)) {
            const data = chart.data.datasets[0].data;
            data.shift();
            data.push(generateRandomData(1, 15, 32)[0]);
            chart.update('none');
        }
    }, 300000);
});
