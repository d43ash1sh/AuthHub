#!/bin/bash

echo "🚀 AuthHub Deployment Script"
echo "=============================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
else
    echo "✅ Vercel CLI is already installed"
fi

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
else
    echo "✅ Railway CLI is already installed"
fi

echo ""
echo "🔧 Next Steps:"
echo "1. Deploy Frontend to Vercel:"
echo "   vercel"
echo ""
echo "2. Deploy Backend to Railway:"
echo "   railway login"
echo "   railway init"
echo "   railway up"
echo ""
echo "3. Configure Environment Variables:"
echo "   - Add your GitHub OAuth credentials"
echo "   - Set up a PostgreSQL database"
echo "   - Update callback URLs"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "🎉 Happy Deploying!" 