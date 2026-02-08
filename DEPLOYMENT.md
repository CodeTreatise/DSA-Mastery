# 🚀 GitHub Pages Deployment Guide

## Overview

DSA Mastery is automatically deployed to GitHub Pages using GitHub Actions. Every push to `main` branch triggers a build and deployment.

---

## ✅ Current Setup

### 1. **Base Path Configuration** 
Already configured in `vite.config.ts`:
```typescript
base: '/dsa-mastery/',
```

This ensures all assets and routes work correctly under `https://codetreatise.github.io/dsa-mastery/`

### 2. **GitHub Actions Workflow**
Automated CI/CD pipeline at `.github/workflows/deploy.yml`:
- ✅ Trigger on push to `main`
- ✅ Build with `npm run build`
- ✅ Deploy to GitHub Pages automatically

### 3. **Build Output**
Vite compiles to `dist/` directory:
```
npm run build
→ src/ + public/ → dist/ → GitHub Pages
```

---

## 🎯 How It Works

### Step-by-Step Flow:

```
1. Push to GitHub
   └─→ git push origin main

2. GitHub Actions Triggered
   └─→ .github/workflows/deploy.yml runs automatically

3. Build Process
   └─→ npm install
   └─→ npm run build
   └─→ Creates optimized dist/ folder

4. Artifact Upload
   └─→ GitHub Pages artifact created from dist/

5. Deployment
   └─→ Published to https://codetreatise.github.io/dsa-mastery/
```

---

## 📋 Deployment Checklist

### Before First Deployment:

- [x] Repository exists: `CodeTreatise/DSA-Mastery`
- [x] Main branch exists
- [x] vite.config.ts has `base: '/dsa-mastery/'`
- [x] .github/workflows/deploy.yml created
- [x] package.json has `build` script
- [x] tsconfig.json configured

### Enable GitHub Pages:

1. Go to **GitHub Repository Settings**
2. Navigate to **Pages** (left sidebar)
3. Under "Build and deployment":
   - Source: `Deploy from a branch`
   - Branch: `gh-pages`
   - Folder: `/ (root)`
4. Click **Save**

**OR** (Auto-managed by Actions):
- Source: `GitHub Actions`
- Let the workflow handle deployment

---

## 🔄 Deployment Process

### Automatic Deployment (Recommended)

Every time you push to `main`:

```bash
git add .
git commit -m "Update DSA content"
git push origin main
```

✅ GitHub Actions automatically:
1. Runs `npm install`
2. Runs `npm run build`
3. Deploys to GitHub Pages
4. Your site updates in ~2-3 minutes

### Manual Build (Local Testing)

```bash
# Build locally
npm run build

# Preview the build
npm run preview

# Visit http://localhost:4173/dsa-mastery/
```

---

## 📊 Current Workflow Status

### `.github/workflows/deploy.yml` includes:

```yaml
✅ Trigger: push to main branch
✅ Node.js 18 environment
✅ npm cache for faster builds
✅ TypeScript compilation
✅ Vite production build
✅ GitHub Pages deployment
✅ Concurrency control (cancels old runs)
✅ Environment URL output
```

---

## 🌐 Access Your Site

Once deployed:

```
https://codetreatise.github.io/dsa-mastery/
```

**Direct links:**
- Dashboard: `/#/`
- Topics: `/#/topics`
- Problems: `/#/problems`
- References: `/#/references`
- Companies: `/#/companies`
- Roadmap: `/#/roadmap`

---

## 🛠️ Build Configuration

### Scripts in `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "npm run build:content && tsc && vite build",
    "build:content": "node scripts/build-content.js",
    "preview": "vite preview"
  }
}
```

### Build Steps:
1. **build:content** → Parse markdown files into JSON
2. **tsc** → TypeScript type checking
3. **vite build** → Production bundle optimization

---

## 📈 Performance Optimizations

The production build includes:

- ✅ **Code Splitting** — Separate bundles for pages
- ✅ **Tree Shaking** — Unused code removed
- ✅ **Minification** — Smaller file sizes
- ✅ **Asset Optimization** — Images/CSS optimized
- ✅ **Gzip Compression** — GitHub Pages auto-gzips
- ✅ **Cache Busting** — Hash-based filenames

---

## 🔍 Monitor Deployment

### Via GitHub:

1. Go to **Actions** tab
2. See workflow history
3. Click latest run for details
4. Check logs for any issues

### Via GitHub Pages:

1. Go to **Settings → Pages**
2. See deployment status
3. Get the live URL

---

## ❌ Troubleshooting

### Issue: Site shows 404

**Cause:** Base path mismatch
```typescript
// Check vite.config.ts
base: '/dsa-mastery/', // ← Must include trailing slash
```

### Issue: Workflow fails

**Check:**
- Node.js version (18+)
- npm cache not corrupted
- No syntax errors in TypeScript
- Build command succeeds locally

### Issue: Assets not loading

**Cause:** Base path in HTML/JS not correct
```html
<!-- Router must use the base path -->
<script src="/dsa-mastery/src/main.ts"></script>
```

---

## 🔐 Environment Variables

Currently using public data files only (no secrets needed).

If adding private APIs in future:
```yaml
# In .github/workflows/deploy.yml
env:
  VITE_API_KEY: ${{ secrets.API_KEY }}
```

---

## 📦 Deployment Size

Typical build size:
```
dist/
├── index.html          ~2 KB
├── assets/
│   ├── main.js        ~150 KB (minified)
│   ├── vendor.js      ~50 KB (dependencies)
│   ├── style.css      ~40 KB (minified)
│   └── [pages/chunks]
└── public/            ~50 KB (data JSON files)

Total: ~300-400 KB (before gzip) → ~100-120 KB (after gzip)
```

---

## 🚀 Quick Deploy Commands

```bash
# Full deployment flow
git add .
git commit -m "DSA content update"
git push origin main

# That's it! GitHub Actions handles the rest
```

---

## 📚 Related Documentation

- **Vite Deployment Docs:** https://vitejs.dev/guide/static-deploy.html#github-pages
- **GitHub Pages Docs:** https://docs.github.com/en/pages
- **GitHub Actions Docs:** https://docs.github.com/en/actions

---

## ✨ What's Next?

- [ ] Custom domain (optional)
- [ ] Analytics integration (Google Analytics)
- [ ] Performance monitoring (Web Vitals)
- [ ] PR preview deployments
- [ ] Staging environment
- [ ] CDN caching strategy

---

**Your DSA Mastery site is live and automatically updating!** 🎉
