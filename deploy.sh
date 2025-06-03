#!/bin/bash

# OEM Procurement System - Git-based Deployment Helper
# This script helps prepare the project for Git deployment

set -e

echo "🚀 Preparing OEM Procurement System for Git deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "📝 Initializing Git repository..."
    git init
    git branch -m main
fi

# Install dependencies if needed (for local testing)
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies for local testing..."
    npm install
fi

# Run basic validation
echo "🔍 Validating project structure..."

# Check required files
required_files=(
    "public/index.html"
    "public/manifest.json"
    "public/sw.js"
    "src/app.js"
    "src/data/mockData.js"
    "src/services/dataService.js"
    "vercel.json"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Error: Required file $file not found."
        exit 1
    fi
done

echo "✅ Project structure validation passed."

# Check Git status
if [ -n "$(git status --porcelain)" ]; then
    echo "📋 You have uncommitted changes:"
    git status --short
    echo ""
    read -p "Do you want to commit these changes? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "💾 Adding and committing changes..."
        git add .
        read -p "Enter commit message (or press Enter for default): " commit_msg
        if [ -z "$commit_msg" ]; then
            commit_msg="Update OEM Procurement System"
        fi
        git commit -m "$commit_msg"
    fi
else
    echo "✅ Git working directory is clean."
fi

echo ""
echo "🎯 Next steps for deployment:"
echo "1. Push to your Git repository:"
echo "   git remote add origin <your-repo-url>"
echo "   git push -u origin main"
echo ""
echo "2. Deploy to Vercel:"
echo "   - Visit vercel.com"
echo "   - Click 'New Project'"
echo "   - Import your Git repository"
echo "   - Vercel will auto-deploy"
echo ""
echo "3. For local testing, run:"
echo "   npm run dev"
echo ""
echo "✅ Project is ready for Git-based deployment!"