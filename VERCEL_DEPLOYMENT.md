# Vercel Deployment Guide

## Environment Variables Required

Set these environment variables in your Vercel dashboard:

### Required Variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Optional Variables:
- `SUPABASE_SERVICE_ROLE_KEY` - For admin operations (if needed)
- `NEXT_PUBLIC_SITE_URL` - Your custom domain URL (if using custom domain)

## Deployment Steps

1. **Connect your repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub/GitLab repository
   - Vercel will automatically detect it's a Next.js project

2. **Set Environment Variables:**
   - In your Vercel project dashboard
   - Go to Settings → Environment Variables
   - Add the required variables listed above

3. **Deploy:**
   - Vercel will automatically build and deploy your project
   - The build command is already configured: `npm run build`

## Configuration Files

- `vercel.json` - Vercel-specific configuration
- `next.config.mjs` - Next.js configuration (already optimized for Vercel)

## Features Enabled

- ✅ Automatic deployments on git push
- ✅ Preview deployments for pull requests
- ✅ Edge functions for API routes
- ✅ Analytics integration (@vercel/analytics)
- ✅ Security headers
- ✅ Image optimization
- ✅ Static file caching

## Build Settings

- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`
- **Node.js Version:** 18.x (recommended)

## Custom Domain

If you want to use a custom domain:
1. Add your domain in Vercel dashboard
2. Update DNS records as instructed
3. Set `NEXT_PUBLIC_SITE_URL` environment variable
