document.getElementById("add").onclick = function() {
    window.location.href = "cultivo-agregar.html";
};
document.getElementById("download").onclick = function() {
    window.location.href = "cultivo_informe.html";
};

document.getElementById("listar-cultivos").onclick = function() {
    window.location.href = "/frontend/public/views/components/cultivos.html";
};

document.addEventListener("DOMContentLoaded", function () {
    const createChart = (id, labels, data, colors) => {
        const ctx = document.getElementById(id);
        if (ctx) {
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: colors,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        } else {
            console.error(`No se encontró el canvas con id: ${id}`);
        }
    };

    createChart("chartSiembra", ["Manual", "Mecánica"], [60, 40], ["#3B82F6", "#60A5FA"]);
    createChart("chartCrecimiento", ["Plantas Sanas", "Con Plagas","Enfermas"], [80, 20, 10], ["#10B981", "#FBBF24", "#F43F5E"]);
    createChart("chartCosecha", ["Producción", "Pérdidas","Grano no comerciable"], [70, 30, 10], ["#8B5CF6", "#F87171", "#F43F5E"]);
});