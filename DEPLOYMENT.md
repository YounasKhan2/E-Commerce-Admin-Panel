# Deployment Guide - Metrix Commerce Admin Panel

## Prerequisites

Before deploying, ensure you have:

1. ✅ A Vercel account ([sign up here](https://vercel.com/signup))
2. ✅ An Appwrite account with configured backend
3. ✅ Git repository (GitHub, GitLab, or Bitbucket)
4. ✅ All environment variables ready

## Step 1: Prepare Your Repository

### 1.1 Commit All Changes

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 1.2 Verify Files

Ensure these files exist:
- ✅ `vercel.json` - Vercel configuration
- ✅ `.env.example` - Environment variables template
- ✅ `public/favicon.svg` - Favicon
- ✅ `public/manifest.json` - PWA manifest
- ✅ `public/robots.txt` - SEO configuration

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Sign in with your account

2. **Import Git Repository**
   - Click "Add New Project"
   - Select your Git provider (GitHub, GitLab, Bitbucket)
   - Find and import your repository

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `ecommerce-admin` (if in monorepo) or `./`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Add Environment Variables**
   
   Click "Environment Variables" and add:
   
   ```
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_actual_project_id
   NEXT_PUBLIC_APP_NAME=Metrix Commerce
   NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
   ```
   
   **Important**: Replace `your_actual_project_id` with your real Appwrite Project ID

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-5 minutes)
   - Your app will be live at `https://your-project.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd ecommerce-admin
   vercel
   ```

4. **Follow Prompts**
   - Set up and deploy? `Y`
   - Which scope? Select your account
   - Link to existing project? `N`
   - Project name? `metrix-commerce-admin`
   - Directory? `./`
   - Override settings? `N`

5. **Add Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_APPWRITE_ENDPOINT
   vercel env add NEXT_PUBLIC_APPWRITE_PROJECT_ID
   vercel env add NEXT_PUBLIC_APP_NAME
   vercel env add NEXT_PUBLIC_APP_URL
   ```

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Step 3: Configure Custom Domain (Optional)

1. **Go to Project Settings**
   - Open your project in Vercel Dashboard
   - Go to "Settings" → "Domains"

2. **Add Domain**
   - Enter your domain (e.g., `admin.yourdomain.com`)
   - Follow DNS configuration instructions
   - Wait for DNS propagation (5-60 minutes)

3. **Update Environment Variable**
   ```
   NEXT_PUBLIC_APP_URL=https://admin.yourdomain.com
   ```

4. **Redeploy**
   - Trigger a new deployment for changes to take effect

## Step 4: Configure Appwrite CORS

1. **Go to Appwrite Console**
   - Navigate to your project
   - Go to "Settings" → "Platforms"

2. **Add Web Platform**
   - Click "Add Platform"
   - Select "Web App"
   - Name: `Metrix Commerce Admin`
   - Hostname: `your-project.vercel.app` (or your custom domain)
   - Click "Add"

3. **Add Multiple Domains** (if needed)
   - Add both Vercel domain and custom domain
   - Add `localhost:3000` for local development

## Step 5: Verify Deployment

### 5.1 Check Build Logs

- Go to Vercel Dashboard → Your Project → Deployments
- Click on latest deployment
- Check "Building" logs for errors

### 5.2 Test Application

Visit your deployed URL and verify:

- ✅ Login page loads correctly
- ✅ Can log in with Appwrite credentials
- ✅ Dashboard displays without errors
- ✅ Navigation works
- ✅ Data loads from Appwrite
- ✅ Images display correctly
- ✅ All features work as expected

### 5.3 Check Console for Errors

- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed requests

## Step 6: Set Up Automatic Deployments

Vercel automatically deploys when you push to your repository:

- **Production**: Pushes to `main` branch
- **Preview**: Pushes to other branches or pull requests

### Configure Branch Protection

1. Go to GitHub repository settings
2. Add branch protection rule for `main`
3. Require pull request reviews
4. Enable status checks

## Troubleshooting

### Build Fails

**Error**: `Module not found`
- **Solution**: Ensure all dependencies are in `package.json`
- Run `npm install` locally to verify

**Error**: `Environment variable not found`
- **Solution**: Add missing environment variables in Vercel Dashboard

### Runtime Errors

**Error**: `Failed to fetch from Appwrite`
- **Solution**: Check CORS settings in Appwrite Console
- Verify `NEXT_PUBLIC_APPWRITE_ENDPOINT` is correct

**Error**: `Unauthorized`
- **Solution**: Verify `NEXT_PUBLIC_APPWRITE_PROJECT_ID` is correct
- Check Appwrite API keys and permissions

### Performance Issues

**Slow Loading**
- Enable Vercel Analytics
- Check bundle size: `npm run build`
- Optimize images
- Enable caching

## Environment Variables Reference

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_APPWRITE_ENDPOINT` | Appwrite API endpoint | `https://cloud.appwrite.io/v1` | Yes |
| `NEXT_PUBLIC_APPWRITE_PROJECT_ID` | Your Appwrite project ID | `64f8a9b2c3d4e5f6g7h8` | Yes |
| `NEXT_PUBLIC_APP_NAME` | Application name | `Metrix Commerce` | No |
| `NEXT_PUBLIC_APP_URL` | Deployed application URL | `https://admin.yourdomain.com` | No |

## Security Checklist

Before going live:

- ✅ All environment variables are set
- ✅ `.env.local` is in `.gitignore`
- ✅ CORS is configured in Appwrite
- ✅ API keys have proper permissions
- ✅ Authentication is working
- ✅ HTTPS is enabled (automatic with Vercel)
- ✅ Security headers are configured (in `vercel.json`)
- ✅ `robots.txt` prevents indexing

## Monitoring and Analytics

### Enable Vercel Analytics

1. Go to Project Settings → Analytics
2. Enable "Vercel Analytics"
3. View real-time metrics

### Enable Vercel Speed Insights

1. Install package:
   ```bash
   npm install @vercel/speed-insights
   ```

2. Add to layout:
   ```javascript
   import { SpeedInsights } from '@vercel/speed-insights/next';
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <SpeedInsights />
         </body>
       </html>
     );
   }
   ```

## Continuous Deployment

### Automatic Deployments

Vercel automatically deploys on:
- Push to `main` → Production
- Push to other branches → Preview
- Pull requests → Preview

### Manual Deployments

Trigger manual deployment:
```bash
vercel --prod
```

Or via Vercel Dashboard:
- Go to Deployments
- Click "Redeploy"

## Rollback

If deployment has issues:

1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

## Support

For deployment issues:

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Appwrite Docs**: [appwrite.io/docs](https://appwrite.io/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

## Post-Deployment

After successful deployment:

1. ✅ Update README with live URL
2. ✅ Share with team members
3. ✅ Set up monitoring alerts
4. ✅ Configure backup strategy
5. ✅ Document any custom configurations

---

## Quick Deploy Button

Add this to your README for one-click deployment:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/your-repo)
```

---

**Congratulations!** 🎉 Your Metrix Commerce Admin Panel is now live!
