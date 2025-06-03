// Data Service for OEM Procurement System
class DataService {
    constructor() {
        this.data = window.mockData || {};
        this.listeners = {};
    }

    // Event system for reactive updates
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }

    // KPI Data Methods
    getKPIs() {
        return this.data.kpis || [];
    }

    updateKPI(id, value) {
        const kpi = this.data.kpis.find(k => k.id === id);
        if (kpi) {
            kpi.value = value;
            this.emit('kpis-updated', this.data.kpis);
        }
    }

    // Spend Analytics Methods
    getSpendData() {
        return this.data.spendData || {};
    }

    getSpendByCategory() {
        const { categories, amounts } = this.data.spendData;
        return categories.map((category, index) => ({
            category,
            amount: amounts[index]
        }));
    }

    getMonthlySpend() {
        return this.data.spendData.monthly || {};
    }

    // Supplier Methods
    getSuppliers() {
        return this.data.suppliers || [];
    }

    getSupplier(id) {
        return this.data.suppliers.find(s => s.id === id);
    }

    addSupplier(supplier) {
        const newSupplier = {
            id: `SUP-${Date.now()}`,
            ...supplier,
            status: 'pending',
            rating: 0,
            riskScore: 'unknown',
            totalSpend: '$0',
            contracts: 0,
            lastOrder: null,
            performance: { quality: 0, delivery: 0, cost: 0 }
        };
        this.data.suppliers.push(newSupplier);
        this.emit('suppliers-updated', this.data.suppliers);
        return newSupplier;
    }

    updateSupplier(id, updates) {
        const supplier = this.data.suppliers.find(s => s.id === id);
        if (supplier) {
            Object.assign(supplier, updates);
            this.emit('suppliers-updated', this.data.suppliers);
            return supplier;
        }
        return null;
    }

    deleteSupplier(id) {
        const index = this.data.suppliers.findIndex(s => s.id === id);
        if (index !== -1) {
            this.data.suppliers.splice(index, 1);
            this.emit('suppliers-updated', this.data.suppliers);
            return true;
        }
        return false;
    }

    getSupplierPerformance() {
        return this.data.supplierPerformance || {};
    }

    getSupplierRankings() {
        return this.data.rankings || [];
    }

    getRiskData() {
        return this.data.riskData || {};
    }

    // Quality Management Methods
    getInspections() {
        return this.data.inspections || [];
    }

    getInspection(id) {
        return this.data.inspections.find(i => i.id === id);
    }

    addInspection(inspection) {
        const newInspection = {
            id: `INS-${Date.now()}`,
            ...inspection,
            status: 'scheduled',
            scheduledDate: inspection.scheduledDate || new Date().toISOString().split('T')[0]
        };
        this.data.inspections.push(newInspection);
        this.emit('inspections-updated', this.data.inspections);
        return newInspection;
    }

    updateInspection(id, updates) {
        const inspection = this.data.inspections.find(i => i.id === id);
        if (inspection) {
            Object.assign(inspection, updates);
            this.emit('inspections-updated', this.data.inspections);
            return inspection;
        }
        return null;
    }

    getQualityMetrics() {
        return this.data.qualityMetrics || {};
    }

    getDefects() {
        return this.data.defects || [];
    }

    addDefect(defect) {
        const newDefect = {
            id: `DEF-${Date.now()}`,
            ...defect,
            reportedDate: new Date().toISOString().split('T')[0],
            status: 'open'
        };
        this.data.defects.push(newDefect);
        this.emit('defects-updated', this.data.defects);
        return newDefect;
    }

    updateDefect(id, updates) {
        const defect = this.data.defects.find(d => d.id === id);
        if (defect) {
            Object.assign(defect, updates);
            this.emit('defects-updated', this.data.defects);
            return defect;
        }
        return null;
    }

    // Contract Management Methods
    getNegotiations() {
        return this.data.negotiations || [];
    }

    getNegotiation(id) {
        return this.data.negotiations.find(n => n.id === id);
    }

    addNegotiation(negotiation) {
        const newNegotiation = {
            id: `NEG-${Date.now()}`,
            ...negotiation,
            status: 'pending',
            startDate: new Date().toISOString().split('T')[0]
        };
        this.data.negotiations.push(newNegotiation);
        this.emit('negotiations-updated', this.data.negotiations);
        return newNegotiation;
    }

    updateNegotiation(id, updates) {
        const negotiation = this.data.negotiations.find(n => n.id === id);
        if (negotiation) {
            Object.assign(negotiation, updates);
            this.emit('negotiations-updated', this.data.negotiations);
            return negotiation;
        }
        return null;
    }

    getContractComparison() {
        return this.data.contractComparison || [];
    }

    getScenarios() {
        return this.data.scenarios || [];
    }

    addScenario(scenario) {
        const newScenario = {
            id: `scenario-${Date.now()}`,
            ...scenario
        };
        this.data.scenarios.push(newScenario);
        this.emit('scenarios-updated', this.data.scenarios);
        return newScenario;
    }

    // Purchase Order Methods
    getPurchaseOrders() {
        return this.data.purchaseOrders || [];
    }

    getPurchaseOrder(id) {
        return this.data.purchaseOrders.find(po => po.id === id);
    }

    addPurchaseOrder(order) {
        const newOrder = {
            id: `PO-${Date.now()}`,
            ...order,
            status: 'pending',
            orderDate: new Date().toISOString().split('T')[0]
        };
        this.data.purchaseOrders.push(newOrder);
        this.emit('purchase-orders-updated', this.data.purchaseOrders);
        return newOrder;
    }

    updatePurchaseOrder(id, updates) {
        const order = this.data.purchaseOrders.find(po => po.id === id);
        if (order) {
            Object.assign(order, updates);
            this.emit('purchase-orders-updated', this.data.purchaseOrders);
            return order;
        }
        return null;
    }

    getDeliveryTracking() {
        return this.data.deliveryTracking || [];
    }

    updateDeliveryStatus(orderId, status, location) {
        const tracking = this.data.deliveryTracking.find(t => t.orderId === orderId);
        if (tracking) {
            tracking.status = status;
            tracking.currentLocation = location;
            this.emit('delivery-updated', this.data.deliveryTracking);
            return tracking;
        }
        return null;
    }

    getERPStatus() {
        return this.data.erpStatus || {};
    }

    // Activity Methods
    getActivities() {
        return this.data.activities || [];
    }

    addActivity(activity) {
        const newActivity = {
            id: Date.now(),
            ...activity,
            timestamp: this.formatTimestamp(new Date())
        };
        this.data.activities.unshift(newActivity);
        // Keep only latest 50 activities
        if (this.data.activities.length > 50) {
            this.data.activities = this.data.activities.slice(0, 50);
        }
        this.emit('activities-updated', this.data.activities);
        return newActivity;
    }

    // Search and Filter Methods
    searchSuppliers(query) {
        const searchTerm = query.toLowerCase();
        return this.data.suppliers.filter(supplier => 
            supplier.name.toLowerCase().includes(searchTerm) ||
            supplier.category.toLowerCase().includes(searchTerm) ||
            supplier.location.toLowerCase().includes(searchTerm)
        );
    }

    filterPurchaseOrders(status) {
        if (!status || status === 'all') {
            return this.data.purchaseOrders;
        }
        return this.data.purchaseOrders.filter(po => po.status === status);
    }

    filterInspections(status) {
        if (!status || status === 'all') {
            return this.data.inspections;
        }
        return this.data.inspections.filter(i => i.status === status);
    }

    // Analytics Methods
    calculateSupplierMetrics(supplierId) {
        const supplier = this.getSupplier(supplierId);
        if (!supplier) return null;

        const orders = this.data.purchaseOrders.filter(po => po.supplier === supplier.name);
        const inspections = this.data.inspections.filter(i => i.supplier === supplier.name);
        const defects = this.data.defects.filter(d => d.supplier === supplier.name);

        return {
            totalOrders: orders.length,
            totalValue: orders.reduce((sum, order) => {
                const amount = parseFloat(order.totalAmount.replace(/[$,]/g, ''));
                return sum + amount;
            }, 0),
            onTimeDelivery: this.calculateOnTimeDelivery(orders),
            qualityScore: this.calculateQualityScore(inspections, defects),
            avgOrderValue: orders.length > 0 ? 
                orders.reduce((sum, order) => {
                    const amount = parseFloat(order.totalAmount.replace(/[$,]/g, ''));
                    return sum + amount;
                }, 0) / orders.length : 0
        };
    }

    calculateOnTimeDelivery(orders) {
        const deliveredOrders = orders.filter(o => o.status === 'delivered' && o.actualDelivery);
        if (deliveredOrders.length === 0) return 100;

        const onTimeOrders = deliveredOrders.filter(o => 
            new Date(o.actualDelivery) <= new Date(o.expectedDelivery)
        );
        
        return Math.round((onTimeOrders.length / deliveredOrders.length) * 100);
    }

    calculateQualityScore(inspections, defects) {
        const completedInspections = inspections.filter(i => i.status === 'completed');
        if (completedInspections.length === 0) return 100;

        const passedInspections = completedInspections.filter(i => i.result === 'passed');
        const baseScore = (passedInspections.length / completedInspections.length) * 100;
        
        // Adjust for defects
        const defectPenalty = Math.min(defects.length * 2, 20); // Max 20% penalty
        return Math.max(Math.round(baseScore - defectPenalty), 0);
    }

    // Utility Methods
    formatTimestamp(date) {
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) {
            const diffInMinutes = Math.floor((now - date) / (1000 * 60));
            return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes} minutes ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours} hours ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
        }
    }

    formatCurrency(amount) {
        if (typeof amount === 'string') {
            amount = parseFloat(amount.replace(/[$,]/g, ''));
        }
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    // Data persistence simulation
    saveData() {
        try {
            localStorage.setItem('procurementData', JSON.stringify(this.data));
            return true;
        } catch (error) {
            console.error('Failed to save data:', error);
            return false;
        }
    }

    loadData() {
        try {
            const saved = localStorage.getItem('procurementData');
            if (saved) {
                this.data = { ...this.data, ...JSON.parse(saved) };
                return true;
            }
        } catch (error) {
            console.error('Failed to load data:', error);
        }
        return false;
    }

    // Export methods for reporting
    exportToCSV(dataType) {
        let data, headers;
        
        switch (dataType) {
            case 'suppliers':
                data = this.getSuppliers();
                headers = ['ID', 'Name', 'Category', 'Location', 'Status', 'Rating', 'Risk Score'];
                break;
            case 'orders':
                data = this.getPurchaseOrders();
                headers = ['ID', 'Supplier', 'Items', 'Total Amount', 'Status', 'Order Date'];
                break;
            case 'inspections':
                data = this.getInspections();
                headers = ['ID', 'Supplier', 'Material', 'Status', 'Scheduled Date', 'Priority'];
                break;
            default:
                return null;
        }

        const csvContent = this.convertToCSV(data, headers);
        return csvContent;
    }

    convertToCSV(data, headers) {
        const csvRows = [headers.join(',')];
        
        data.forEach(item => {
            const values = headers.map(header => {
                const key = header.toLowerCase().replace(/\s+/g, '');
                let value = item[key] || '';
                
                // Handle nested objects
                if (typeof value === 'object' && value !== null) {
                    value = JSON.stringify(value).replace(/"/g, '""');
                }
                
                // Escape commas and quotes
                if (typeof value === 'string') {
                    value = value.replace(/"/g, '""');
                    if (value.includes(',') || value.includes('"')) {
                        value = `"${value}"`;
                    }
                }
                
                return value;
            });
            csvRows.push(values.join(','));
        });
        
        return csvRows.join('\n');
    }
}

// Initialize global data service instance
window.dataService = new DataService();

// Load saved data on initialization
window.dataService.loadData();

// Auto-save data periodically
setInterval(() => {
    window.dataService.saveData();
}, 30000); // Save every 30 seconds