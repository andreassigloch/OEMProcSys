// Main Application Controller
class App {
    constructor() {
        this.currentView = 'insights';
        this.components = {};
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadComponents();
        this.hideLoadingScreen();
        this.initializeServiceWorker();
    }

    bindEvents() {
        // Navigation events
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                if (view) {
                    this.navigateToView(view);
                }
            });
        });

        // Mobile navigation toggle
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('show');
            });
        }

        // Modal events
        const modalOverlay = document.getElementById('modal-overlay');
        const modalClose = document.getElementById('modal-close');
        
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.closeModal();
                }
            });
        }
        
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
            
            // Navigation shortcuts (Alt + number)
            if (e.altKey) {
                switch(e.key) {
                    case '1':
                        this.navigateToView('insights');
                        break;
                    case '2':
                        this.navigateToView('quality');
                        break;
                    case '3':
                        this.navigateToView('contracts');
                        break;
                    case '4':
                        this.navigateToView('suppliers');
                        break;
                    case '5':
                        this.navigateToView('purchasing');
                        break;
                }
            }
        });

        // Handle back/forward browser navigation
        window.addEventListener('popstate', (e) => {
            const view = e.state?.view || 'insights';
            this.navigateToView(view, false);
        });

        // Handle offline/online events
        window.addEventListener('online', () => {
            this.showNotification('Connection restored', 'success');
        });

        window.addEventListener('offline', () => {
            this.showNotification('Working offline', 'warning');
        });
    }

    loadComponents() {
        // Components are initialized in their respective files
        // Store references for easy access
        this.components = {
            insights: window.insightsComponent,
            quality: window.qualityComponent,
            contracts: window.contractsComponent,
            suppliers: window.suppliersComponent,
            purchasing: window.purchasingComponent
        };
    }

    navigateToView(view, updateHistory = true) {
        // Hide all views
        const views = document.querySelectorAll('.view');
        views.forEach(v => v.classList.add('hidden'));

        // Show target view
        const targetView = document.getElementById(`${view}-view`);
        if (targetView) {
            targetView.classList.remove('hidden');
        }

        // Update navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.view === view) {
                item.classList.add('active');
            }
        });

        // Close mobile menu if open
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.classList.remove('show');
        }

        // Update current view
        this.currentView = view;

        // Refresh component data if needed
        if (this.components[view] && typeof this.components[view].refresh === 'function') {
            this.components[view].refresh();
        }

        // Update browser history
        if (updateHistory) {
            const url = new URL(window.location);
            url.searchParams.set('view', view);
            history.pushState({ view }, '', url);
        }

        // Update page title
        this.updatePageTitle(view);
    }

    updatePageTitle(view) {
        const titles = {
            insights: 'Procurement Insights - OEM Procurement System',
            quality: 'Quality Management - OEM Procurement System',
            contracts: 'Contract Negotiation - OEM Procurement System',
            suppliers: 'Supplier Network - OEM Procurement System',
            purchasing: 'Purchase Orders - OEM Procurement System'
        };
        
        document.title = titles[view] || 'OEM Procurement System';
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 1000);
        }
    }

    closeModal() {
        const modalOverlay = document.getElementById('modal-overlay');
        if (modalOverlay) {
            modalOverlay.classList.add('hidden');
        }
    }

    showModal(title, content) {
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const modalOverlay = document.getElementById('modal-overlay');

        if (modalTitle) modalTitle.textContent = title;
        if (modalBody) modalBody.innerHTML = content;
        if (modalOverlay) modalOverlay.classList.remove('hidden');
    }

    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            z-index: 9999;
            font-weight: 500;
            background-color: ${this.getNotificationColor(type)};
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            transform: translateX(100%);
            transition: transform 0.3s ease-in-out;
            min-width: 300px;
            max-width: 400px;
        `;

        const style = document.createElement('style');
        style.textContent = `
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            .notification-content i {
                font-size: 1.25rem;
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
                if (document.head.contains(style)) {
                    document.head.removeChild(style);
                }
            }, 300);
        }, duration);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || '#3b82f6';
    }

    initializeServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('Service Worker registered:', registration);
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                this.showUpdateAvailable();
                            }
                        });
                    });
                })
                .catch((error) => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    }

    showUpdateAvailable() {
        const updateBanner = document.createElement('div');
        updateBanner.className = 'update-banner';
        updateBanner.innerHTML = `
            <div class="update-content">
                <span>A new version is available!</span>
                <button onclick="app.updateApp()" class="btn btn-sm btn-primary">Update</button>
                <button onclick="this.parentElement.parentElement.remove()" class="btn btn-sm btn-secondary">Later</button>
            </div>
        `;
        
        updateBanner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background-color: var(--primary-color);
            color: white;
            padding: 0.75rem;
            z-index: 10000;
            text-align: center;
        `;

        const style = document.createElement('style');
        style.textContent = `
            .update-content {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1rem;
            }
            .update-banner .btn {
                color: var(--primary-color);
                background-color: white;
                border: none;
            }
            .update-banner .btn:hover {
                background-color: #f1f5f9;
            }
        `;
        document.head.appendChild(style);

        document.body.prepend(updateBanner);
    }

    updateApp() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then((registrations) => {
                registrations.forEach((registration) => {
                    registration.update();
                });
                window.location.reload();
            });
        }
    }

    // Utility methods for components
    formatCurrency(amount) {
        if (typeof amount === 'string') {
            amount = parseFloat(amount.replace(/[$,]/g, ''));
        }
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(new Date(date));
    }

    formatPercentage(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }).format(value / 100);
    }

    // Data export functionality
    exportData(type, format = 'json') {
        const data = window.dataService.exportToCSV(type);
        if (!data) {
            this.showNotification('No data available for export', 'error');
            return;
        }

        const blob = new Blob([data], { 
            type: format === 'csv' ? 'text/csv' : 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}-${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification(`${type} data exported successfully`, 'success');
    }

    // Handle app installation
    handleInstallPrompt() {
        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            this.showInstallButton();
        });

        window.addEventListener('appinstalled', () => {
            this.showNotification('App installed successfully!', 'success');
            deferredPrompt = null;
        });
    }

    showInstallButton() {
        // Add install button to navigation or show install prompt
        console.log('App can be installed');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    
    // Handle initial route
    const urlParams = new URLSearchParams(window.location.search);
    const initialView = urlParams.get('view') || 'insights';
    window.app.navigateToView(initialView, false);
});

// Handle app installation
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.app.handleInstallPrompt();
});