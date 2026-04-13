#!/bin/bash
# ==========================================================
# TAW10 — Hostinger Deployment Script
# Run this on Hostinger via SSH after uploading project files
# ==========================================================

set -e  # exit on any error

echo "🚀 Starting TAW10 deployment..."

# 1. Install dependencies (production only)
echo "📦 Installing dependencies..."
npm ci --omit=dev

# 2. Install devDependencies for build
echo "📦 Installing dev dependencies for build..."
npm ci

# 3. Build the app (Handles copying internally now)
echo "🔨 Building Next.js app..."
npm run build

# 4. Create logs directory
mkdir -p logs

# 7. Start with PM2 (or restart if already running)
echo "⚡ Starting app with PM2..."
if pm2 describe taw10 > /dev/null 2>&1; then
  pm2 reload ecosystem.config.js --update-env
else
  pm2 start ecosystem.config.js
fi

# 8. Save PM2 process list so it survives reboots
pm2 save

echo "✅ Deployment complete! TAW10 is running."
