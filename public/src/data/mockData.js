// Mock Data for OEM Procurement System

window.mockData = {
    // KPI Data
    kpis: [
        {
            id: 'total-spend',
            value: '$2.4M',
            label: 'Total Spend',
            change: '+12.5%',
            trend: 'positive'
        },
        {
            id: 'active-suppliers',
            value: '127',
            label: 'Active Suppliers',
            change: '+8.3%',
            trend: 'positive'
        },
        {
            id: 'on-time-delivery',
            value: '94.2%',
            label: 'On-Time Delivery',
            change: '+2.1%',
            trend: 'positive'
        },
        {
            id: 'cost-savings',
            value: '$180K',
            label: 'Cost Savings',
            change: '+24.7%',
            trend: 'positive'
        },
        {
            id: 'quality-score',
            value: '96.8%',
            label: 'Quality Score',
            change: '-0.5%',
            trend: 'negative'
        },
        {
            id: 'contract-compliance',
            value: '98.1%',
            label: 'Contract Compliance',
            change: '+1.2%',
            trend: 'positive'
        }
    ],

    // Spend Analytics Data
    spendData: {
        categories: ['Raw Materials', 'Components', 'Services', 'Equipment', 'Software'],
        amounts: [850000, 520000, 380000, 420000, 230000],
        monthly: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [380000, 420000, 390000, 450000, 480000, 520000]
        }
    },

    // Supplier Performance Data
    supplierPerformance: {
        labels: ['ACME Corp', 'TechSupply Inc', 'Global Parts', 'Precision Mfg', 'Quality Components'],
        datasets: [
            {
                label: 'Quality Score',
                data: [95, 92, 88, 97, 94],
                backgroundColor: '#10b981'
            },
            {
                label: 'Delivery Performance',
                data: [92, 96, 85, 94, 91],
                backgroundColor: '#3b82f6'
            },
            {
                label: 'Cost Competitiveness',
                data: [88, 90, 92, 85, 89],
                backgroundColor: '#f59e0b'
            }
        ]
    },

    // Recent Activities
    activities: [
        {
            id: 1,
            title: 'Contract Renewal - ACME Corp',
            description: 'Annual contract renewal for raw materials supply',
            timestamp: '2 hours ago',
            type: 'contract',
            priority: 'high'
        },
        {
            id: 2,
            title: 'Quality Inspection Completed',
            description: 'Batch QC-2024-001 passed all quality checks',
            timestamp: '4 hours ago',
            type: 'quality',
            priority: 'medium'
        },
        {
            id: 3,
            title: 'New Supplier Onboarded',
            description: 'TechSupply Inc approved for electronic components',
            timestamp: '1 day ago',
            type: 'supplier',
            priority: 'medium'
        },
        {
            id: 4,
            title: 'Purchase Order Submitted',
            description: 'PO-2024-0234 for $45,000 sent to Global Parts',
            timestamp: '1 day ago',
            type: 'purchase',
            priority: 'low'
        },
        {
            id: 5,
            title: 'Delivery Delay Alert',
            description: 'Expected delay of 2 days for PO-2024-0221',
            timestamp: '2 days ago',
            type: 'delivery',
            priority: 'high'
        }
    ],

    // Quality Management Data
    inspections: [
        {
            id: 'INS-2024-001',
            supplier: 'ACME Corp',
            material: 'Steel Sheets',
            scheduledDate: '2024-01-15',
            status: 'scheduled',
            priority: 'high',
            inspector: 'John Smith'
        },
        {
            id: 'INS-2024-002',
            supplier: 'TechSupply Inc',
            material: 'Electronic Components',
            scheduledDate: '2024-01-16',
            status: 'in-progress',
            priority: 'medium',
            inspector: 'Sarah Johnson'
        },
        {
            id: 'INS-2024-003',
            supplier: 'Global Parts',
            material: 'Precision Bolts',
            scheduledDate: '2024-01-14',
            status: 'completed',
            priority: 'low',
            inspector: 'Mike Davis',
            result: 'passed'
        },
        {
            id: 'INS-2024-004',
            supplier: 'Quality Components',
            material: 'Rubber Seals',
            scheduledDate: '2024-01-17',
            status: 'scheduled',
            priority: 'medium',
            inspector: 'Lisa Wilson'
        }
    ],

    // Quality Metrics
    qualityMetrics: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Pass Rate %',
                data: [96, 94, 97, 95, 98, 96],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true
            },
            {
                label: 'Defect Rate %',
                data: [4, 6, 3, 5, 2, 4],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true
            }
        ]
    },

    // Defects Data
    defects: [
        {
            id: 'DEF-2024-001',
            supplier: 'Global Parts',
            material: 'Precision Bolts',
            defectType: 'Dimensional Variance',
            severity: 'medium',
            quantity: 50,
            reportedDate: '2024-01-10',
            status: 'resolved'
        },
        {
            id: 'DEF-2024-002',
            supplier: 'ACME Corp',
            material: 'Steel Sheets',
            defectType: 'Surface Defect',
            severity: 'low',
            quantity: 12,
            reportedDate: '2024-01-12',
            status: 'investigating'
        },
        {
            id: 'DEF-2024-003',
            supplier: 'TechSupply Inc',
            material: 'Electronic Components',
            defectType: 'Functional Failure',
            severity: 'high',
            quantity: 8,
            reportedDate: '2024-01-13',
            status: 'open'
        }
    ],

    // Contract Negotiations
    negotiations: [
        {
            id: 'NEG-2024-001',
            supplier: 'ACME Corp',
            title: 'Annual Raw Materials Contract',
            value: '$850,000',
            status: 'active',
            startDate: '2024-01-08',
            expectedClose: '2024-01-20',
            negotiator: 'Alice Brown'
        },
        {
            id: 'NEG-2024-002',
            supplier: 'New Supplier XYZ',
            title: 'Components Supply Agreement',
            value: '$125,000',
            status: 'pending',
            startDate: '2024-01-12',
            expectedClose: '2024-01-25',
            negotiator: 'Bob Wilson'
        },
        {
            id: 'NEG-2024-003',
            supplier: 'Service Provider ABC',
            title: 'Maintenance Services Contract',
            value: '$75,000',
            status: 'completed',
            startDate: '2024-01-01',
            expectedClose: '2024-01-05',
            negotiator: 'Carol Davis'
        }
    ],

    // Contract Comparison Data
    contractComparison: [
        {
            criteria: 'Price per Unit',
            supplier1: '$12.50',
            supplier2: '$13.20',
            supplier3: '$11.80',
            winner: 'supplier3'
        },
        {
            criteria: 'Delivery Time',
            supplier1: '5 days',
            supplier2: '3 days',
            supplier3: '7 days',
            winner: 'supplier2'
        },
        {
            criteria: 'Quality Rating',
            supplier1: '4.5/5',
            supplier2: '4.2/5',
            supplier3: '4.8/5',
            winner: 'supplier3'
        },
        {
            criteria: 'Payment Terms',
            supplier1: 'Net 30',
            supplier2: 'Net 45',
            supplier3: 'Net 30',
            winner: 'tie'
        }
    ],

    // Scenario Modeling Data
    scenarios: [
        {
            id: 'scenario-1',
            name: 'Current Terms',
            totalCost: '$850,000',
            paymentTerms: 'Net 30',
            deliveryTime: '5 days',
            qualityPenalty: '$5,000',
            netValue: '$845,000'
        },
        {
            id: 'scenario-2',
            name: 'Improved Terms',
            totalCost: '$820,000',
            paymentTerms: 'Net 45',
            deliveryTime: '4 days',
            qualityPenalty: '$2,000',
            netValue: '$818,000'
        },
        {
            id: 'scenario-3',
            name: 'Premium Option',
            totalCost: '$900,000',
            paymentTerms: 'Net 30',
            deliveryTime: '3 days',
            qualityPenalty: '$1,000',
            netValue: '$899,000'
        }
    ],

    // Suppliers Data
    suppliers: [
        {
            id: 'SUP-001',
            name: 'ACME Corp',
            category: 'Raw Materials',
            location: 'Detroit, MI',
            status: 'active',
            rating: 4.5,
            riskScore: 'low',
            totalSpend: '$850,000',
            contracts: 3,
            lastOrder: '2024-01-10',
            performance: {
                quality: 95,
                delivery: 92,
                cost: 88
            }
        },
        {
            id: 'SUP-002',
            name: 'TechSupply Inc',
            category: 'Electronics',
            location: 'Austin, TX',
            status: 'active',
            rating: 4.2,
            riskScore: 'medium',
            totalSpend: '$420,000',
            contracts: 2,
            lastOrder: '2024-01-12',
            performance: {
                quality: 92,
                delivery: 96,
                cost: 90
            }
        },
        {
            id: 'SUP-003',
            name: 'Global Parts',
            category: 'Components',
            location: 'Shanghai, China',
            status: 'active',
            rating: 3.8,
            riskScore: 'high',
            totalSpend: '$320,000',
            contracts: 1,
            lastOrder: '2024-01-08',
            performance: {
                quality: 88,
                delivery: 85,
                cost: 92
            }
        },
        {
            id: 'SUP-004',
            name: 'Precision Mfg',
            category: 'Manufacturing',
            location: 'Milwaukee, WI',
            status: 'active',
            rating: 4.8,
            riskScore: 'low',
            totalSpend: '$180,000',
            contracts: 4,
            lastOrder: '2024-01-11',
            performance: {
                quality: 97,
                delivery: 94,
                cost: 85
            }
        },
        {
            id: 'SUP-005',
            name: 'Quality Components',
            category: 'Components',
            location: 'Phoenix, AZ',
            status: 'active',
            rating: 4.3,
            riskScore: 'low',
            totalSpend: '$280,000',
            contracts: 2,
            lastOrder: '2024-01-09',
            performance: {
                quality: 94,
                delivery: 91,
                cost: 89
            }
        }
    ],

    // Risk Assessment Data
    riskData: {
        labels: ['Financial Risk', 'Geographic Risk', 'Performance Risk', 'Compliance Risk'],
        datasets: [
            {
                label: 'Risk Distribution',
                data: [25, 35, 20, 20],
                backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6']
            }
        ]
    },

    // Supplier Rankings
    rankings: [
        {
            rank: 1,
            supplier: 'Precision Mfg',
            score: 92.5,
            change: '+2.1',
            category: 'Manufacturing'
        },
        {
            rank: 2,
            supplier: 'ACME Corp',
            score: 91.8,
            change: '+0.5',
            category: 'Raw Materials'
        },
        {
            rank: 3,
            supplier: 'Quality Components',
            score: 89.2,
            change: '-1.2',
            category: 'Components'
        },
        {
            rank: 4,
            supplier: 'TechSupply Inc',
            score: 87.6,
            change: '+3.4',
            category: 'Electronics'
        },
        {
            rank: 5,
            supplier: 'Global Parts',
            score: 82.1,
            change: '-2.8',
            category: 'Components'
        }
    ],

    // Purchase Orders
    purchaseOrders: [
        {
            id: 'PO-2024-0234',
            supplier: 'ACME Corp',
            items: 'Steel Sheets - Grade A',
            quantity: 500,
            unitPrice: '$90.00',
            totalAmount: '$45,000',
            status: 'approved',
            orderDate: '2024-01-10',
            expectedDelivery: '2024-01-15',
            buyer: 'John Doe'
        },
        {
            id: 'PO-2024-0235',
            supplier: 'TechSupply Inc',
            items: 'Electronic Components Bundle',
            quantity: 200,
            unitPrice: '$125.00',
            totalAmount: '$25,000',
            status: 'pending',
            orderDate: '2024-01-12',
            expectedDelivery: '2024-01-18',
            buyer: 'Jane Smith'
        },
        {
            id: 'PO-2024-0236',
            supplier: 'Global Parts',
            items: 'Precision Bolts M8x20',
            quantity: 1000,
            unitPrice: '$2.50',
            totalAmount: '$2,500',
            status: 'delivered',
            orderDate: '2024-01-08',
            expectedDelivery: '2024-01-12',
            actualDelivery: '2024-01-12',
            buyer: 'Mike Johnson'
        },
        {
            id: 'PO-2024-0237',
            supplier: 'Quality Components',
            items: 'Rubber Seals Various',
            quantity: 300,
            unitPrice: '$15.00',
            totalAmount: '$4,500',
            status: 'shipped',
            orderDate: '2024-01-11',
            expectedDelivery: '2024-01-16',
            buyer: 'Sarah Wilson'
        }
    ],

    // Delivery Tracking
    deliveryTracking: [
        {
            orderId: 'PO-2024-0234',
            supplier: 'ACME Corp',
            status: 'in-transit',
            currentLocation: 'Distribution Center - Chicago',
            estimatedDelivery: '2024-01-15',
            trackingNumber: 'TRK-234567890',
            progress: 75
        },
        {
            orderId: 'PO-2024-0235',
            supplier: 'TechSupply Inc',
            status: 'processing',
            currentLocation: 'Supplier Facility',
            estimatedDelivery: '2024-01-18',
            trackingNumber: 'TRK-234567891',
            progress: 25
        },
        {
            orderId: 'PO-2024-0236',
            supplier: 'Global Parts',
            status: 'delivered',
            currentLocation: 'Delivered',
            estimatedDelivery: '2024-01-12',
            actualDelivery: '2024-01-12',
            trackingNumber: 'TRK-234567892',
            progress: 100
        },
        {
            orderId: 'PO-2024-0237',
            supplier: 'Quality Components',
            status: 'shipped',
            currentLocation: 'In Transit - Phoenix Hub',
            estimatedDelivery: '2024-01-16',
            trackingNumber: 'TRK-234567893',
            progress: 60
        }
    ],

    // ERP Integration Status
    erpStatus: {
        lastSync: '2024-01-14 10:30 AM',
        status: 'connected',
        syncedRecords: 1247,
        pendingRecords: 3,
        errors: 0,
        systemHealth: 98.5,
        modules: [
            {
                name: 'Purchase Orders',
                status: 'active',
                lastSync: '2024-01-14 10:30 AM',
                records: 456
            },
            {
                name: 'Supplier Data',
                status: 'active',
                lastSync: '2024-01-14 10:28 AM',
                records: 127
            },
            {
                name: 'Inventory',
                status: 'active',
                lastSync: '2024-01-14 10:25 AM',
                records: 892
            },
            {
                name: 'Financial Data',
                status: 'warning',
                lastSync: '2024-01-14 09:45 AM',
                records: 234,
                message: 'Minor sync delay'
            }
        ]
    }
};