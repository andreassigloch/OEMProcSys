# Quick Deployment Guide

## 🚀 Deploy to Vercel (Recommended)

### Step 1: Prepare Git Repository
```bash
# Initialize git (if not already done)
git init
git branch -m main

# Add all files
git add .
git commit -m "Initial commit: OEM Procurement System PWA"
```

### Step 2: Push to GitHub/GitLab
```bash
# Create repository on GitHub/GitLab first, then:
git remote add origin <your-repository-url>
git push -u origin main
```

### Step 3: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub/GitLab
3. Click "New Project"
4. Import your repository
5. Vercel auto-detects settings (no configuration needed)
6. Click "Deploy"

✅ **Done!** Your PWA is live with automatic HTTPS and global CDN.

---

## 🧪 Local Testing

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
open http://localhost:3000
```

---

## 📱 PWA Features to Test

- [ ] Install app on desktop/mobile
- [ ] Test offline functionality (disconnect internet)
- [ ] Navigate through all 5 modules
- [ ] Test responsive design on mobile
- [ ] Verify charts and data visualization
- [ ] Test modal forms and data entry

---

## 🔧 Configuration Files

- `vercel.json` - Deployment configuration
- `manifest.json` - PWA settings
- `sw.js` - Service worker for offline
- `package.json` - Dependencies and scripts

No build step required - pure vanilla JavaScript PWA!

---

## 🆘 Troubleshooting

**Service Worker not loading?**
- Ensure HTTPS in production
- Check browser console for errors

**PWA not installable?**
- Add icons to `public/icons/` directory
- Verify manifest.json is accessible

**Charts not showing?**
- Check Chart.js CDN connection
- Verify data in browser console

---

## 📞 Need Help?

The app uses mock data and runs entirely client-side. No backend or database required for demonstration.