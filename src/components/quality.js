// Quality Component - Supply Quality Management and Defect Tracking
class QualityComponent {
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
        this.dataService.on('inspections-updated', () => this.renderInspections());
        this.dataService.on('defects-updated', () => this.renderDefects());

        // Button event listeners
        const scheduleBtn = document.getElementById('schedule-inspection-btn');
        if (scheduleBtn) {
            scheduleBtn.addEventListener('click', () => this.showScheduleInspectionModal());
        }
    }

    loadData() {
        this.renderInspections();
        this.renderQualityChart();
        this.renderDefects();
    }

    renderInspections() {
        const inspections = this.dataService.getInspections();
        const inspectionList = document.getElementById('inspection-list');
        
        if (!inspectionList) return;

        inspectionList.innerHTML = inspections.map(inspection => `
            <div class="list-item">
                <div class="list-item-content">
                    <div class="list-item-title">${inspection.id} - ${inspection.material}</div>
                    <div class="list-item-subtitle">
                        Supplier: ${inspection.supplier} | Inspector: ${inspection.inspector}
                    </div>
                    <div style="margin-top: 4px;">
                        <span class="status-badge ${this.getInspectionStatusClass(inspection.status)}">
                            ${inspection.status}
                        </span>
                        <span class="status-badge ${this.getPriorityClass(inspection.priority)}" style="margin-left: 8px;">
                            ${inspection.priority} priority
                        </span>
                    </div>
                </div>
                <div class="list-item-meta">
                    <div style="font-weight: 500;">${inspection.scheduledDate}</div>
                    <div style="margin-top: 4px;">
                        <button class="btn btn-sm btn-secondary" onclick="qualityComponent.viewInspection('${inspection.id}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                        ${inspection.status === 'scheduled' ? `
                            <button class="btn btn-sm btn-primary" onclick="qualityComponent.startInspection('${inspection.id}')" style="margin-left: 4px;">
                                <i class="fas fa-play"></i> Start
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderQualityChart() {
        const canvas = document.getElementById('quality-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const qualityData = this.dataService.getQualityMetrics();

        // Destroy existing chart if it exists
        if (this.charts.qualityChart) {
            this.charts.qualityChart.destroy();
        }

        this.charts.qualityChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: qualityData.labels,
                datasets: qualityData.datasets.map(dataset => ({
                    ...dataset,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    borderWidth: 3
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
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.parsed.y}%`;
                            }
                        }
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

    renderDefects() {
        const defects = this.dataService.getDefects();
        const defectList = document.getElementById('defect-list');
        
        if (!defectList) return;

        defectList.innerHTML = defects.map(defect => `
            <div class="list-item">
                <div class="list-item-content">
                    <div class="list-item-title">${defect.id} - ${defect.defectType}</div>
                    <div class="list-item-subtitle">
                        ${defect.supplier} | ${defect.material} | Qty: ${defect.quantity}
                    </div>
                    <div style="margin-top: 4px;">
                        <span class="status-badge ${this.getSeverityClass(defect.severity)}">
                            ${defect.severity} severity
                        </span>
                        <span class="status-badge ${this.getDefectStatusClass(defect.status)}" style="margin-left: 8px;">
                            ${defect.status}
                        </span>
                    </div>
                </div>
                <div class="list-item-meta">
                    <div style="font-weight: 500;">${defect.reportedDate}</div>
                    <div style="margin-top: 4px;">
                        <button class="btn btn-sm btn-secondary" onclick="qualityComponent.viewDefect('${defect.id}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                        ${defect.status === 'open' ? `
                            <button class="btn btn-sm btn-primary" onclick="qualityComponent.updateDefectStatus('${defect.id}', 'investigating')" style="margin-left: 4px;">
                                <i class="fas fa-search"></i> Investigate
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    getInspectionStatusClass(status) {
        const statusMap = {
            'scheduled': 'info',
            'in-progress': 'warning',
            'completed': 'success',
            'cancelled': 'error'
        };
        return statusMap[status] || 'info';
    }

    getPriorityClass(priority) {
        const priorityMap = {
            'low': 'success',
            'medium': 'warning',
            'high': 'error'
        };
        return priorityMap[priority] || 'info';
    }

    getSeverityClass(severity) {
        const severityMap = {
            'low': 'success',
            'medium': 'warning',
            'high': 'error'
        };
        return severityMap[severity] || 'info';
    }

    getDefectStatusClass(status) {
        const statusMap = {
            'open': 'error',
            'investigating': 'warning',
            'resolved': 'success'
        };
        return statusMap[status] || 'info';
    }

    showScheduleInspectionModal() {
        const suppliers = this.dataService.getSuppliers();
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const modalOverlay = document.getElementById('modal-overlay');

        modalTitle.textContent = 'Schedule New Inspection';
        modalBody.innerHTML = `
            <form id="schedule-inspection-form">
                <div class="form-group">
                    <label class="form-label">Supplier</label>
                    <select class="form-select" id="inspection-supplier" required>
                        <option value="">Select Supplier</option>
                        ${suppliers.map(supplier => `
                            <option value="${supplier.name}">${supplier.name}</option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Material</label>
                    <input type="text" class="form-input" id="inspection-material" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Scheduled Date</label>
                    <input type="date" class="form-input" id="inspection-date" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Priority</label>
                    <select class="form-select" id="inspection-priority" required>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Inspector</label>
                    <input type="text" class="form-input" id="inspection-inspector" required>
                </div>
                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-calendar-plus"></i> Schedule Inspection
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="app.closeModal()">
                        Cancel
                    </button>
                </div>
            </form>
        `;

        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById('inspection-date').value = tomorrow.toISOString().split('T')[0];

        // Form submission
        document.getElementById('schedule-inspection-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.scheduleInspection();
        });

        modalOverlay.classList.remove('hidden');
    }

    scheduleInspection() {
        const supplier = document.getElementById('inspection-supplier').value;
        const material = document.getElementById('inspection-material').value;
        const scheduledDate = document.getElementById('inspection-date').value;
        const priority = document.getElementById('inspection-priority').value;
        const inspector = document.getElementById('inspection-inspector').value;

        const inspection = this.dataService.addInspection({
            supplier,
            material,
            scheduledDate,
            priority,
            inspector
        });

        // Add activity
        this.dataService.addActivity({
            title: 'Inspection Scheduled',
            description: `${material} inspection scheduled for ${supplier}`,
            type: 'quality',
            priority: priority
        });

        // Close modal
        window.app.closeModal();

        // Show success message
        this.showNotification('Inspection scheduled successfully', 'success');
    }

    viewInspection(id) {
        const inspection = this.dataService.getInspection(id);
        if (!inspection) return;

        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const modalOverlay = document.getElementById('modal-overlay');

        modalTitle.textContent = `Inspection Details - ${inspection.id}`;
        modalBody.innerHTML = `
            <div class="inspection-details">
                <div class="form-group">
                    <label class="form-label">Supplier</label>
                    <div class="form-value">${inspection.supplier}</div>
                </div>
                <div class="form-group">
                    <label class="form-label">Material</label>
                    <div class="form-value">${inspection.material}</div>
                </div>
                <div class="form-group">
                    <label class="form-label">Status</label>
                    <div class="form-value">
                        <span class="status-badge ${this.getInspectionStatusClass(inspection.status)}">
                            ${inspection.status}
                        </span>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Priority</label>
                    <div class="form-value">
                        <span class="status-badge ${this.getPriorityClass(inspection.priority)}">
                            ${inspection.priority}
                        </span>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Scheduled Date</label>
                    <div class="form-value">${inspection.scheduledDate}</div>
                </div>
                <div class="form-group">
                    <label class="form-label">Inspector</label>
                    <div class="form-value">${inspection.inspector}</div>
                </div>
                ${inspection.result ? `
                    <div class="form-group">
                        <label class="form-label">Result</label>
                        <div class="form-value">
                            <span class="status-badge ${inspection.result === 'passed' ? 'success' : 'error'}">
                                ${inspection.result}
                            </span>
                        </div>
                    </div>
                ` : ''}
                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    ${inspection.status === 'scheduled' ? `
                        <button class="btn btn-primary" onclick="qualityComponent.startInspection('${inspection.id}')">
                            <i class="fas fa-play"></i> Start Inspection
                        </button>
                    ` : ''}
                    ${inspection.status === 'in-progress' ? `
                        <button class="btn btn-success" onclick="qualityComponent.completeInspection('${inspection.id}', 'passed')">
                            <i class="fas fa-check"></i> Mark as Passed
                        </button>
                        <button class="btn btn-error" onclick="qualityComponent.completeInspection('${inspection.id}', 'failed')">
                            <i class="fas fa-times"></i> Mark as Failed
                        </button>
                    ` : ''}
                    <button class="btn btn-secondary" onclick="app.closeModal()">Close</button>
                </div>
            </div>
            <style>
                .inspection-details .form-group {
                    margin-bottom: 1rem;
                }
                .form-value {
                    padding: 0.5rem 0;
                    font-weight: 500;
                }
            </style>
        `;

        modalOverlay.classList.remove('hidden');
    }

    startInspection(id) {
        this.dataService.updateInspection(id, { status: 'in-progress' });
        
        // Add activity
        this.dataService.addActivity({
            title: 'Inspection Started',
            description: `Inspection ${id} is now in progress`,
            type: 'quality',
            priority: 'medium'
        });

        window.app.closeModal();
        this.showNotification('Inspection started', 'success');
    }

    completeInspection(id, result) {
        this.dataService.updateInspection(id, { 
            status: 'completed',
            result: result
        });

        // Add activity
        this.dataService.addActivity({
            title: 'Inspection Completed',
            description: `Inspection ${id} completed with result: ${result}`,
            type: 'quality',
            priority: result === 'passed' ? 'low' : 'high'
        });

        window.app.closeModal();
        this.showNotification(`Inspection completed - ${result}`, result === 'passed' ? 'success' : 'error');
    }

    viewDefect(id) {
        const defect = this.dataService.getDefects().find(d => d.id === id);
        if (!defect) return;

        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const modalOverlay = document.getElementById('modal-overlay');

        modalTitle.textContent = `Defect Details - ${defect.id}`;
        modalBody.innerHTML = `
            <div class="defect-details">
                <div class="form-group">
                    <label class="form-label">Supplier</label>
                    <div class="form-value">${defect.supplier}</div>
                </div>
                <div class="form-group">
                    <label class="form-label">Material</label>
                    <div class="form-value">${defect.material}</div>
                </div>
                <div class="form-group">
                    <label class="form-label">Defect Type</label>
                    <div class="form-value">${defect.defectType}</div>
                </div>
                <div class="form-group">
                    <label class="form-label">Severity</label>
                    <div class="form-value">
                        <span class="status-badge ${this.getSeverityClass(defect.severity)}">
                            ${defect.severity}
                        </span>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Quantity</label>
                    <div class="form-value">${defect.quantity} units</div>
                </div>
                <div class="form-group">
                    <label class="form-label">Status</label>
                    <div class="form-value">
                        <span class="status-badge ${this.getDefectStatusClass(defect.status)}">
                            ${defect.status}
                        </span>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Reported Date</label>
                    <div class="form-value">${defect.reportedDate}</div>
                </div>
                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    ${defect.status === 'open' ? `
                        <button class="btn btn-warning" onclick="qualityComponent.updateDefectStatus('${defect.id}', 'investigating')">
                            <i class="fas fa-search"></i> Start Investigation
                        </button>
                    ` : ''}
                    ${defect.status === 'investigating' ? `
                        <button class="btn btn-success" onclick="qualityComponent.updateDefectStatus('${defect.id}', 'resolved')">
                            <i class="fas fa-check"></i> Mark as Resolved
                        </button>
                    ` : ''}
                    <button class="btn btn-secondary" onclick="app.closeModal()">Close</button>
                </div>
            </div>
        `;

        modalOverlay.classList.remove('hidden');
    }

    updateDefectStatus(id, status) {
        this.dataService.updateDefect(id, { status });
        
        // Add activity
        this.dataService.addActivity({
            title: 'Defect Status Updated',
            description: `Defect ${id} status changed to ${status}`,
            type: 'quality',
            priority: status === 'resolved' ? 'low' : 'medium'
        });

        window.app.closeModal();
        this.showNotification(`Defect status updated to ${status}`, 'success');
    }

    showNotification(message, type) {
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem;
            border-radius: 8px;
            color: white;
            z-index: 9999;
            font-weight: 500;
            background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            transform: translateX(100%);
            transition: transform 0.3s ease-in-out;
        `;

        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Method to refresh all data
    refresh() {
        this.loadData();
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

// Initialize quality component when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.qualityComponent = new QualityComponent();
});