# Supabase Domain Configuration Fix

## 🚨 সমস্যা: অন্য ডোমেনে লগইন সিস্টেম কাজ করে না

### কারণ:
1. **Supabase CORS Policy** - শুধুমাত্র registered domains এ request allow করে
2. **Environment Variables** - নতুন domain এর জন্য configuration প্রয়োজন
3. **Cookie Domain** - Session cookies অন্য domain এ কাজ করে না

## 🔧 সমাধান:

### 1. Supabase Dashboard এ Domain যোগ করুন

1. **Supabase Dashboard** এ যান: https://supabase.com/dashboard
2. **Your Project** → **Settings** → **API**
3. **Site URL** section এ নতুন domain যোগ করুন:
   \`\`\`
   https://your-new-domain.com
   https://your-new-domain.netlify.app
   \`\`\`

4. **Additional Redirect URLs** এ যোগ করুন:
   \`\`\`
   https://your-new-domain.com/auth/callback
   https://your-new-domain.netlify.app/auth/callback
   \`\`\`

### 2. Environment Variables আপডেট করুন

#### Netlify এ:
1. **Netlify Dashboard** → **Site Settings** → **Environment Variables**
2. নতুন variables যোগ করুন:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   \`\`\`

#### Vercel এ:
1. **Vercel Dashboard** → **Project Settings** → **Environment Variables**
2. Production, Preview, Development সব environment এ variables যোগ করুন

### 3. Code এ Dynamic Domain Support যোগ করুন

#### lib/supabase/client.ts আপডেট করুন:
\`\`\`typescript
import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  })
}
\`\`\`

### 4. Middleware আপডেট করুন

#### middleware.ts:
\`\`\`typescript
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  // Allow all origins for development
  const origin = request.headers.get('origin')
  const allowedOrigins = [
    'http://localhost:3000',
    'https://your-domain.com',
    'https://your-domain.netlify.app',
    'https://your-domain.vercel.app'
  ]

  if (origin && allowedOrigins.includes(origin)) {
    // Set CORS headers
    const response = NextResponse.next()
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  }

  // Rest of your middleware code...
}
\`\`\`

### 5. Next.js Config আপডেট করুন

#### next.config.mjs:
\`\`\`javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... existing config
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // বা specific domains
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ]
  },
}

export default nextConfig
\`\`\`

## 🎯 Quick Fix Steps:

### Step 1: Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings → API
4. Add your new domain to "Site URL"
5. Add callback URLs to "Additional Redirect URLs"

### Step 2: Environment Variables
1. Copy your Supabase URL and keys
2. Add them to your hosting platform (Netlify/Vercel)
3. Make sure they're set for all environments

### Step 3: Test
1. Clear browser cache
2. Try logging in on the new domain
3. Check browser console for errors

## 🔍 Debugging:

### Check Browser Console:
\`\`\`javascript
// Check if Supabase is loaded
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Supabase Client:', window.supabase)

// Check current domain
console.log('Current Domain:', window.location.origin)
\`\`\`

### Check Network Tab:
1. Open Developer Tools
2. Go to Network tab
3. Try to login
4. Look for failed requests to Supabase
5. Check CORS errors

## ⚠️ Important Notes:

1. **Always use HTTPS** in production
2. **Update all domains** in Supabase settings
3. **Clear browser cache** after changes
4. **Test on different browsers**
5. **Check mobile devices** too

## 🚀 Alternative Solution:

If the above doesn't work, you can use a proxy:

### Create API Route: /api/supabase-proxy
\`\`\`typescript
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Handle authentication requests
  // This bypasses CORS issues
}
\`\`\`

This should fix your domain-specific login issues!
