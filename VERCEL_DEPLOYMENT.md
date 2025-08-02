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

**Before deploying, add these environment variables:**

Click **"Environment Variables"** and add:

```
GITHUB_CLIENT_ID=Ov23liqS4l1ALDCZdj7m
GITHUB_CLIENT_SECRET=f6c2d75ce69a433a0a28d4d0f9ff9da6a4b37d29
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
NODE_ENV=production
```

### 4. Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 2-3 minutes)
3. Your app will be live at: `https://your-project-name.vercel.app`

## 🔧 Post-Deployment Setup

### Update GitHub OAuth App

1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. Find your AuthHub OAuth app
3. Update these URLs:
   - **Homepage URL**: `https://your-project-name.vercel.app`
   - **Authorization callback URL**: `https://your-project-name.vercel.app/api/github/callback`

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