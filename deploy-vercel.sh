#!/bin/bash

# Vercel Deployment Script for Super Resolution Frontend
# This script deploys the Next.js frontend to Vercel

set -e

echo "🚀 Starting Vercel deployment for Super Resolution Frontend..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the frontend directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build the project
echo "🔨 Building the project..."
pnpm run build

# Login to Vercel (if not already logged in)
echo "🔐 Checking Vercel authentication..."
vercel whoami || {
    echo "Please login to Vercel:"
    vercel login
}

# Set environment variables for deployment
echo "🔧 Setting up environment variables..."

# Prompt for backend URL if not set
if [ -z "$NEXT_PUBLIC_BACKEND_URL" ]; then
    echo "Please enter your backend URL (e.g., https://your-backend.onrender.com):"
    read -r BACKEND_URL
    export NEXT_PUBLIC_BACKEND_URL="$BACKEND_URL"
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."

# For production deployment
vercel --prod \
    --env NEXT_PUBLIC_BACKEND_URL="$NEXT_PUBLIC_BACKEND_URL" \
    --name super-resolution-frontend \
    --confirm

echo "✅ Deployment completed successfully!"
echo "🌐 Your frontend is now live on Vercel"
echo "🔗 Backend URL configured: $NEXT_PUBLIC_BACKEND_URL"

# Get the deployment URL
DEPLOYMENT_URL=$(vercel ls super-resolution-frontend --limit 1 | grep "https://" | awk '{print $2}' | head -1)

if [ -n "$DEPLOYMENT_URL" ]; then
    echo "🎉 Frontend URL: $DEPLOYMENT_URL"
    echo "📝 Don't forget to update your backend CORS settings with this URL!"
else
    echo "ℹ️  Check your Vercel dashboard for the deployment URL"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Update your backend's FRONTEND_URL environment variable with the Vercel URL"
echo "2. Redeploy your backend with the updated CORS settings"
echo "3. Test the complete application flow"
