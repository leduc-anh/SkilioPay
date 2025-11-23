# SkilioPay Deployment Guide

## 🚀 Quick Deployment to Vercel

This guide will walk you through deploying SkilioPay PayLater MVP to Vercel with Neon Postgres database.

### Prerequisites

- GitHub account with repository access
- Vercel account ([sign up free](https://vercel.com/signup))
- Neon account ([sign up free](https://neon.tech))

---

## Step 1: Create Neon Database

### 1.1 Sign Up for Neon

1. Go to [https://console.neon.tech](https://console.neon.tech)
2. Click **Sign Up** (free, no credit card required)
3. Sign up with GitHub for faster setup

### 1.2 Create Your Project

1. Click **Create Project**
2. Choose settings:
   - **Project Name**: `skiliopay-production`
   - **Region**: Choose closest to your users (e.g., US East for global, Singapore for Asia)
   - **Postgres Version**: 16 (recommended)
3. Click **Create Project**

### 1.3 Get Connection String

After project creation, you'll see connection details:

```bash
# Primary connection string (with connection pooling)
DATABASE_URL=postgresql://user:password@ep-xxx-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Copy this connection string** - you'll need it in the next steps.

---

## Step 2: Set Up Database Schema

### 2.1 Clone Repository (if not already)

```bash
git clone https://github.com/leduc-anh/SkilioPay.git
cd SkilioPay
npm install
```

### 2.2 Set Environment Variable

**Windows (PowerShell):**

```powershell
$env:DATABASE_URL="your-neon-connection-string-here"
```

**macOS/Linux:**

```bash
export DATABASE_URL="your-neon-connection-string-here"
```

### 2.3 Run Migration Script

```bash
npx tsx scripts/setupVercelDb.ts
```

**Expected Output:**

```
🔧 Setting up Neon Postgres database...
✅ Users table created
✅ Carts table created
✅ Agreements table created
✅ Installments table created
✅ Activity logs table created

🌱 Seeding database...
✅ Seeded 8 users
✅ Seeded 9 carts

✅ Database setup complete!
```

---

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

#### 3.1 Import Repository

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select your GitHub account
4. Search for `SkilioPay`
5. Click **Import**

#### 3.2 Configure Project

**Framework Preset**: Vite (auto-detected)

**Root Directory**: `./` (default)

**Build Command**: `npm run build` (auto-detected)

**Output Directory**: `dist` (auto-detected)

#### 3.3 Add Environment Variables

Click **Environment Variables** section:

| Key | Value | Environment |
|-----|-------|-------------|
| `DATABASE_URL` | Your Neon connection string | Production, Preview, Development |
| `VITE_USE_VERCEL_DB` | `true` | Production, Preview |

**Important**: Make sure to add `DATABASE_URL` to all environments (Production, Preview, Development)

#### 3.4 Deploy

1. Click **Deploy**
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `https://skilio-pay.vercel.app`

#### 3.5 Verify Deployment

Visit your deployment URL and test:

- ✅ Homepage loads
- ✅ Navigate through checkout flow
- ✅ Check dashboard with multiple plans
- ✅ Open browser console - no errors

---

### Option B: Deploy via Vercel CLI

#### 3.1 Install Vercel CLI

```bash
npm install -g vercel
```

#### 3.2 Login to Vercel

```bash
vercel login
```

Follow prompts to authenticate.

#### 3.3 Set Environment Variables

```bash
# Set DATABASE_URL
vercel env add DATABASE_URL
# Paste your Neon connection string when prompted
# Select: Production, Preview, Development

# Set VITE_USE_VERCEL_DB
vercel env add VITE_USE_VERCEL_DB
# Type: true
# Select: Production, Preview
```

#### 3.4 Deploy

**For production:**

```bash
vercel --prod
```

**For preview:**

```bash
vercel
```

#### 3.5 Get Deployment URL

After successful deployment, you'll see:

```
✅ Production: https://skilio-pay.vercel.app
```

---

## Step 4: Configure Custom Domain (Optional)

### 4.1 Add Domain in Vercel

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Domains**
3. Enter your domain (e.g., `skiliopay.com`)
4. Click **Add**

### 4.2 Update DNS Records

Vercel will show you DNS records to add:

**For apex domain (skiliopay.com):**

```
Type: A
Name: @
Value: 76.76.19.19
```

**For www subdomain:**

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 4.3 Verify Domain

Wait 5-10 minutes for DNS propagation, then click **Verify** in Vercel.

---

## Step 5: Enable Automatic Deployments

### 5.1 GitHub Integration (Automatic)

Vercel automatically deploys when you push to GitHub:

- **Push to `main`** → Production deployment
- **Push to other branches** → Preview deployment
- **Pull Requests** → Preview deployment with unique URL

### 5.2 Test Automatic Deployment

```bash
# Make a small change
echo "# Updated $(date)" >> README.md

# Commit and push
git add README.md
git commit -m "test: Trigger automatic deployment"
git push origin main
```

Watch deployment progress at [https://vercel.com/dashboard](https://vercel.com/dashboard)

---

## Troubleshooting

### Build Fails with TypeScript Errors

**Error:**

```
error TS6133: 'React' is declared but its value is never read
```

**Solution:**

```bash
# Remove unused imports
npm run build  # Test locally first
git add .
git commit -m "fix: Remove unused imports"
git push origin main
```

### Database Connection Fails

**Error:**

```
Error: Connection refused
```

**Solution:**

1. Verify `DATABASE_URL` is set in Vercel environment variables
2. Check connection string includes `?sslmode=require`
3. Ensure Neon database is not paused (free tier auto-pauses after 7 days inactivity)

### Environment Variables Not Working

**Solution:**

1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Ensure variables are added to correct environments (Production/Preview)
3. After adding variables, trigger new deployment:

   ```bash
   vercel --prod --force
   ```

### Build Output Too Large

**Error:**

```
Error: Maximum function size exceeded
```

**Solution:**
Optimize bundle size:

```bash
# Check bundle size
npm run build

# If needed, add to vite.config.ts:
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
      }
    }
  }
}
```

---

## Performance Optimization

### Enable Edge Runtime

In `vercel.json`:

```json
{
  "framework": "vite",
  "outputDirectory": "dist",
  "regions": ["iad1", "sin1"],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Add Analytics

1. Go to Vercel Dashboard → Your Project
2. Click **Analytics** tab
3. Enable **Web Analytics** (free)
4. Monitor:
   - Page load times
   - Core Web Vitals
   - Visitor traffic

---

## Monitoring & Maintenance

### Check Deployment Status

```bash
# List all deployments
vercel list

# Check specific deployment
vercel inspect <deployment-url>
```

### View Logs

```bash
# Real-time logs
vercel logs <deployment-url> --follow

# Or via Dashboard:
# Project → Deployments → [Select deployment] → Logs
```

### Database Maintenance

**Neon Console:** [https://console.neon.tech](https://console.neon.tech)

Monitor:

- Storage usage (3GB free tier limit)
- Active connections
- Query performance

**Backup Database:**

```bash
# Using pg_dump
pg_dump $DATABASE_URL > backup.sql

# Restore if needed
psql $DATABASE_URL < backup.sql
```

---

## Production Checklist

Before going live, verify:

- [ ] ✅ Database schema created and seeded
- [ ] ✅ Environment variables set (`DATABASE_URL`, `VITE_USE_VERCEL_DB`)
- [ ] ✅ Build passes with no errors
- [ ] ✅ All 6 screens load correctly
- [ ] ✅ Payment flow works end-to-end
- [ ] ✅ No console errors in browser
- [ ] ✅ Mobile responsive (test on phone)
- [ ] ✅ Analytics enabled
- [ ] ✅ Custom domain configured (if applicable)
- [ ] ✅ Automatic deployments working

---

## Cost Breakdown

### Free Tier Limits

**Vercel:**

- 100GB bandwidth/month
- 100 hours serverless function execution
- Unlimited deployments
- 1 concurrent build

**Neon:**

- 3GB storage
- 100 hours compute/month
- Unlimited projects
- Auto-pause after 5 minutes inactive

**Total Cost:** $0/month for MVP stage

### When to Upgrade

**Vercel Pro ($20/month):**

- Need > 100GB bandwidth
- Need > 100 hours function execution
- Want password protection
- Need advanced analytics

**Neon Scale ($19/month):**

- Need > 3GB storage
- Need > 100 hours compute
- Need branch reset
- Want point-in-time recovery

---

## Next Steps

After successful deployment:

1. **Share Your Link**: `https://skilio-pay.vercel.app`
2. **Monitor Performance**: Check Vercel Analytics daily
3. **Iterate**: Use preview deployments for testing new features
4. **Scale**: Upgrade when hitting free tier limits

---

## Support & Resources

- **Vercel Docs**: [https://vercel.com/docs](https://vercel.com/docs)
- **Neon Docs**: [https://neon.tech/docs](https://neon.tech/docs)
- **GitHub Issues**: [https://github.com/leduc-anh/SkilioPay/issues](https://github.com/leduc-anh/SkilioPay/issues)

---

**Deployed By**: SkilioPay Team  
**Last Updated**: November 23, 2025  
**Status**: ✅ Production Ready
