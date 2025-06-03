# Vercel Deployment Learnings

## Issue: Configuration Syntax Conflicts

### Problem
Vercel import error: "If `rewrites`, `redirects`, `headers`, `cleanUrls` or `trailingSlash` are used, then `routes` cannot be present."

### Root Cause
Mixed legacy `routes` configuration with modern Vercel configuration syntax in `vercel.json`.

### Solutions Tried

#### 1. First Attempt - Convert routes to rewrites
```json
{
  "version": 2,
  "builds": [...],
  "routes": [...],  // Legacy syntax
  "rewrites": [...], // Modern syntax
  "headers": [...]   // Modern syntax
}
```
**Result**: Still failed - cannot mix `builds`/`routes` with modern syntax.

#### 2. Second Attempt - Remove routes, keep modern syntax
```json
{
  "rewrites": [...],
  "headers": [...]
}
```
**Result**: Still had conflicts due to complexity.

#### 3. Final Solution - Remove vercel.json entirely
**Result**: ✅ SUCCESS - Vercel auto-detects static sites perfectly.

### Key Learnings

1. **Auto-detection is preferred**: For simple static sites/PWAs, Vercel's auto-detection works better than custom configuration.

2. **Legacy vs Modern syntax**: Cannot mix:
   - Legacy: `version: 2`, `builds`, `routes`
   - Modern: `rewrites`, `redirects`, `headers`, `cleanUrls`, `trailingSlash`

3. **Static PWA deployment**: For vanilla JS PWAs served from a `public/` directory:
   - No `vercel.json` needed
   - Vercel automatically handles SPA routing
   - HTTPS and CDN enabled by default

4. **Git-based deployment**: Much more reliable than CLI deployment:
   - Push to GitHub/GitLab
   - Connect repository to Vercel
   - Automatic deployments on push

### Best Practices

1. **Start simple**: Begin without `vercel.json` and add configuration only if needed
2. **Use Git integration**: Avoid CLI deployment for production
3. **Test locally first**: Ensure proper static serving before deployment
4. **Service worker headers**: Can be added later with minimal `vercel.json` if needed

### When to use vercel.json

Only add `vercel.json` when you need:
- Custom headers (e.g., service worker headers)
- Specific rewrites beyond SPA routing
- Environment-specific configurations
- Custom build processes

### Working Configuration (if needed)
```json
{
  "headers": [
    {
      "source": "sw.js",
      "headers": [
        { "key": "Service-Worker-Allowed", "value": "/" }
      ]
    }
  ]
}
```

## Issue: npm install Failures During Deployment

### Problem
Vercel deployment failed with: "Required file src/app.js not found" during npm install phase.

### Root Cause
1. **Package.json scripts conflicts**: `prepare` script ran deployment validation during npm install
2. **File path mismatches**: Deployment script looked for files in old locations after project restructure
3. **Unnecessary script execution**: Vercel tried to run local development scripts

### Solutions Applied

#### 1. Remove Conflicting Scripts
```json
// BEFORE - Caused deployment failures
{
  "scripts": {
    "prepare": "./deploy.sh"  // Ran during npm install
  }
}

// AFTER - Clean for deployment
{
  "scripts": {
    "build": "echo 'No build step required for vanilla JS PWA'"
  }
}
```

#### 2. Add .vercelignore
```
deploy.sh
dev-server.py
*.md
!README.md
.env*
```

#### 3. Update File Paths in Scripts
```bash
# BEFORE - Old structure
required_files=(
    "src/app.js"
    "src/data/mockData.js"
)

# AFTER - New structure  
required_files=(
    "public/src/app.js"
    "public/src/data/mockData.js"
)
```

#### 4. Add CI Environment Detection
```bash
if [ "$VERCEL" = "1" ] || [ "$CI" = "true" ]; then
    echo "🔧 Running in CI/Vercel environment - skipping validation"
    exit 0
fi
```

### Key Learnings

1. **Package.json scripts run during deployment**: Avoid `prepare`, `preinstall`, or other lifecycle scripts that aren't needed for production
2. **File structure consistency**: Update all scripts when changing project structure
3. **CI environment awareness**: Scripts should detect and handle CI/deployment environments
4. **Separation of concerns**: Keep development scripts separate from deployment process

### Deployment Checklist
- [ ] Remove or simplify `vercel.json`
- [ ] Ensure all files are in `public/` directory
- [ ] Remove conflicting package.json scripts (`prepare`, etc.)
- [ ] Add `.vercelignore` for unnecessary files
- [ ] Update file paths in any remaining scripts
- [ ] Test static serving locally
- [ ] Commit to Git
- [ ] Push to remote repository
- [ ] Import to Vercel via Git integration
- [ ] Verify deployment works