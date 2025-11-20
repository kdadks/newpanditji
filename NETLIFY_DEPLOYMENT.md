# Netlify Deployment Guide

Complete guide to deploy this website to Netlify with automated CI/CD from GitHub.

---

## 📋 Prerequisites

Before you begin, ensure you have:
- ✅ GitHub account (free)
- ✅ Netlify account (free tier available at https://netlify.com)
- ✅ Your code pushed to a GitHub repository
- ✅ Admin access to the GitHub repository

---

## 🚀 Step-by-Step Deployment Instructions

### Part 1: Push Code to GitHub (If Not Done Already)

1. **Initialize Git Repository** (skip if already done):
   ```bash
   cd "/Users/prashant/Documents/Application directory/pandit-rajesh-joshi"
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. **Verify your repository** is accessible on GitHub

---

### Part 2: Connect Netlify to GitHub

#### Step 1: Sign Up / Log In to Netlify
1. Go to https://netlify.com
2. Click **"Sign up"** or **"Log in"**
3. Choose **"Sign up with GitHub"** (recommended)
4. Authorize Netlify to access your GitHub account

#### Step 2: Create New Site from Git
1. Once logged in, click **"Add new site"** → **"Import an existing project"**
2. Click **"Deploy with GitHub"**
3. You may need to authorize Netlify to access your repositories
4. Select your repository: **`pandit-rajesh-joshi`**

#### Step 3: Configure Build Settings

Netlify should auto-detect the settings from `netlify.toml`, but verify:

| Setting | Value |
|---------|-------|
| **Base directory** | (leave empty) |
| **Build command** | `npm run build` |
| **Publish directory** | `dist` |
| **Node version** | 20 |

✅ **These values should be pre-filled from `netlify.toml`**

#### Step 4: Deploy!
1. Click **"Deploy [site-name]"** button
2. Wait for the build to complete (2-5 minutes for first deploy)
3. Your site will be live at `https://[random-name].netlify.app`

---

### Part 3: Configure Custom Domain (Optional)

#### Option A: Use Netlify Subdomain
1. Go to **Site settings** → **Domain management**
2. Click **"Options"** → **"Edit site name"**
3. Choose a custom name: `panditrajesh.netlify.app`

#### Option B: Use Your Own Domain
1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain: `panditrajesh.ie` or `panditrajesh.com`
4. Follow Netlify's DNS instructions:
   - **If using Netlify DNS** (recommended):
     - Add name servers to your domain registrar
     - Netlify provides 4 name servers
   - **If using external DNS**:
     - Add A record pointing to Netlify's load balancer
     - Add CNAME record for www subdomain

5. Enable **HTTPS** (automatic with Let's Encrypt)

---

### Part 4: Netlify Dashboard Configuration

#### 4.1 Site Settings

Navigate to: **Site settings** → **General**

**Site Information:**
- **Site name**: Choose a memorable name (e.g., `panditrajesh`)
- **Site description**: "Traditional Hindu Religious Services & Spiritual Guidance"

#### 4.2 Build Settings

Navigate to: **Site settings** → **Build & deploy** → **Build settings**

Verify these settings:

```
Base directory:        (leave empty)
Build command:         npm run build
Publish directory:     dist
```

**Environment Variables:** (None required for this project)

#### 4.3 Deploy Settings

Navigate to: **Site settings** → **Build & deploy** → **Deploy contexts**

**Production Branch:**
- Branch: `main` (or `master`)
- Auto publishing: **Enabled** ✅

**Deploy Previews:**
- Enable deploy previews: **Enabled** ✅
- Only deploy pull requests: **Enabled** (optional)

**Branch Deploys:**
- All branches: **Disabled** (recommended)
- Or specify staging branches if needed

#### 4.4 Forms (If Using Contact Forms)

Navigate to: **Site settings** → **Forms**

- Form detection: **Enabled** ✅
- Spam filtering: **Enabled** ✅
- Form notifications: Configure email notifications

#### 4.5 Performance & Security

Navigate to: **Site settings** → **Build & deploy** → **Post processing**

**Asset Optimization:**
- Pretty URLs: **Enabled** ✅
- Bundle CSS: **Enabled** ✅
- Minify CSS: **Enabled** ✅
- Minify JS: **Enabled** ✅
- Compress images: **Enabled** ✅

---

### Part 5: Environment Variables (If Needed Later)

If you add backend APIs or services later:

1. Go to **Site settings** → **Environment variables**
2. Click **"Add a variable"**
3. Add key-value pairs:
   ```
   Example:
   VITE_API_URL=https://api.example.com
   VITE_GOOGLE_MAPS_KEY=your-key-here
   ```

**Note:** Vite requires environment variables to start with `VITE_`

---

## 🔄 Automated Deployment Workflow

Once configured, deployments are **fully automated**:

### How It Works:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Update content"
   git push origin main
   ```

2. **Netlify Automatically:**
   - Detects the push to `main` branch
   - Pulls the latest code
   - Runs `npm install`
   - Runs `npm run build`
   - Deploys to production
   - Updates the live site

3. **Deployment Status:**
   - Check build logs in Netlify dashboard
   - Receive email notifications (if enabled)
   - See deploy preview for pull requests

### Deployment Timeline:
- **Build time:** 2-3 minutes
- **Total deployment:** 3-5 minutes
- **Deploy previews:** Available instantly for PRs

---

## 🔍 Deploy Previews (For Pull Requests)

When you create a pull request on GitHub:

1. Netlify automatically creates a **deploy preview**
2. A unique URL is generated: `deploy-preview-[PR#]--[site-name].netlify.app`
3. Test changes before merging to production
4. Preview URL is posted as a comment on the PR

**To Enable:**
- Go to **Site settings** → **Build & deploy** → **Deploy contexts**
- Enable "Deploy previews" for pull requests

---

## 🐛 Troubleshooting

### Build Fails

**Check build logs:**
1. Go to **Deploys** tab
2. Click on failed deploy
3. View full logs

**Common issues:**
- **Node version mismatch:** Check `.nvmrc` file (should be `20`)
- **Missing dependencies:** Clear cache and retry deploy
- **Build command error:** Verify `npm run build` works locally

**Fix:**
```bash
# Test build locally
npm run build

# If successful, push again
git push origin main
```

### Site Not Loading / 404 Errors

**Issue:** Client-side routing not working

**Solution:** Already fixed! Files in place:
- `netlify.toml` - Contains redirect rules
- `public/_redirects` - Backup redirect rules

### Environment Variables Not Working

**Issue:** Variables not accessible in build

**Solution:**
1. Go to **Site settings** → **Environment variables**
2. Ensure variables start with `VITE_` prefix
3. Redeploy site: **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

---

## 📊 Monitoring & Analytics

### Build Status Badge

Add to your README.md:
```markdown
[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-SITE-ID/deploy-status)](https://app.netlify.com/sites/YOUR-SITE-NAME/deploys)
```

Get your badge URL from: **Site settings** → **General** → **Status badges**

### Analytics

Navigate to: **Analytics** tab

View:
- Page views
- Unique visitors
- Bandwidth usage
- Top pages
- 404 errors

---

## 🎯 Best Practices

### 1. Branch Protection
- Enable branch protection on GitHub
- Require deploy preview before merging
- Use pull requests for all changes

### 2. Deployment Strategy
- Keep `main` branch stable
- Use feature branches for development
- Review deploy previews before merging

### 3. Performance
- Enable asset optimization in Netlify
- Use image optimization
- Monitor Core Web Vitals

### 4. Security
- Enable HTTPS (automatic)
- Set security headers (already configured in `netlify.toml`)
- Regular dependency updates

---

## 📁 Files Added for Netlify

```
pandit-rajesh-joshi/
├── netlify.toml           # Main Netlify configuration
├── .nvmrc                 # Node version specification
└── public/
    └── _redirects         # SPA routing redirects
```

### `netlify.toml` Configuration

Our `netlify.toml` includes:
- ✅ Build command and publish directory
- ✅ Node version specification
- ✅ SPA redirect rules
- ✅ Security headers (XSS, clickjacking protection)
- ✅ Cache headers for assets
- ✅ Asset optimization settings

---

## 🆘 Support & Resources

### Netlify Documentation
- Main docs: https://docs.netlify.com
- Build configuration: https://docs.netlify.com/configure-builds/overview/
- Redirects: https://docs.netlify.com/routing/redirects/

### Community Support
- Netlify Support Forum: https://answers.netlify.com
- Netlify Support Team (paid plans)

### Check Deployment Status
- Netlify Dashboard: https://app.netlify.com
- Your site URL: `https://[your-site-name].netlify.app`

---

## ✅ Checklist: Deployment Complete

- [ ] GitHub repository created and code pushed
- [ ] Netlify account created
- [ ] Site connected to GitHub repository
- [ ] First deployment successful
- [ ] Custom domain configured (optional)
- [ ] HTTPS enabled (automatic)
- [ ] Deploy previews enabled
- [ ] Performance optimization enabled
- [ ] Build badge added to README (optional)
- [ ] Team members added (if applicable)

---

## 🎉 You're Live!

Your website is now deployed with:
- ✅ Automated deployments on every push
- ✅ Deploy previews for pull requests
- ✅ Free SSL certificate
- ✅ CDN with global edge network
- ✅ Automatic asset optimization
- ✅ 100GB bandwidth (free tier)

**Next Steps:**
1. Share your live URL
2. Set up custom domain
3. Monitor analytics
4. Continue developing with confidence!

---

## 📞 Contact & Support

For issues with this deployment:
1. Check Netlify build logs
2. Review this documentation
3. Check GitHub repository issues
4. Contact Netlify support

**Happy Deploying! 🚀**
