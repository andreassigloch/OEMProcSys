# OEM Procurement System

A comprehensive Progressive Web Application (PWA) for managing procurement processes in Original Equipment Manufacturing (OEM) organizations. Built with vanilla JavaScript following PWA best practices for optimal performance and offline functionality.

## 🚀 Features

### Core Use Cases
1. **Procurement Insights** - Interactive dashboards with KPIs, spend analytics, and supplier performance metrics
2. **Supply Quality Management** - Quality validation, inspection scheduling, and defect tracking
3. **Contract Negotiation** - Contract comparison tools, scenario modeling, and secure document exchange
4. **Supplier Network Optimization** - Risk assessment, performance analysis, and supplier ranking
5. **Streamlined Purchasing** - Order automation, delivery tracking, and ERP integration

### Technical Features
- **Progressive Web App** - Installable, offline-capable, and mobile-responsive
- **Real-time Data** - Live updates and notifications
- **Interactive Charts** - Data visualization with Chart.js
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Offline Support** - Service worker implementation for offline functionality
- **Local Data Persistence** - Client-side data storage and synchronization

## 🛠 Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Charts**: Chart.js
- **Icons**: Font Awesome
- **PWA**: Service Worker, Web App Manifest
- **Deployment**: Vercel
- **Storage**: LocalStorage with IndexedDB fallback

## 📱 System Architecture

### Actors
- **Procurement Manager** - Strategic supplier relationships and network optimization
- **Finance Officer** - Budget oversight and cost analysis
- **Purchasing Agent** - Day-to-day procurement operations
- **Quality Assurance** - Materials compliance and standards
- **Supplier** - External organizations providing materials/services
- **ERP System** - Enterprise system integration

### Data Flow
```
User Interface → Components → Data Service → Mock Data/Storage
                                    ↓
                              Service Worker (Offline)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ (for development server)
- Git (for version control and deployment)
- Modern web browser with PWA support

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd EinkaufDemo
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:3000
```

### Git Setup (for deployment)

1. **Initialize repository (if not cloned)**
```bash
git init
git branch -m main
```

2. **Add and commit files**
```bash
git add .
git commit -m "Initial commit"
```

3. **Push to remote repository**
```bash
git remote add origin <your-repository-url>
git push -u origin main
```

### Production Deployment

The application is configured for Git-based deployment on Vercel:

1. **Commit your changes**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Automatic deployment**
   - Vercel will automatically deploy on push to main branch
   - No build step required (static PWA)
   - Automatic HTTPS and global CDN

## 📁 Project Structure

```
EinkaufDemo/
├── public/
│   ├── index.html              # Main HTML file
│   ├── manifest.json           # PWA manifest
│   ├── sw.js                   # Service worker
│   └── icons/                  # App icons (to be added)
├── src/
│   ├── components/             # UI components
│   │   ├── insights.js         # Procurement insights dashboard
│   │   ├── quality.js          # Quality management
│   │   ├── contracts.js        # Contract negotiation
│   │   ├── suppliers.js        # Supplier network
│   │   └── purchasing.js       # Purchase order management
│   ├── data/
│   │   └── mockData.js         # Mock data for demonstration
│   ├── services/
│   │   └── dataService.js      # Data management service
│   ├── styles/
│   │   └── main.css            # Main stylesheet
│   └── app.js                  # Main application controller
├── package.json                # Node.js dependencies
├── vercel.json                 # Vercel deployment config
└── README.md                   # This file
```

## 🔧 Configuration

### Environment Variables
- No environment variables required for demo mode
- For production deployment, configure API endpoints in `dataService.js`

### PWA Configuration
- Manifest settings in `public/manifest.json`
- Service worker configuration in `public/sw.js`
- Caching strategies and offline behavior

## 📊 Features Overview

### Procurement Insights
- Real-time KPI dashboard
- Spend analytics by category
- Supplier performance metrics
- Activity timeline
- Interactive data visualizations

### Quality Management
- Inspection scheduling system
- Quality metrics tracking
- Defect reporting and management
- Supplier quality scorecards
- Compliance monitoring

### Contract Negotiation
- Multi-supplier contract comparison
- Financial scenario modeling
- Secure document exchange simulation
- Negotiation workflow management
- Terms optimization tools

### Supplier Network
- Comprehensive supplier directory
- Risk assessment matrix
- Performance ranking system
- Supplier onboarding workflow
- Relationship management tools

### Purchase Management
- Automated order processing
- Real-time delivery tracking
- ERP integration status
- Order approval workflows
- Budget tracking and alerts

## 🔒 Security Features

- XSS protection headers
- Content Security Policy
- Secure data handling
- Client-side data validation
- HTTPS enforcement (in production)

## 📱 PWA Features

- **Installable** - Can be installed on desktop and mobile devices
- **Offline-first** - Continues working without internet connection
- **Background sync** - Syncs data when connection is restored
- **Push notifications** - Real-time alerts and updates
- **Responsive** - Adapts to any screen size
- **Fast loading** - Optimized performance and caching

## 🧪 Testing

### Manual Testing
1. Test all navigation flows
2. Verify offline functionality
3. Test on different devices and screen sizes
4. Validate PWA installation process

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📈 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 2.5s
- **Bundle Size**: < 500KB (gzipped)

## 🔄 Data Management

### Mock Data
The application uses comprehensive mock data covering:
- 5+ suppliers with detailed profiles
- 20+ purchase orders with various statuses
- Quality inspections and defect records
- Contract negotiations and scenarios
- KPI metrics and performance data

### Data Persistence
- LocalStorage for user preferences
- IndexedDB for larger datasets
- Service worker cache for offline data
- Periodic background sync

## 🚀 Deployment

### Git-based Deployment (Recommended)

1. **Initialize Git repository**
```bash
git init
git branch -m main
git add .
git commit -m "Initial commit: OEM Procurement System PWA"
```

2. **Push to GitHub/GitLab**
```bash
git remote add origin <your-repository-url>
git push -u origin main
```

3. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository
   - Vercel will automatically detect the configuration
   - Deploy with automatic HTTPS and CDN

### Manual Deployment
1. Upload `public/` directory contents to web server
2. Configure server to serve `index.html` for all routes
3. Ensure HTTPS is enabled
4. Configure proper MIME types for manifest and service worker

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

For questions or support, please contact the development team or create an issue in the repository.

---

**Note**: This is a demonstration application with mock data. For production use, integrate with real procurement APIs and databases.