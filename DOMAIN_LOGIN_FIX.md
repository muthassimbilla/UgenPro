# 🔧 Domain Login Issue Fix Guide

## 🚨 সমস্যা: অন্য ডোমেনে লগইন সিস্টেম কাজ করে না

### মূল কারণ:
1. **Supabase CORS Policy** - শুধুমাত্র registered domains এ request allow করে
2. **Environment Variables** - নতুন domain এর জন্য configuration প্রয়োজন
3. **Cookie Domain** - Session cookies অন্য domain এ কাজ করে না
4. **Redirect URLs** - Supabase এ callback URLs register করা নেই

## 🎯 সমাধান (Step by Step):

### Step 1: Supabase Dashboard Configuration

1. **Supabase Dashboard** এ যান: https://supabase.com/dashboard
2. **Your Project** select করুন
3. **Settings** → **API** এ যান
4. **Site URL** section এ নতুন domain যোগ করুন:
   ```
   https://your-new-domain.com
   https://your-new-domain.netlify.app
   https://your-new-domain.vercel.app
   ```

5. **Additional Redirect URLs** এ যোগ করুন:
   ```
   https://your-new-domain.com/auth/callback
   https://your-new-domain.netlify.app/auth/callback
   https://your-new-domain.vercel.app/auth/callback
   ```

### Step 2: Environment Variables Setup

#### Netlify এ:
1. **Netlify Dashboard** → **Site Settings** → **Environment Variables**
2. এই variables যোগ করুন:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

#### Vercel এ:
1. **Vercel Dashboard** → **Project Settings** → **Environment Variables**
2. Production, Preview, Development সব environment এ variables যোগ করুন

### Step 3: Code Configuration

#### lib/supabase/client.ts আপডেট করুন:
```typescript
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
```

### Step 4: Middleware Configuration

#### middleware.ts আপডেট করুন:
```typescript
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  // Handle CORS for different domains
  const origin = request.headers.get('origin')
  const allowedOrigins = [
    'http://localhost:3000',
    'https://your-domain.com',
    'https://your-domain.netlify.app',
    'https://your-domain.vercel.app'
  ]

  // Set CORS headers
  let response = NextResponse.next()
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  // Rest of your middleware code...
}
```

### Step 5: Next.js Config Update

#### next.config.mjs:
```javascript
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
```

## 🔍 Debugging Steps:

### 1. Browser Console Check:
```javascript
// Check if Supabase is loaded
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Current Domain:', window.location.origin)

// Check Supabase client
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
console.log('Supabase Client:', supabase)
```

### 2. Network Tab Check:
1. Open Developer Tools
2. Go to Network tab
3. Try to login
4. Look for failed requests to Supabase
5. Check for CORS errors

### 3. Environment Variables Check:
```javascript
// Add this to your component
useEffect(() => {
  console.log('Environment Check:', {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    currentDomain: window.location.origin
  })
}, [])
```

## 🚀 Quick Fix Commands:

### 1. Clear Browser Cache:
```bash
# Chrome/Edge
Ctrl + Shift + Delete

# Firefox
Ctrl + Shift + Delete

# Safari
Cmd + Option + E
```

### 2. Test Different Browsers:
- Chrome
- Firefox
- Safari
- Edge

### 3. Test Different Devices:
- Desktop
- Mobile
- Tablet

## ⚠️ Important Notes:

1. **Always use HTTPS** in production
2. **Update all domains** in Supabase settings
3. **Clear browser cache** after changes
4. **Test on different browsers**
5. **Check mobile devices** too
6. **Wait 5-10 minutes** after Supabase changes

## 🎯 Alternative Solutions:

### Option 1: Use Subdomain
Instead of different domains, use subdomains:
- `app.yourdomain.com`
- `admin.yourdomain.com`
- `staging.yourdomain.com`

### Option 2: Use Query Parameters
Pass domain info via URL:
```
https://yourdomain.com/login?domain=staging
```

### Option 3: Use Environment-Specific Builds
Create different builds for different domains:
```bash
# Production build
npm run build:production

# Staging build
npm run build:staging
```

## 📞 Support:

If the issue persists:
1. Check Supabase logs
2. Check browser console errors
3. Check network requests
4. Contact Supabase support
5. Check Next.js documentation

## ✅ Success Checklist:

- [ ] Supabase domains updated
- [ ] Environment variables set
- [ ] Code updated
- [ ] Browser cache cleared
- [ ] Tested on multiple browsers
- [ ] Tested on mobile devices
- [ ] No console errors
- [ ] Login works on all domains

This should fix your domain-specific login issues! 🎉
