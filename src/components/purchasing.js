// Purchasing Component - Streamlined Order Management and ERP Integration
class PurchasingComponent {
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
        this.dataService.on('purchase-orders-updated', () => this.renderOrders());
        this.dataService.on('delivery-updated', () => this.renderDeliveryTracking());

        // Button event listeners
        const createOrderBtn = document.getElementById('create-order-btn');
        if (createOrderBtn) {
            createOrderBtn.addEventListener('click', () => this.showCreateOrderModal());
        }
    }

    loadData() {
        this.renderOrders();
        this.renderDeliveryTracking();
        this.renderERPStatus();
    }

    renderOrders() {
        const orders = this.dataService.getPurchaseOrders();
        const ordersList = document.getElementById('orders-list');
        
        if (!ordersList) return;

        ordersList.innerHTML = orders.map(order => `
            <div class="list-item">
                <div class="list-item-content">
                    <div class="list-item-title">${order.id} - ${order.items}</div>
                    <div class="list-item-subtitle">
                        ${order.supplier} | Qty: ${order.quantity} | Unit: ${order.unitPrice}
                    </div>
                    <div style="margin-top: 4px;">
                        <span class="status-badge ${this.getOrderStatusClass(order.status)}">
                            ${order.status}
                        </span>
                        <span style="margin-left: 8px; font-size: 0.75rem; color: var(--text-secondary);">
                            Buyer: ${order.buyer}
                        </span>
                    </div>
                </div>
                <div class="list-item-meta">
                    <div style="font-weight: 500;">${order.totalAmount}</div>
                    <div style="margin-top: 4px; font-size: 0.875rem; color: var(--text-secondary);">
                        ${order.expectedDelivery}
                    </div>
                    <div style="margin-top: 4px;">
                        <button class="btn btn-sm btn-secondary" onclick="purchasingComponent.viewOrder('${order.id}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                        ${order.status === 'pending' ? `
                            <button class="btn btn-sm btn-primary" onclick="purchasingComponent.approveOrder('${order.id}')" style="margin-left: 4px;">
                                <i class="fas fa-check"></i> Approve
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderDeliveryTracking() {
        const tracking = this.dataService.getDeliveryTracking();
        const trackingDiv = document.getElementById('delivery-tracking');
        
        if (!trackingDiv) return;

        trackingDiv.innerHTML = `
            <div class="tracking-list">
                ${tracking.map(item => `
                    <div class="tracking-item">
                        <div class="tracking-header">
                            <div class="tracking-order">
                                <strong>${item.orderId}</strong>
                                <span class="supplier-name">${item.supplier}</span>
                            </div>
                            <div class="tracking-status">
                                <span class="status-badge ${this.getDeliveryStatusClass(item.status)}">
                                    ${item.status}
                                </span>
                            </div>
                        </div>
                        <div class="tracking-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${item.progress}%"></div>
                            </div>
                            <span class="progress-text">${item.progress}%</span>
                        </div>
                        <div class="tracking-details">
                            <div class="tracking-location">
                                <i class="fas fa-map-marker-alt"></i>
                                ${item.currentLocation}
                            </div>
                            <div class="tracking-eta">
                                <i class="fas fa-clock"></i>
                                ETA: ${item.estimatedDelivery}
                            </div>
                        </div>
                        <div class="tracking-actions">
                            <button class="btn btn-sm btn-secondary" onclick="purchasingComponent.viewTracking('${item.orderId}')">
                                <i class="fas fa-route"></i> Track
                            </button>
                            ${item.status === 'delivered' ? '' : `
                                <button class="btn btn-sm btn-warning" onclick="purchasingComponent.requestUpdate('${item.orderId}')" style="margin-left: 4px;">
                                    <i class="fas fa-sync"></i> Update
                                </button>
                            `}
                        </div>
                    </div>
                `).join('')}
            </div>
            <style>
                .tracking-list {
                    max-height: 400px;
                    overflow-y: auto;
                }
                .tracking-item {
                    padding: 1rem;
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius);
                    margin-bottom: 1rem;
                    background-color: var(--surface-color);
                }
                .tracking-item:last-child {
                    margin-bottom: 0;
                }
                .tracking-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.75rem;
                }
                .tracking-order strong {
                    display: block;
                    font-weight: 600;
                }
                .supplier-name {
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                }
                .tracking-progress {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 0.75rem;
                }
                .progress-bar {
                    flex: 1;
                    height: 8px;
                    background-color: var(--border-color);
                    border-radius: 4px;
                    overflow: hidden;
                }
                .progress-fill {
                    height: 100%;
                    background-color: var(--primary-color);
                    transition: width 0.3s ease;
                }
                .progress-text {
                    font-weight: 500;
                    font-size: 0.875rem;
                    min-width: 40px;
                }
                .tracking-details {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.75rem;
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                }
                .tracking-location, .tracking-eta {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .tracking-actions {
                    display: flex;
                    gap: 0.5rem;
                }
            </style>
        `;
    }

    renderERPStatus() {
        const erpData = this.dataService.getERPStatus();
        const erpStatusDiv = document.getElementById('erp-status');
        
        if (!erpStatusDiv) return;

        erpStatusDiv.innerHTML = `
            <div class="erp-overview">
                <div class="erp-health">
                    <div class="health-indicator ${erpData.status}">
                        <i class="fas fa-${erpData.status === 'connected' ? 'check-circle' : 'exclamation-triangle'}"></i>
                        <span>${erpData.status === 'connected' ? 'Connected' : 'Issues Detected'}</span>
                    </div>
                    <div class="health-score">
                        System Health: ${erpData.systemHealth}%
                    </div>
                </div>
                <div class="sync-info">
                    <div class="sync-detail">
                        <span class="sync-label">Last Sync:</span>
                        <span class="sync-value">${erpData.lastSync}</span>
                    </div>
                    <div class="sync-detail">
                        <span class="sync-label">Synced Records:</span>
                        <span class="sync-value">${erpData.syncedRecords}</span>
                    </div>
                    <div class="sync-detail">
                        <span class="sync-label">Pending:</span>
                        <span class="sync-value">${erpData.pendingRecords}</span>
                    </div>
                    <div class="sync-detail">
                        <span class="sync-label">Errors:</span>
                        <span class="sync-value ${erpData.errors > 0 ? 'error' : 'success'}">${erpData.errors}</span>
                    </div>
                </div>
            </div>
            
            <div class="erp-modules">
                <h4>Module Status</h4>
                <div class="modules-list">
                    ${erpData.modules.map(module => `
                        <div class="module-item">
                            <div class="module-info">
                                <div class="module-name">${module.name}</div>
                                <div class="module-records">${module.records} records</div>
                                ${module.message ? `<div class="module-message">${module.message}</div>` : ''}
                            </div>
                            <div class="module-status">
                                <span class="status-badge ${module.status === 'active' ? 'success' : 'warning'}">
                                    ${module.status}
                                </span>
                                <div class="module-sync">${module.lastSync}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="erp-actions">
                <button class="btn btn-primary" onclick="purchasingComponent.syncERP()">
                    <i class="fas fa-sync"></i> Sync Now
                </button>
                <button class="btn btn-secondary" onclick="purchasingComponent.viewERPLogs()" style="margin-left: 8px;">
                    <i class="fas fa-list"></i> View Logs
                </button>
                <button class="btn btn-secondary" onclick="purchasingComponent.configureERP()" style="margin-left: 8px;">
                    <i class="fas fa-cog"></i> Configure
                </button>
            </div>

            <style>
                .erp-overview {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    background-color: var(--background-color);
                    border-radius: var(--border-radius);
                    margin-bottom: 1.5rem;
                }
                .erp-health {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .health-indicator {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 600;
                }
                .health-indicator.connected {
                    color: var(--success-color);
                }
                .health-indicator.warning {
                    color: var(--warning-color);
                }
                .health-score {
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                }
                .sync-info {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                }
                .sync-detail {
                    display: flex;
                    justify-content: space-between;
                    gap: 1rem;
                }
                .sync-label {
                    color: var(--text-secondary);
                }
                .sync-value {
                    font-weight: 500;
                }
                .sync-value.error {
                    color: var(--error-color);
                }
                .sync-value.success {
                    color: var(--success-color);
                }
                .erp-modules h4 {
                    margin: 0 0 1rem 0;
                    color: var(--text-primary);
                }
                .modules-list {
                    margin-bottom: 1.5rem;
                }
                .module-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.75rem;
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius);
                    margin-bottom: 0.5rem;
                }
                .module-item:last-child {
                    margin-bottom: 0;
                }
                .module-name {
                    font-weight: 500;
                    margin-bottom: 0.25rem;
                }
                .module-records {
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                }
                .module-message {
                    font-size: 0.75rem;
                    color: var(--warning-color);
                    margin-top: 0.25rem;
                }
                .module-status {
                    text-align: right;
                }
                .module-sync {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    margin-top: 0.25rem;
                }
                .erp-actions {
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }
            </style>
        `;
    }

    getOrderStatusClass(status) {
        const statusMap = {
            'pending': 'warning',
            'approved': 'info',
            'shipped': 'info',
            'delivered': 'success',
            'cancelled': 'error'
        };
        return statusMap[status] || 'info';
    }

    getDeliveryStatusClass(status) {
        const statusMap = {
            'processing': 'warning',
            'shipped': 'info',
            'in-transit': 'info',
            'delivered': 'success',
            'delayed': 'error'
        };
        return statusMap[status] || 'info';
    }

    showCreateOrderModal() {
        const suppliers = this.dataService.getSuppliers();
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const modalOverlay = document.getElementById('modal-overlay');

        modalTitle.textContent = 'Create Purchase Order';
        modalBody.innerHTML = `
            <form id="create-order-form">
                <div class="form-group">
                    <label class="form-label">Supplier</label>
                    <select class="form-select" id="order-supplier" required>
                        <option value="">Select Supplier</option>
                        ${suppliers.map(supplier => `
                            <option value="${supplier.name}">${supplier.name}</option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Items/Description</label>
                    <input type="text" class="form-input" id="order-items" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Quantity</label>
                    <input type="number" class="form-input" id="order-quantity" min="1" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Unit Price</label>
                    <input type="text" class="form-input" id="order-unit-price" placeholder="$0.00" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Expected Delivery</label>
                    <input type="date" class="form-input" id="order-delivery" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Buyer</label>
                    <input type="text" class="form-input" id="order-buyer" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Notes (Optional)</label>
                    <textarea class="form-textarea" id="order-notes" placeholder="Additional notes or requirements"></textarea>
                </div>
                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-plus"></i> Create Order
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="app.closeModal()">
                        Cancel
                    </button>
                </div>
            </form>
        `;

        // Set default delivery date to 1 week from now
        const oneWeek = new Date();
        oneWeek.setDate(oneWeek.getDate() + 7);
        document.getElementById('order-delivery').value = oneWeek.toISOString().split('T')[0];

        // Auto-calculate total amount
        const quantityInput = document.getElementById('order-quantity');
        const unitPriceInput = document.getElementById('order-unit-price');
        
        function updateTotal() {
            const quantity = parseFloat(quantityInput.value) || 0;
            const unitPrice = parseFloat(unitPriceInput.value.replace(/[$,]/g, '')) || 0;
            const total = quantity * unitPrice;
            
            // You could add a total display field here
        }

        quantityInput.addEventListener('input', updateTotal);
        unitPriceInput.addEventListener('input', updateTotal);

        // Form submission
        document.getElementById('create-order-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createOrder();
        });

        modalOverlay.classList.remove('hidden');
    }

    createOrder() {
        const supplier = document.getElementById('order-supplier').value;
        const items = document.getElementById('order-items').value;
        const quantity = document.getElementById('order-quantity').value;
        const unitPrice = document.getElementById('order-unit-price').value;
        const expectedDelivery = document.getElementById('order-delivery').value;
        const buyer = document.getElementById('order-buyer').value;
        const notes = document.getElementById('order-notes').value;

        // Calculate total amount
        const qty = parseFloat(quantity);
        const price = parseFloat(unitPrice.replace(/[$,]/g, ''));
        const totalAmount = this.dataService.formatCurrency(qty * price);

        const order = this.dataService.addPurchaseOrder({
            supplier,
            items,
            quantity: qty,
            unitPrice,
            totalAmount,
            expectedDelivery,
            buyer,
            notes
        });

        // Add activity
        this.dataService.addActivity({
            title: 'Purchase Order Created',
            description: `${order.id} created for ${supplier} - ${totalAmount}`,
            type: 'purchase',
            priority: 'medium'
        });

        window.app.closeModal();
        this.showNotification('Purchase order created successfully', 'success');
    }

    viewOrder(id) {
        const order = this.dataService.getPurchaseOrder(id);
        if (!order) return;

        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const modalOverlay = document.getElementById('modal-overlay');

        modalTitle.textContent = `Purchase Order - ${order.id}`;
        modalBody.innerHTML = `
            <div class="order-details">
                <div class="order-header">
                    <div class="order-info">
                        <h3>${order.id}</h3>
                        <div class="order-amount">${order.totalAmount}</div>
                    </div>
                    <div class="order-status-display">
                        <span class="status-badge ${this.getOrderStatusClass(order.status)} large">
                            ${order.status}
                        </span>
                    </div>
                </div>

                <div class="order-grid">
                    <div class="order-section">
                        <h4>Supplier Information</h4>
                        <div class="info-item">
                            <span class="info-label">Supplier:</span>
                            <span class="info-value">${order.supplier}</span>
                        </div>
                    </div>

                    <div class="order-section">
                        <h4>Order Details</h4>
                        <div class="info-item">
                            <span class="info-label">Items:</span>
                            <span class="info-value">${order.items}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Quantity:</span>
                            <span class="info-value">${order.quantity}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Unit Price:</span>
                            <span class="info-value">${order.unitPrice}</span>
                        </div>
                    </div>

                    <div class="order-section">
                        <h4>Dates</h4>
                        <div class="info-item">
                            <span class="info-label">Order Date:</span>
                            <span class="info-value">${order.orderDate}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Expected Delivery:</span>
                            <span class="info-value">${order.expectedDelivery}</span>
                        </div>
                        ${order.actualDelivery ? `
                            <div class="info-item">
                                <span class="info-label">Actual Delivery:</span>
                                <span class="info-value">${order.actualDelivery}</span>
                            </div>
                        ` : ''}
                    </div>

                    <div class="order-section">
                        <h4>Personnel</h4>
                        <div class="info-item">
                            <span class="info-label">Buyer:</span>
                            <span class="info-value">${order.buyer}</span>
                        </div>
                    </div>
                </div>

                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    ${order.status === 'pending' ? `
                        <button class="btn btn-success" onclick="purchasingComponent.approveOrder('${order.id}')">
                            <i class="fas fa-check"></i> Approve
                        </button>
                        <button class="btn btn-error" onclick="purchasingComponent.cancelOrder('${order.id}')">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    ` : ''}
                    <button class="btn btn-secondary" onclick="purchasingComponent.printOrder('${order.id}')">
                        <i class="fas fa-print"></i> Print
                    </button>
                    <button class="btn btn-secondary" onclick="app.closeModal()">Close</button>
                </div>
            </div>
            <style>
                .order-details {
                    max-width: 700px;
                }
                .order-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid var(--border-color);
                }
                .order-info h3 {
                    margin: 0 0 0.5rem 0;
                    color: var(--primary-color);
                }
                .order-amount {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--text-primary);
                }
                .status-badge.large {
                    padding: 0.5rem 1rem;
                    font-size: 1rem;
                }
                .order-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 2rem;
                }
                .order-section h4 {
                    margin: 0 0 1rem 0;
                    color: var(--text-primary);
                    border-bottom: 1px solid var(--border-color);
                    padding-bottom: 0.5rem;
                }
                .info-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.75rem;
                    padding: 0.25rem 0;
                }
                .info-label {
                    color: var(--text-secondary);
                    font-weight: 500;
                }
                .info-value {
                    font-weight: 600;
                    text-align: right;
                }
            </style>
        `;

        modalOverlay.classList.remove('hidden');
    }

    approveOrder(id) {
        this.dataService.updatePurchaseOrder(id, { status: 'approved' });
        
        // Add activity
        this.dataService.addActivity({
            title: 'Purchase Order Approved',
            description: `Order ${id} has been approved and sent to supplier`,
            type: 'purchase',
            priority: 'medium'
        });

        window.app.closeModal();
        this.showNotification('Purchase order approved', 'success');
    }

    syncERP() {
        // Simulate ERP sync
        this.showNotification('ERP synchronization started', 'info');
        
        setTimeout(() => {
            // Add activity
            this.dataService.addActivity({
                title: 'ERP Sync Completed',
                description: 'All procurement data synchronized with ERP system',
                type: 'system',
                priority: 'low'
            });
            
            this.showNotification('ERP synchronization completed', 'success');
            this.renderERPStatus();
        }, 2000);
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
            background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'info' ? '#3b82f6' : '#f59e0b'};
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

// Initialize purchasing component when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.purchasingComponent = new PurchasingComponent();
});