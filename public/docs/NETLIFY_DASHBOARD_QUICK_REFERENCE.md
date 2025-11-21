# Netlify Dashboard - Quick Reference Card

A quick reference for configuring your Netlify deployment settings.

---

## 🎯 Initial Setup (One-Time Configuration)

### Step 1: Connect to GitHub
1. Log in to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **GitHub**
4. Choose repository: **pandit-rajesh-joshi**

### Step 2: Build Settings (Auto-Detected)
```
✅ Build command:      npm run build
✅ Publish directory:  dist
✅ Node version:       20
```
Click **"Deploy site"**

---

## ⚙️ Essential Dashboard Settings

### 1️⃣ Site Settings → General

**Site Details:**
```
Site name:     panditrajesh (or your choice)
Custom domain: panditrajesh.ie (if you own it)
```

**Change Site Name:**
- Click **"Change site name"**
- Enter: `panditrajesh`
- Your URL becomes: `https://panditrajesh.netlify.app`

---

### 2️⃣ Site Settings → Domain Management

**Add Custom Domain:**
```
1. Click "Add custom domain"
2. Enter your domain: panditrajesh.ie
3. Choose DNS setup:

   Option A - Netlify DNS (Recommended):
   ✅ Easy SSL setup
   ✅ Automatic configuration

   Option B - External DNS:
   Add these records at your domain registrar:
   - A record: 75.2.60.5 (Netlify's load balancer)
   - CNAME for www: [your-site].netlify.app
```

**Enable HTTPS:**
- Automatic with Netlify DNS
- Click **"Verify DNS configuration"**
- SSL certificate issued within minutes

---

### 3️⃣ Site Settings → Build & Deploy

#### Build Settings
```
Base directory:     (leave empty)
Build command:      npm run build
Publish directory:  dist
```

#### Deploy Contexts

**Production Branch:**
```
✅ Branch:           main
✅ Auto publishing:  Enabled
```

**Deploy Previews:**
```
✅ Deploy previews for pull requests:  Enabled
✅ Preview mode:                        Any pull request
```

**Branch Deploys:**
```
⬜ Deploy all branches:  Disabled (recommended)
```

---

### 4️⃣ Site Settings → Build & Deploy → Post Processing

**Asset Optimization:**
```
✅ Pretty URLs:       Enabled
✅ Bundle CSS:        Enabled
✅ Minify CSS:        Enabled
✅ Minify JS:         Enabled
✅ Image compression: Enabled
```

---

### 5️⃣ Site Settings → Environment Variables

**Currently:** None required ✅

**To Add Later (if needed):**
```
Key:   VITE_API_URL
Value: https://your-api.com

Key:   VITE_GOOGLE_MAPS_KEY
Value: your-key-here
```

**Important:** Vite requires `VITE_` prefix

---

## 🚀 Daily Operations

### Check Deployment Status
**Deploys Tab:**
- View all deployments
- See build logs
- Check deploy status
- Trigger manual deploys

### Trigger Manual Deploy
```
Deploys → Trigger deploy → Deploy site
```

**Clear Cache & Deploy:**
```
Deploys → Trigger deploy → Clear cache and deploy site
```

---

## 🔄 Automatic Deployment Flow

```
1. Push to GitHub
   git push origin main

2. Netlify detects change
   ⚡ Build triggered automatically

3. Build process
   📦 npm install
   🔨 npm run build

4. Deploy to production
   ✅ Site live in 3-5 minutes

5. Notification
   📧 Email sent (if enabled)
```

---

## 🎨 Dashboard Navigation

```
📊 Overview
   └─ Site performance, deploys, bandwidth

🚀 Deploys
   └─ View all deployments, logs, status

📈 Analytics
   └─ Page views, visitors, bandwidth

🔗 Integrations
   └─ GitHub, Slack, webhooks

⚙️  Site settings
   ├─ General (site name, domain)
   ├─ Domain management
   ├─ Build & deploy
   ├─ Environment variables
   └─ Forms (if using)
```

---

## 📋 Common Tasks Checklist

### First Deployment
- [ ] Site connected to GitHub
- [ ] Build settings verified
- [ ] First deploy successful
- [ ] Site name customized
- [ ] Deploy previews enabled

### Custom Domain Setup
- [ ] Domain purchased
- [ ] DNS configured
- [ ] HTTPS enabled
- [ ] WWW redirect set up
- [ ] Domain verified

### Optimization
- [ ] Asset optimization enabled
- [ ] Cache headers configured
- [ ] Image compression on
- [ ] Security headers set
- [ ] Performance monitored

---

## 🐛 Quick Troubleshooting

### Build Failing?
```
1. Go to Deploys tab
2. Click failed deploy
3. View logs
4. Check error message
5. Fix locally: npm run build
6. Push again
```

### Site Not Loading?
```
✅ Check: Publish directory is "dist"
✅ Check: _redirects file in public/
✅ Check: netlify.toml present
```

### Need to Rollback?
```
Deploys → Find working deploy → Publish deploy
```

---

## 💡 Pro Tips

### Faster Deploys
- Enable build plugins
- Use dependency caching
- Optimize build command

### Better Workflow
- Use deploy previews for testing
- Enable branch protection on GitHub
- Set up Slack notifications

### Performance
- Monitor Core Web Vitals
- Use Netlify Analytics
- Enable image optimization

---

## 🎯 Settings Summary

### ✅ Recommended Settings

| Setting | Value | Location |
|---------|-------|----------|
| Build command | `npm run build` | Build settings |
| Publish dir | `dist` | Build settings |
| Node version | `20` | Auto from .nvmrc |
| Auto publish | Enabled | Deploy contexts |
| Deploy previews | Enabled | Deploy contexts |
| Asset optimization | All enabled | Post processing |
| HTTPS | Enabled | Domain management |
| Pretty URLs | Enabled | Post processing |

---

## 📞 Need Help?

**Build Logs:**
- Deploys → Click deploy → View logs

**Netlify Status:**
- https://www.netlifystatus.com

**Support:**
- Free tier: Community forum
- Paid tier: Support tickets

**Documentation:**
- https://docs.netlify.com

---

## ⚡ Quick Commands

```bash
# Test build locally
npm run build

# View build output
npm run preview

# Push to deploy
git add .
git commit -m "Deploy update"
git push origin main
```

---

**That's it! Your site is now live and auto-deploying! 🎉**
