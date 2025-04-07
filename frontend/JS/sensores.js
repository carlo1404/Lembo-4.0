document.getElementById("listar-sensor").onclick = function() {
    window.location.href = "listar-sensor.html";
};

const timeLabels = ['08:00', '10:00', '12:00', '14:00', '16:00'];

const lightChart = new Chart(document.getElementById('lightChart'), {
    type: 'line',
    data: {
        labels: timeLabels,
        datasets: [{
            label: 'Intensidad (lux)',
            data: [200, 500, 800, 600, 300],
            borderColor: 'gold',
            backgroundColor: 'rgba(255, 215, 0, 0.2)',
            tension: 0.4,
            fill: true,
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: { beginAtZero: true }
        }
    }
});

const tempChart = new Chart(document.getElementById('tempChart'), {
    type: 'line',
    data: {
        labels: timeLabels,
        datasets: [{
            label: 'Temperatura (°C)',
            data: [18, 22, 26, 25, 21],
            borderColor: '#f87171',
            backgroundColor: 'rgba(248,113,113,0.2)',
            tension: 0.4,
            fill: true,
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: { beginAtZero: false }
        }
    }
});

const humidityChart = new Chart(document.getElementById('humidityChart'), {
    type: 'line',
    data: {
        labels: timeLabels,
        datasets: [{
            label: 'Humedad (%)',
            data: [55, 60, 65, 62, 58],
            borderColor: '#60a5fa',
            backgroundColor: 'rgba(96,165,250,0.2)',
            tension: 0.4,
            fill: true,
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: { beginAtZero: true }
        }
    }
});
