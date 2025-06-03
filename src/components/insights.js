// Insights Component - Procurement Dashboard and KPIs
class InsightsComponent {
    constructor() {
        this.dataService = window.dataService;
        this.charts = {};
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadData();
    }

    bindEvents() {
        // Listen for data updates
        this.dataService.on('kpis-updated', () => this.renderKPIs());
        this.dataService.on('activities-updated', () => this.renderActivities());
    }

    loadData() {
        this.renderKPIs();
        this.renderSpendChart();
        this.renderSupplierPerformanceChart();
        this.renderActivities();
    }

    renderKPIs() {
        const kpis = this.dataService.getKPIs();
        const kpiGrid = document.getElementById('kpi-grid');
        
        if (!kpiGrid) return;

        kpiGrid.innerHTML = kpis.map(kpi => `
            <div class="kpi-item">
                <span class="kpi-value">${kpi.value}</span>
                <div class="kpi-label">${kpi.label}</div>
                <div class="kpi-change ${kpi.trend}">${kpi.change}</div>
            </div>
        `).join('');
    }

    renderSpendChart() {
        const canvas = document.getElementById('spend-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const spendData = this.dataService.getSpendData();

        // Destroy existing chart if it exists
        if (this.charts.spendChart) {
            this.charts.spendChart.destroy();
        }

        this.charts.spendChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: spendData.categories,
                datasets: [{
                    data: spendData.amounts,
                    backgroundColor: [
                        '#3b82f6',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444',
                        '#8b5cf6'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${context.label}: $${value.toLocaleString()} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    renderSupplierPerformanceChart() {
        const canvas = document.getElementById('supplier-performance-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const performanceData = this.dataService.getSupplierPerformance();

        // Destroy existing chart if it exists
        if (this.charts.performanceChart) {
            this.charts.performanceChart.destroy();
        }

        this.charts.performanceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: performanceData.labels,
                datasets: performanceData.datasets.map(dataset => ({
                    ...dataset,
                    borderWidth: 1,
                    borderRadius: 4
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }

    renderActivities() {
        const activities = this.dataService.getActivities();
        const activityList = document.getElementById('activity-list');
        
        if (!activityList) return;

        activityList.innerHTML = activities.slice(0, 10).map(activity => `
            <div class="list-item">
                <div class="list-item-content">
                    <div class="list-item-title">${activity.title}</div>
                    <div class="list-item-subtitle">${activity.description}</div>
                </div>
                <div class="list-item-meta">
                    <div class="status-badge ${this.getActivityStatusClass(activity.type)}">${activity.type}</div>
                    <div style="margin-top: 4px; font-size: 0.75rem; color: var(--text-secondary);">
                        ${activity.timestamp}
                    </div>
                </div>
            </div>
        `).join('');
    }

    getActivityStatusClass(type) {
        const statusMap = {
            'contract': 'info',
            'quality': 'success',
            'supplier': 'info',
            'purchase': 'warning',
            'delivery': 'error'
        };
        return statusMap[type] || 'info';
    }

    // Method to refresh all charts and data
    refresh() {
        this.loadData();
    }

    // Method to export insights data
    exportData() {
        const data = {
            kpis: this.dataService.getKPIs(),
            spendData: this.dataService.getSpendData(),
            supplierPerformance: this.dataService.getSupplierPerformance(),
            activities: this.dataService.getActivities()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'procurement-insights.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Method to handle real-time updates
    updateKPI(id, newValue, change, trend) {
        this.dataService.updateKPI(id, newValue);
        
        // Add activity for KPI update
        this.dataService.addActivity({
            title: `KPI Updated: ${id}`,
            description: `New value: ${newValue} (${change})`,
            type: 'analytics',
            priority: 'low'
        });
    }

    // Cleanup method
    destroy() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
    }
}

// Initialize insights component when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.insightsComponent = new InsightsComponent();
});