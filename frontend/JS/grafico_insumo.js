document.addEventListener('DOMContentLoaded', () => {
    const insumos = [
        { nombre: "Semillas", cantidad: 5 },
        { nombre: "Fertilizante", cantidad: 6 },
        { nombre: "Pesticida", cantidad: 20 },
        { nombre: "Sustrato", cantidad: 3 },
        { nombre: "Herramientas", cantidad: 12 },
        { nombre: "Aspersores", cantidad: 25 },
        { nombre: "Mangueras", cantidad: 22 },
        { nombre: "Mallas protectoras", cantidad: 17 },
        { nombre: "Invernadero de Plástico", cantidad: 12 }
    ];

    const ctx = document.getElementById('insumosChart').getContext('2d');
    const insumosChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: insumos.map(insumo => insumo.nombre),
            datasets: [{
                label: 'Cantidad',
                data: insumos.map(insumo => insumo.cantidad),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                borderRadius: 5,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: {
                    label: ctx => `Cantidad: ${ctx.parsed.y}`
                }}
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Cantidad' }
                },
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    });
});
