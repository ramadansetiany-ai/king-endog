/**
 * ENDOGHAYAM - Analytics & Chart.js Visualizations
 */

const AppCharts = {
    salesChartInstance: null,
    categoryChartInstance: null,

    initCharts() {
        this.renderSalesTrendChart();
        this.renderCategoryDistributionChart();
    },

    renderSalesTrendChart() {
        const canvas = document.getElementById("salesTrendChart");
        if (!canvas) return;

        if (this.salesChartInstance) {
            this.salesChartInstance.destroy();
        }

        // Data 7 hari terakhir
        const labels = ["13 Okt", "14 Okt", "15 Okt", "16 Okt", "17 Okt", "18 Okt", "19 Okt (Hari Ini)"];
        const dataValues = [1420000, 1890000, 2150000, 1780000, 2640000, 3120000, 849000];

        const ctx = canvas.getContext("2d");
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, "rgba(245, 158, 11, 0.45)");
        gradient.addColorStop(1, "rgba(245, 158, 11, 0.0)");

        this.salesChartInstance = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Omset Penjualan (Rp)",
                    data: dataValues,
                    borderColor: "#d97706",
                    backgroundColor: gradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.35,
                    pointBackgroundColor: "#f59e0b",
                    pointBorderColor: "#ffffff",
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return "Omset: Rp " + context.parsed.y.toLocaleString("id-ID");
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return "Rp " + (value / 1000).toLocaleString("id-ID") + "k";
                            },
                            font: { size: 11 }
                        },
                        grid: {
                            color: "rgba(229, 231, 235, 0.6)"
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: { size: 11 }
                        }
                    }
                }
            }
        });
    },

    renderCategoryDistributionChart() {
        const canvas = document.getElementById("categoryChart");
        if (!canvas) return;

        if (this.categoryChartInstance) {
            this.categoryChartInstance.destroy();
        }

        const products = StoreData.getProducts();
        const categoryCounts = {};

        products.forEach(p => {
            categoryCounts[p.category] = (categoryCounts[p.category] || 0) + p.stock;
        });

        const labels = Object.keys(categoryCounts);
        const dataValues = Object.values(categoryCounts);

        const ctx = canvas.getContext("2d");
        this.categoryChartInstance = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: labels,
                datasets: [{
                    data: dataValues,
                    backgroundColor: [
                        "#f59e0b", // Amber
                        "#10b981", // Emerald
                        "#3b82f6", // Blue
                        "#8b5cf6", // Purple
                        "#ec4899"  // Pink
                    ],
                    borderWidth: 2,
                    borderColor: "#ffffff"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            boxWidth: 12,
                            font: { size: 11 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ` ${context.label}: ${context.parsed.toLocaleString("id-ID")} unit stok`;
                            }
                        }
                    }
                },
                cutout: "68%"
            }
        });
    }
};

window.AppCharts = AppCharts;
