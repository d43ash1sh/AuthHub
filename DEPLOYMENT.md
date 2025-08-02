# AuthHub Deployment Guide

This guide covers multiple deployment options for AuthHub.

## 🚀 Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend) - Recommended

#### Frontend Deployment on Vercel

1. **Prepare for Vercel deployment:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   ```

2. **Deploy to Vercel:**
   ```bash
   # Deploy from project root
   vercel
   
   # Follow the prompts:
   # - Set up and deploy: Yes
   # - Which scope: Your account
   # - Link to existing project: No
   # - Project name: authhub
   # - Directory: ./
   # - Override settings: No
   ```

3. **Configure environment variables in Vercel:**
   - Go to your Vercel dashboard
   - Navigate to your project settings
   - Add environment variables:
     ```
     VITE_API_URL=https://your-backend-url.railway.app
     ```

#### Backend Deployment on Railway

1. **Create Railway account:**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy backend:**
   ```bash
   # Install Railway CLI
   npm i -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Initialize Railway project
   railway init
   
   # Deploy
   railway up
   ```

3. **Configure environment variables in Railway:**
   ```
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   SESSION_SECRET=your_session_secret
   DATABASE_URL=your_postgresql_url
   NODE_ENV=production
   ```

4. **Update Vercel configuration:**
   - Replace `your-backend-url.railway.app` in `vercel.json` with your actual Railway URL

### Option 2: Full Vercel Deployment (Next.js Conversion)

If you prefer to deploy everything on Vercel, you'll need to convert the project to Next.js:

1. **Install Next.js:**
   ```bash
   npm install next@latest react@latest react-dom@latest
   ```

2. **Convert API routes:**
   - Move server routes to `pages/api/`
   - Update imports and exports

3. **Update build configuration:**
   - Replace Vite with Next.js
   - Update package.json scripts

### Option 3: Docker Deployment

1. **Build Docker image:**
   ```bash
   docker build -t authhub .
   ```

2. **Run container:**
   ```bash
   docker run -p 3000:3000 \
     -e GITHUB_CLIENT_ID=your_client_id \
     -e GITHUB_CLIENT_SECRET=your_client_secret \
     -e SESSION_SECRET=your_session_secret \
     -e DATABASE_URL=your_database_url \
     authhub
   ```

3. **Deploy to platforms supporting Docker:**
   - **Render**: Upload Dockerfile
   - **Railway**: Supports Docker
   - **DigitalOcean App Platform**: Container deployment
   - **AWS ECS**: Container orchestration

## 🔧 Environment Variables

### Required for Production

```env
# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Session Management
SESSION_SECRET=long_random_string_at_least_32_characters

# Database (for production)
DATABASE_URL=postgresql://user:password@host:port/database

# Environment
NODE_ENV=production
PORT=3000
```

### Frontend Environment Variables

```env
# API URL (for frontend)
VITE_API_URL=https://your-backend-url.com
```

## 🌐 Domain Configuration

### GitHub OAuth App Settings

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Update your OAuth app:
   - **Homepage URL**: `https://your-vercel-domain.vercel.app`
   - **Authorization callback URL**: `https://your-backend-url.com/api/github/callback`

### Custom Domain (Optional)

1. **Vercel Custom Domain:**
   - Go to Vercel dashboard > Domains
   - Add your custom domain
   - Configure DNS records

2. **Railway Custom Domain:**
   - Go to Railway dashboard > Settings > Domains
   - Add custom domain
   - Configure DNS

## 📊 Database Setup

### Option 1: Neon (Recommended)

1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add to environment variables

### Option 2: Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Use the PostgreSQL connection string

### Option 3: Railway PostgreSQL

1. Create a new PostgreSQL service in Railway
2. Use the generated connection string

## 🔍 Health Checks

Your application includes health check endpoints:

- **Backend Health**: `GET /api/auth/user`
- **Frontend Health**: Root path `/`

## 📈 Monitoring

### Vercel Analytics

- Enable Vercel Analytics in your project settings
- Monitor performance and user behavior

### Railway Monitoring

- View logs in Railway dashboard
- Monitor resource usage
- Set up alerts

## 🔒 Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **HTTPS**: All production deployments use HTTPS
3. **CORS**: Configure CORS for your domains
4. **Rate Limiting**: Consider adding rate limiting
5. **Session Security**: Use secure session configuration

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**: Update CORS configuration in backend
2. **OAuth Redirect Issues**: Check callback URLs
3. **Database Connection**: Verify DATABASE_URL
4. **Build Failures**: Check Node.js version compatibility

### Debug Commands

```bash
# Check build locally
npm run build

# Test production build
npm start

# Check environment variables
echo $GITHUB_CLIENT_ID

# View logs
vercel logs
railway logs
```

## 📞 Support

If you encounter deployment issues:

1. Check the logs in your deployment platform
2. Verify environment variables
3. Test locally with production settings
4. Open an issue on GitHub

---

**Happy Deploying! 🚀** 