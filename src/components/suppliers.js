// Suppliers Component - Supplier Network Optimization and Risk Assessment
class SuppliersComponent {
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
        this.dataService.on('suppliers-updated', () => this.renderSuppliers());

        // Button event listeners
        const addSupplierBtn = document.getElementById('add-supplier-btn');
        if (addSupplierBtn) {
            addSupplierBtn.addEventListener('click', () => this.showAddSupplierModal());
        }
    }

    loadData() {
        this.renderSuppliers();
        this.renderRiskChart();
        this.renderRankings();
    }

    renderSuppliers() {
        const suppliers = this.dataService.getSuppliers();
        const supplierList = document.getElementById('supplier-list');
        
        if (!supplierList) return;

        supplierList.innerHTML = suppliers.map(supplier => `
            <div class="list-item">
                <div class="list-item-content">
                    <div class="list-item-title">${supplier.name}</div>
                    <div class="list-item-subtitle">
                        ${supplier.category} | ${supplier.location} | ${supplier.contracts} contracts
                    </div>
                    <div style="margin-top: 4px;">
                        <span class="status-badge ${this.getStatusClass(supplier.status)}">
                            ${supplier.status}
                        </span>
                        <span class="status-badge ${this.getRiskClass(supplier.riskScore)}" style="margin-left: 8px;">
                            ${supplier.riskScore} risk
                        </span>
                        <span style="margin-left: 8px; font-size: 0.875rem;">
                            Rating: ${this.renderStars(supplier.rating)}
                        </span>
                    </div>
                </div>
                <div class="list-item-meta">
                    <div style="font-weight: 500;">${supplier.totalSpend}</div>
                    <div style="margin-top: 4px;">
                        <button class="btn btn-sm btn-secondary" onclick="suppliersComponent.viewSupplier('${supplier.id}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="suppliersComponent.assessSupplier('${supplier.id}')" style="margin-left: 4px;">
                            <i class="fas fa-chart-line"></i> Assess
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderRiskChart() {
        const canvas = document.getElementById('risk-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const riskData = this.dataService.getRiskData();

        // Destroy existing chart if it exists
        if (this.charts.riskChart) {
            this.charts.riskChart.destroy();
        }

        this.charts.riskChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: riskData.labels,
                datasets: [{
                    data: riskData.datasets[0].data,
                    backgroundColor: riskData.datasets[0].backgroundColor,
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
                                return `${context.label}: ${percentage}%`;
                            }
                        }
                    }
                }
            }
        });
    }

    renderRankings() {
        const rankings = this.dataService.getSupplierRankings();
        const rankingList = document.getElementById('ranking-list');
        
        if (!rankingList) return;

        rankingList.innerHTML = rankings.map(ranking => `
            <div class="list-item">
                <div class="list-item-content">
                    <div class="list-item-title">
                        <span class="rank-badge">#${ranking.rank}</span>
                        ${ranking.supplier}
                    </div>
                    <div class="list-item-subtitle">
                        ${ranking.category} | Score: ${ranking.score}
                    </div>
                    <div style="margin-top: 4px;">
                        <div class="score-bar">
                            <div class="score-fill" style="width: ${ranking.score}%"></div>
                        </div>
                    </div>
                </div>
                <div class="list-item-meta">
                    <div class="score-change ${ranking.change.startsWith('+') ? 'positive' : 'negative'}">
                        ${ranking.change}
                    </div>
                </div>
            </div>
        `).join('');
    }

    getStatusClass(status) {
        const statusMap = {
            'active': 'success',
            'pending': 'warning',
            'inactive': 'error',
            'suspended': 'error'
        };
        return statusMap[status] || 'info';
    }

    getRiskClass(risk) {
        const riskMap = {
            'low': 'success',
            'medium': 'warning',
            'high': 'error',
            'unknown': 'info'
        };
        return riskMap[risk] || 'info';
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star" style="color: #f59e0b;"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt" style="color: #f59e0b;"></i>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star" style="color: #d1d5db;"></i>';
        }
        
        return `${stars} (${rating})`;
    }

    showAddSupplierModal() {
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const modalOverlay = document.getElementById('modal-overlay');

        modalTitle.textContent = 'Add New Supplier';
        modalBody.innerHTML = `
            <form id="add-supplier-form">
                <div class="form-group">
                    <label class="form-label">Supplier Name</label>
                    <input type="text" class="form-input" id="supplier-name" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Category</label>
                    <select class="form-select" id="supplier-category" required>
                        <option value="">Select Category</option>
                        <option value="Raw Materials">Raw Materials</option>
                        <option value="Components">Components</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Services">Services</option>
                        <option value="Software">Software</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Location</label>
                    <input type="text" class="form-input" id="supplier-location" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Contact Email</label>
                    <input type="email" class="form-input" id="supplier-email" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Contact Phone</label>
                    <input type="tel" class="form-input" id="supplier-phone" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea class="form-textarea" id="supplier-description" placeholder="Brief description of supplier capabilities"></textarea>
                </div>
                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-plus"></i> Add Supplier
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="app.closeModal()">
                        Cancel
                    </button>
                </div>
            </form>
        `;

        // Form submission
        document.getElementById('add-supplier-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addSupplier();
        });

        modalOverlay.classList.remove('hidden');
    }

    addSupplier() {
        const name = document.getElementById('supplier-name').value;
        const category = document.getElementById('supplier-category').value;
        const location = document.getElementById('supplier-location').value;
        const email = document.getElementById('supplier-email').value;
        const phone = document.getElementById('supplier-phone').value;
        const description = document.getElementById('supplier-description').value;

        const supplier = this.dataService.addSupplier({
            name,
            category,
            location,
            email,
            phone,
            description
        });

        // Add activity
        this.dataService.addActivity({
            title: 'New Supplier Added',
            description: `${name} has been added to the supplier network`,
            type: 'supplier',
            priority: 'medium'
        });

        window.app.closeModal();
        this.showNotification('Supplier added successfully', 'success');
    }

    viewSupplier(id) {
        const supplier = this.dataService.getSupplier(id);
        if (!supplier) return;

        const metrics = this.dataService.calculateSupplierMetrics(id);
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const modalOverlay = document.getElementById('modal-overlay');

        modalTitle.textContent = `Supplier Details - ${supplier.name}`;
        modalBody.innerHTML = `
            <div class="supplier-details">
                <div class="supplier-header">
                    <div class="supplier-info">
                        <h3>${supplier.name}</h3>
                        <p>${supplier.category} | ${supplier.location}</p>
                        <div style="margin-top: 8px;">
                            <span class="status-badge ${this.getStatusClass(supplier.status)}">
                                ${supplier.status}
                            </span>
                            <span class="status-badge ${this.getRiskClass(supplier.riskScore)}" style="margin-left: 8px;">
                                ${supplier.riskScore} risk
                            </span>
                        </div>
                    </div>
                    <div class="supplier-rating">
                        <div class="rating-display">
                            ${this.renderStars(supplier.rating)}
                        </div>
                    </div>
                </div>
                
                <div class="supplier-metrics">
                    <h4>Performance Metrics</h4>
                    <div class="metrics-grid">
                        <div class="metric-card">
                            <span class="metric-value">${supplier.performance.quality}%</span>
                            <span class="metric-label">Quality Score</span>
                        </div>
                        <div class="metric-card">
                            <span class="metric-value">${supplier.performance.delivery}%</span>
                            <span class="metric-label">Delivery Performance</span>
                        </div>
                        <div class="metric-card">
                            <span class="metric-value">${supplier.performance.cost}%</span>
                            <span class="metric-label">Cost Competitiveness</span>
                        </div>
                        <div class="metric-card">
                            <span class="metric-value">${supplier.totalSpend}</span>
                            <span class="metric-label">Total Spend</span>
                        </div>
                    </div>
                </div>

                <div class="supplier-contracts">
                    <h4>Contract Information</h4>
                    <div class="contract-info">
                        <div>Active Contracts: <strong>${supplier.contracts}</strong></div>
                        <div>Last Order: <strong>${supplier.lastOrder || 'None'}</strong></div>
                    </div>
                </div>

                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <button class="btn btn-primary" onclick="suppliersComponent.editSupplier('${supplier.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-warning" onclick="suppliersComponent.assessSupplier('${supplier.id}')">
                        <i class="fas fa-chart-line"></i> Risk Assessment
                    </button>
                    <button class="btn btn-secondary" onclick="app.closeModal()">Close</button>
                </div>
            </div>
            <style>
                .supplier-details {
                    max-width: 600px;
                }
                .supplier-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 2rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid var(--border-color);
                }
                .supplier-info h3 {
                    margin: 0 0 0.5rem 0;
                    color: var(--primary-color);
                }
                .supplier-info p {
                    margin: 0;
                    color: var(--text-secondary);
                }
                .rating-display {
                    text-align: right;
                }
                .supplier-metrics h4, .supplier-contracts h4 {
                    margin: 0 0 1rem 0;
                    color: var(--text-primary);
                }
                .metrics-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                    margin-bottom: 2rem;
                }
                .metric-card {
                    background-color: var(--background-color);
                    padding: 1rem;
                    border-radius: var(--border-radius);
                    text-align: center;
                }
                .metric-value {
                    display: block;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--primary-color);
                }
                .metric-label {
                    display: block;
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                    margin-top: 0.25rem;
                }
                .contract-info {
                    background-color: var(--background-color);
                    padding: 1rem;
                    border-radius: var(--border-radius);
                }
                .contract-info div {
                    margin-bottom: 0.5rem;
                }
                .contract-info div:last-child {
                    margin-bottom: 0;
                }
            </style>
        `;

        modalOverlay.classList.remove('hidden');
    }

    assessSupplier(id) {
        const supplier = this.dataService.getSupplier(id);
        if (!supplier) return;

        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const modalOverlay = document.getElementById('modal-overlay');

        modalTitle.textContent = `Risk Assessment - ${supplier.name}`;
        modalBody.innerHTML = `
            <div class="risk-assessment">
                <div class="assessment-overview">
                    <div class="risk-score-display">
                        <div class="risk-score ${supplier.riskScore}">
                            ${supplier.riskScore.toUpperCase()}
                        </div>
                        <div class="risk-label">Overall Risk Score</div>
                    </div>
                </div>

                <div class="risk-factors">
                    <h4>Risk Factors Analysis</h4>
                    <div class="factor-list">
                        <div class="factor-item">
                            <span class="factor-name">Financial Stability</span>
                            <div class="factor-score">
                                <div class="score-bar">
                                    <div class="score-fill" style="width: 85%; background-color: #10b981;"></div>
                                </div>
                                <span class="score-text">85%</span>
                            </div>
                        </div>
                        <div class="factor-item">
                            <span class="factor-name">Geographic Risk</span>
                            <div class="factor-score">
                                <div class="score-bar">
                                    <div class="score-fill" style="width: 60%; background-color: #f59e0b;"></div>
                                </div>
                                <span class="score-text">60%</span>
                            </div>
                        </div>
                        <div class="factor-item">
                            <span class="factor-name">Performance History</span>
                            <div class="factor-score">
                                <div class="score-bar">
                                    <div class="score-fill" style="width: 92%; background-color: #10b981;"></div>
                                </div>
                                <span class="score-text">92%</span>
                            </div>
                        </div>
                        <div class="factor-item">
                            <span class="factor-name">Compliance Record</span>
                            <div class="factor-score">
                                <div class="score-bar">
                                    <div class="score-fill" style="width: 78%; background-color: #10b981;"></div>
                                </div>
                                <span class="score-text">78%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="recommendations">
                    <h4>Recommendations</h4>
                    <div class="recommendation-list">
                        <div class="recommendation-item">
                            <i class="fas fa-check-circle" style="color: #10b981;"></i>
                            <span>Continue partnership with regular monitoring</span>
                        </div>
                        <div class="recommendation-item">
                            <i class="fas fa-exclamation-triangle" style="color: #f59e0b;"></i>
                            <span>Consider geographic diversification for critical components</span>
                        </div>
                        <div class="recommendation-item">
                            <i class="fas fa-info-circle" style="color: #3b82f6;"></i>
                            <span>Schedule quarterly performance reviews</span>
                        </div>
                    </div>
                </div>

                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <button class="btn btn-primary" onclick="suppliersComponent.updateRiskScore('${supplier.id}')">
                        <i class="fas fa-sync"></i> Update Assessment
                    </button>
                    <button class="btn btn-secondary" onclick="suppliersComponent.exportAssessment('${supplier.id}')">
                        <i class="fas fa-download"></i> Export Report
                    </button>
                    <button class="btn btn-secondary" onclick="app.closeModal()">Close</button>
                </div>
            </div>
            <style>
                .risk-assessment {
                    max-width: 600px;
                }
                .assessment-overview {
                    text-align: center;
                    margin-bottom: 2rem;
                    padding: 1.5rem;
                    background-color: var(--background-color);
                    border-radius: var(--border-radius);
                }
                .risk-score-display {
                    display: inline-block;
                }
                .risk-score {
                    font-size: 2rem;
                    font-weight: 700;
                    padding: 1rem 2rem;
                    border-radius: var(--border-radius);
                    margin-bottom: 0.5rem;
                }
                .risk-score.low {
                    background-color: #dcfce7;
                    color: #166534;
                }
                .risk-score.medium {
                    background-color: #fef3c7;
                    color: #92400e;
                }
                .risk-score.high {
                    background-color: #fee2e2;
                    color: #991b1b;
                }
                .risk-label {
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                }
                .risk-factors h4, .recommendations h4 {
                    margin: 0 0 1rem 0;
                    color: var(--text-primary);
                }
                .factor-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 1rem;
                    gap: 1rem;
                }
                .factor-name {
                    min-width: 150px;
                    font-weight: 500;
                }
                .factor-score {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .score-bar {
                    flex: 1;
                    height: 8px;
                    background-color: var(--border-color);
                    border-radius: 4px;
                    overflow: hidden;
                }
                .score-fill {
                    height: 100%;
                    transition: width 0.3s ease;
                }
                .score-text {
                    min-width: 40px;
                    font-weight: 500;
                    font-size: 0.875rem;
                }
                .recommendation-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                    margin-bottom: 0.75rem;
                    padding: 0.75rem;
                    background-color: var(--background-color);
                    border-radius: var(--border-radius);
                }
                .recommendation-item:last-child {
                    margin-bottom: 0;
                }
            </style>
        `;

        modalOverlay.classList.remove('hidden');
    }

    updateRiskScore(id) {
        // Simulate risk score update
        const supplier = this.dataService.getSupplier(id);
        if (!supplier) return;

        // Add activity
        this.dataService.addActivity({
            title: 'Risk Assessment Updated',
            description: `Risk assessment for ${supplier.name} has been updated`,
            type: 'supplier',
            priority: 'medium'
        });

        window.app.closeModal();
        this.showNotification('Risk assessment updated', 'success');
    }

    showNotification(message, type) {
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

    refresh() {
        this.loadData();
    }

    destroy() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
    }
}

// Add required CSS for rankings
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .rank-badge {
            background-color: var(--primary-color);
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-weight: 600;
            font-size: 0.75rem;
            margin-right: 0.5rem;
        }
        .score-bar {
            width: 100px;
            height: 6px;
            background-color: var(--border-color);
            border-radius: 3px;
            overflow: hidden;
        }
        .score-fill {
            height: 100%;
            background-color: var(--primary-color);
            transition: width 0.3s ease;
        }
        .score-change.positive {
            color: var(--success-color);
        }
        .score-change.negative {
            color: var(--error-color);
        }
    `;
    document.head.appendChild(style);
    
    window.suppliersComponent = new SuppliersComponent();
});