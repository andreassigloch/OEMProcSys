// Contracts Component - Contract Negotiation and Scenario Modeling
class ContractsComponent {
    constructor() {
        this.dataService = window.dataService;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadData();
    }

    bindEvents() {
        // Listen for data updates
        this.dataService.on('negotiations-updated', () => this.renderNegotiations());
        this.dataService.on('scenarios-updated', () => this.renderScenarios());

        // Button event listeners
        const newNegotiationBtn = document.getElementById('new-negotiation-btn');
        if (newNegotiationBtn) {
            newNegotiationBtn.addEventListener('click', () => this.showNewNegotiationModal());
        }
    }

    loadData() {
        this.renderNegotiations();
        this.renderContractComparison();
        this.renderScenarios();
    }

    renderNegotiations() {
        const negotiations = this.dataService.getNegotiations();
        const negotiationsList = document.getElementById('negotiations-list');
        
        if (!negotiationsList) return;

        negotiationsList.innerHTML = negotiations.map(negotiation => `
            <div class="list-item">
                <div class="list-item-content">
                    <div class="list-item-title">${negotiation.title}</div>
                    <div class="list-item-subtitle">
                        ${negotiation.supplier} | Value: ${negotiation.value} | Negotiator: ${negotiation.negotiator}
                    </div>
                    <div style="margin-top: 4px;">
                        <span class="status-badge ${this.getNegotiationStatusClass(negotiation.status)}">
                            ${negotiation.status}
                        </span>
                        <span style="margin-left: 8px; font-size: 0.75rem; color: var(--text-secondary);">
                            Started: ${negotiation.startDate}
                        </span>
                    </div>
                </div>
                <div class="list-item-meta">
                    <div style="font-weight: 500;">Due: ${negotiation.expectedClose}</div>
                    <div style="margin-top: 4px;">
                        <button class="btn btn-sm btn-secondary" onclick="contractsComponent.viewNegotiation('${negotiation.id}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                        ${negotiation.status === 'active' ? `
                            <button class="btn btn-sm btn-primary" onclick="contractsComponent.updateNegotiationStatus('${negotiation.id}', 'completed')" style="margin-left: 4px;">
                                <i class="fas fa-check"></i> Complete
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderContractComparison() {
        const comparison = this.dataService.getContractComparison();
        const comparisonDiv = document.getElementById('contract-comparison');
        
        if (!comparisonDiv) return;

        comparisonDiv.innerHTML = `
            <div class="comparison-table">
                <div class="comparison-header">
                    <div class="comparison-cell">Criteria</div>
                    <div class="comparison-cell">Supplier A</div>
                    <div class="comparison-cell">Supplier B</div>
                    <div class="comparison-cell">Supplier C</div>
                    <div class="comparison-cell">Winner</div>
                </div>
                ${comparison.map(row => `
                    <div class="comparison-row">
                        <div class="comparison-cell criteria">${row.criteria}</div>
                        <div class="comparison-cell ${row.winner === 'supplier1' ? 'winner' : ''}">${row.supplier1}</div>
                        <div class="comparison-cell ${row.winner === 'supplier2' ? 'winner' : ''}">${row.supplier2}</div>
                        <div class="comparison-cell ${row.winner === 'supplier3' ? 'winner' : ''}">${row.supplier3}</div>
                        <div class="comparison-cell winner-badge">
                            ${row.winner === 'tie' ? 'Tie' : row.winner === 'supplier1' ? 'A' : row.winner === 'supplier2' ? 'B' : 'C'}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div style="margin-top: 1rem;">
                <button class="btn btn-primary" onclick="contractsComponent.showComparisonModal()">
                    <i class="fas fa-plus"></i> Add Comparison
                </button>
                <button class="btn btn-secondary" onclick="contractsComponent.exportComparison()" style="margin-left: 8px;">
                    <i class="fas fa-download"></i> Export
                </button>
            </div>
            <style>
                .comparison-table {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr 1fr 80px;
                    gap: 1px;
                    background-color: var(--border-color);
                    border-radius: var(--border-radius);
                    overflow: hidden;
                }
                .comparison-header {
                    display: contents;
                }
                .comparison-header .comparison-cell {
                    background-color: var(--primary-color);
                    color: white;
                    font-weight: 600;
                    padding: 0.75rem;
                }
                .comparison-row {
                    display: contents;
                }
                .comparison-cell {
                    background-color: var(--surface-color);
                    padding: 0.75rem;
                    text-align: center;
                }
                .comparison-cell.criteria {
                    text-align: left;
                    font-weight: 500;
                }
                .comparison-cell.winner {
                    background-color: #dcfce7;
                    font-weight: 600;
                }
                .winner-badge {
                    background-color: var(--success-color);
                    color: white;
                    font-weight: 600;
                }
            </style>
        `;
    }

    renderScenarios() {
        const scenarios = this.dataService.getScenarios();
        const scenarioDiv = document.getElementById('scenario-modeling');
        
        if (!scenarioDiv) return;

        scenarioDiv.innerHTML = `
            <div class="scenarios-grid">
                ${scenarios.map(scenario => `
                    <div class="scenario-card">
                        <h4>${scenario.name}</h4>
                        <div class="scenario-metrics">
                            <div class="metric">
                                <span class="metric-label">Total Cost</span>
                                <span class="metric-value">${scenario.totalCost}</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Payment Terms</span>
                                <span class="metric-value">${scenario.paymentTerms}</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Delivery Time</span>
                                <span class="metric-value">${scenario.deliveryTime}</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Quality Penalty</span>
                                <span class="metric-value">${scenario.qualityPenalty}</span>
                            </div>
                            <div class="metric net-value">
                                <span class="metric-label">Net Value</span>
                                <span class="metric-value">${scenario.netValue}</span>
                            </div>
                        </div>
                        <div class="scenario-actions">
                            <button class="btn btn-sm btn-secondary" onclick="contractsComponent.editScenario('${scenario.id}')">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn-sm btn-primary" onclick="contractsComponent.selectScenario('${scenario.id}')">
                                <i class="fas fa-check"></i> Select
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div style="margin-top: 1rem;">
                <button class="btn btn-primary" onclick="contractsComponent.showNewScenarioModal()">
                    <i class="fas fa-plus"></i> New Scenario
                </button>
                <button class="btn btn-secondary" onclick="contractsComponent.compareScenarios()" style="margin-left: 8px;">
                    <i class="fas fa-chart-bar"></i> Compare All
                </button>
            </div>
            <style>
                .scenarios-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 1rem;
                }
                .scenario-card {
                    background-color: var(--background-color);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius);
                    padding: 1rem;
                }
                .scenario-card h4 {
                    margin-bottom: 1rem;
                    color: var(--primary-color);
                }
                .scenario-metrics {
                    margin-bottom: 1rem;
                }
                .metric {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                    padding: 0.25rem 0;
                }
                .metric.net-value {
                    border-top: 1px solid var(--border-color);
                    padding-top: 0.5rem;
                    font-weight: 600;
                }
                .metric-label {
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                }
                .metric-value {
                    font-weight: 500;
                }
                .scenario-actions {
                    display: flex;
                    gap: 0.5rem;
                }
            </style>
        `;
    }

    getNegotiationStatusClass(status) {
        const statusMap = {
            'pending': 'warning',
            'active': 'info',
            'completed': 'success',
            'cancelled': 'error'
        };
        return statusMap[status] || 'info';
    }

    showNewNegotiationModal() {
        const suppliers = this.dataService.getSuppliers();
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const modalOverlay = document.getElementById('modal-overlay');

        modalTitle.textContent = 'Start New Negotiation';
        modalBody.innerHTML = `
            <form id="new-negotiation-form">
                <div class="form-group">
                    <label class="form-label">Supplier</label>
                    <select class="form-select" id="negotiation-supplier" required>
                        <option value="">Select Supplier</option>
                        ${suppliers.map(supplier => `
                            <option value="${supplier.name}">${supplier.name}</option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Contract Title</label>
                    <input type="text" class="form-input" id="negotiation-title" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Contract Value</label>
                    <input type="text" class="form-input" id="negotiation-value" placeholder="$0.00" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Expected Close Date</label>
                    <input type="date" class="form-input" id="negotiation-close" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Negotiator</label>
                    <input type="text" class="form-input" id="negotiation-negotiator" required>
                </div>
                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-handshake"></i> Start Negotiation
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="app.closeModal()">
                        Cancel
                    </button>
                </div>
            </form>
        `;

        // Set default close date to 2 weeks from now
        const twoWeeks = new Date();
        twoWeeks.setDate(twoWeeks.getDate() + 14);
        document.getElementById('negotiation-close').value = twoWeeks.toISOString().split('T')[0];

        // Form submission
        document.getElementById('new-negotiation-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createNegotiation();
        });

        modalOverlay.classList.remove('hidden');
    }

    createNegotiation() {
        const supplier = document.getElementById('negotiation-supplier').value;
        const title = document.getElementById('negotiation-title').value;
        const value = document.getElementById('negotiation-value').value;
        const expectedClose = document.getElementById('negotiation-close').value;
        const negotiator = document.getElementById('negotiation-negotiator').value;

        const negotiation = this.dataService.addNegotiation({
            supplier,
            title,
            value,
            expectedClose,
            negotiator
        });

        // Add activity
        this.dataService.addActivity({
            title: 'Negotiation Started',
            description: `${title} negotiation started with ${supplier}`,
            type: 'contract',
            priority: 'medium'
        });

        window.app.closeModal();
        this.showNotification('Negotiation started successfully', 'success');
    }

    viewNegotiation(id) {
        const negotiation = this.dataService.getNegotiation(id);
        if (!negotiation) return;

        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const modalOverlay = document.getElementById('modal-overlay');

        modalTitle.textContent = `Negotiation Details - ${negotiation.id}`;
        modalBody.innerHTML = `
            <div class="negotiation-details">
                <div class="form-group">
                    <label class="form-label">Title</label>
                    <div class="form-value">${negotiation.title}</div>
                </div>
                <div class="form-group">
                    <label class="form-label">Supplier</label>
                    <div class="form-value">${negotiation.supplier}</div>
                </div>
                <div class="form-group">
                    <label class="form-label">Value</label>
                    <div class="form-value">${negotiation.value}</div>
                </div>
                <div class="form-group">
                    <label class="form-label">Status</label>
                    <div class="form-value">
                        <span class="status-badge ${this.getNegotiationStatusClass(negotiation.status)}">
                            ${negotiation.status}
                        </span>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Start Date</label>
                    <div class="form-value">${negotiation.startDate}</div>
                </div>
                <div class="form-group">
                    <label class="form-label">Expected Close</label>
                    <div class="form-value">${negotiation.expectedClose}</div>
                </div>
                <div class="form-group">
                    <label class="form-label">Negotiator</label>
                    <div class="form-value">${negotiation.negotiator}</div>
                </div>
                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    ${negotiation.status === 'pending' ? `
                        <button class="btn btn-primary" onclick="contractsComponent.updateNegotiationStatus('${negotiation.id}', 'active')">
                            <i class="fas fa-play"></i> Start Negotiation
                        </button>
                    ` : ''}
                    ${negotiation.status === 'active' ? `
                        <button class="btn btn-success" onclick="contractsComponent.updateNegotiationStatus('${negotiation.id}', 'completed')">
                            <i class="fas fa-check"></i> Complete
                        </button>
                        <button class="btn btn-warning" onclick="contractsComponent.updateNegotiationStatus('${negotiation.id}', 'pending')">
                            <i class="fas fa-pause"></i> Pause
                        </button>
                    ` : ''}
                    <button class="btn btn-secondary" onclick="app.closeModal()">Close</button>
                </div>
            </div>
        `;

        modalOverlay.classList.remove('hidden');
    }

    updateNegotiationStatus(id, status) {
        this.dataService.updateNegotiation(id, { status });
        
        // Add activity
        this.dataService.addActivity({
            title: 'Negotiation Status Updated',
            description: `Negotiation ${id} status changed to ${status}`,
            type: 'contract',
            priority: 'medium'
        });

        window.app.closeModal();
        this.showNotification(`Negotiation ${status}`, 'success');
    }

    showNewScenarioModal() {
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const modalOverlay = document.getElementById('modal-overlay');

        modalTitle.textContent = 'Create New Scenario';
        modalBody.innerHTML = `
            <form id="new-scenario-form">
                <div class="form-group">
                    <label class="form-label">Scenario Name</label>
                    <input type="text" class="form-input" id="scenario-name" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Total Cost</label>
                    <input type="text" class="form-input" id="scenario-cost" placeholder="$0.00" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Payment Terms</label>
                    <select class="form-select" id="scenario-payment" required>
                        <option value="Net 15">Net 15</option>
                        <option value="Net 30">Net 30</option>
                        <option value="Net 45">Net 45</option>
                        <option value="Net 60">Net 60</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Delivery Time</label>
                    <input type="text" class="form-input" id="scenario-delivery" placeholder="5 days" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Quality Penalty</label>
                    <input type="text" class="form-input" id="scenario-penalty" placeholder="$0.00" required>
                </div>
                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-plus"></i> Create Scenario
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="app.closeModal()">
                        Cancel
                    </button>
                </div>
            </form>
        `;

        // Form submission
        document.getElementById('new-scenario-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createScenario();
        });

        modalOverlay.classList.remove('hidden');
    }

    createScenario() {
        const name = document.getElementById('scenario-name').value;
        const totalCost = document.getElementById('scenario-cost').value;
        const paymentTerms = document.getElementById('scenario-payment').value;
        const deliveryTime = document.getElementById('scenario-delivery').value;
        const qualityPenalty = document.getElementById('scenario-penalty').value;

        // Calculate net value (simplified)
        const cost = parseFloat(totalCost.replace(/[$,]/g, ''));
        const penalty = parseFloat(qualityPenalty.replace(/[$,]/g, ''));
        const netValue = this.dataService.formatCurrency(cost - penalty);

        const scenario = this.dataService.addScenario({
            name,
            totalCost,
            paymentTerms,
            deliveryTime,
            qualityPenalty,
            netValue
        });

        window.app.closeModal();
        this.showNotification('Scenario created successfully', 'success');
    }

    selectScenario(id) {
        const scenario = this.dataService.getScenarios().find(s => s.id === id);
        if (!scenario) return;

        // Add activity
        this.dataService.addActivity({
            title: 'Scenario Selected',
            description: `${scenario.name} scenario selected for implementation`,
            type: 'contract',
            priority: 'high'
        });

        this.showNotification(`Scenario "${scenario.name}" selected`, 'success');
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
}

// Initialize contracts component when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.contractsComponent = new ContractsComponent();
});