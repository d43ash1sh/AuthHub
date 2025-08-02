# 🚀 Deploy AuthHub to Vercel (Website Method)

This guide shows you how to deploy AuthHub directly from GitHub to Vercel using the website interface.

## 📋 Prerequisites

- ✅ Your project is pushed to GitHub: `https://github.com/d43ash1sh/AuthHub`
- ✅ You have a Vercel account (free)
- ✅ You have your GitHub OAuth credentials ready

## 🌐 Step-by-Step Deployment

### 1. Go to Vercel Dashboard

1. Visit [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click **"New Project"**

### 2. Import Your Repository

1. **Find your repository**: Search for `AuthHub` or `d43ash1sh/AuthHub`
2. **Click "Import"** on your AuthHub repository
3. **Configure the project**:
   - **Project Name**: `authhub` (or your preferred name)
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (should be auto-detected)
   - **Output Directory**: `dist/public` (should be auto-detected)

### 3. Configure Environment Variables

**For frontend-only deployment, you'll need to set up a backend separately.**

**Frontend Environment Variables (Optional):**
```
VITE_API_URL=https://your-backend-url.com
```

**Note:** You'll need to deploy the backend separately (Railway, Render, etc.) and update the API URL.

### 4. Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 2-3 minutes)
3. Your app will be live at: `https://your-project-name.vercel.app`

## 🔧 Post-Deployment Setup

### Deploy Backend Separately

Since this is a full-stack application, you'll need to deploy the backend separately:

1. **Option 1: Railway (Recommended)**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Deploy the backend with environment variables

2. **Option 2: Render**
   - Go to [render.com](https://render.com)
   - Create a new Web Service
   - Connect your GitHub repository

3. **Option 3: Heroku**
   - Go to [heroku.com](https://heroku.com)
   - Create a new app
   - Connect your GitHub repository

### Update GitHub OAuth App

1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. Find your AuthHub OAuth app
3. Update these URLs:
   - **Homepage URL**: `https://your-project-name.vercel.app`
   - **Authorization callback URL**: `https://your-backend-url.com/api/github/callback`

### Test Your Deployment

1. Visit your Vercel URL
2. Click "Sign in with GitHub"
3. Test all features:
   - ✅ GitHub OAuth login
   - ✅ Repository listing
   - ✅ Profile data
   - ✅ PDF generation

## 🎯 Custom Domain (Optional)

1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Configure DNS records as instructed

## 🚨 Troubleshooting

### Common Issues:

1. **Build Fails**: Check the build logs in Vercel dashboard
2. **OAuth Errors**: Verify your GitHub OAuth app URLs
3. **Environment Variables**: Make sure all variables are set correctly
4. **CORS Issues**: The app should work without CORS issues on Vercel

### Check Logs:

- Go to your Vercel project dashboard
- Click **"Functions"** to see serverless function logs
- Check **"Deployments"** for build logs

## 📞 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Verify environment variables
3. Test locally first
4. Open an issue on GitHub

---

**🎉 Your AuthHub will be live on Vercel in minutes!** 