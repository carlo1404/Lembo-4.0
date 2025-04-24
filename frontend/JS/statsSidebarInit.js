document.addEventListener('DOMContentLoaded', function() {
    // Generar datos aleatorios para simulación
    function generateRandomData(hours, min, max) {
        return Array.from({length: hours}, () => 
            Math.floor(Math.random() * (max - min + 1)) + min
        );
    }

    // Crear etiquetas de tiempo para las últimas 24 horas
    const labels = Array.from({length: 24}, (_, i) => {
        const date = new Date();
        date.setHours(date.getHours() - 24 + i);
        return `${date.getHours()}:00`;
    });

    // Configuración común para todos los gráficos
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    };

    // Inicializar los gráficos
    const charts = {
        temp: new Chart(document.getElementById('tempChart'), {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    data: generateRandomData(24, 15, 35),
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: commonOptions
        }),

        wind: new Chart(document.getElementById('windChart'), {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    data: generateRandomData(24, 0, 25),
                    backgroundColor: '#3b82f6',
                    borderColor: '#2563eb',
                    borderWidth: 1
                }]
            },
            options: commonOptions
        }),

        light: new Chart(document.getElementById('lightChart'), {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    data: generateRandomData(24, 0, 1000),
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: commonOptions
        })
    };

    // Actualizar datos cada 30 segundos
    setInterval(() => {
        Object.values(charts).forEach(chart => {
            const data = chart.data.datasets[0].data;
            data.shift();
            data.push(generateRandomData(1, 15, 35)[0]);
            chart.update('none');
        });
    }, 30000);
});
