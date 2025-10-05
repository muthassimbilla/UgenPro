# 🔧 Supabase Localhost Configuration Guide

## 🚨 সমস্যা: Localhost এ Login হচ্ছে না

আপনার Supabase credentials আছে, কিন্তু localhost domain configuration করতে হবে।

## 🎯 সমাধান (Step by Step):

### Step 1: Supabase Dashboard এ যান

1. **https://supabase.com/dashboard** এ যান
2. **Login করুন** আপনার account দিয়ে
3. **Your Project** select করুন: `pozoauxismiqgytbsjic`

### Step 2: Authentication Settings

1. **Settings** → **Authentication** এ যান
2. **Site URL** section এ এই URLs যোগ করুন:

```
http://localhost:3000
http://localhost:3001
http://127.0.0.1:3000
http://127.0.0.1:3001
```

### Step 3: Redirect URLs Configuration

**Additional Redirect URLs** section এ এই URLs যোগ করুন:

```
http://localhost:3000/auth/callback
http://localhost:3001/auth/callback
http://127.0.0.1:3000/auth/callback
http://127.0.0.1:3001/auth/callback
http://localhost:3000/login
http://localhost:3001/login
http://localhost:3000/signup
http://localhost:3001/signup
```

### Step 4: CORS Configuration

**CORS Origins** section এ এই URLs যোগ করুন:

```
http://localhost:3000
http://localhost:3001
http://127.0.0.1:3000
http://127.0.0.1:3001
```

### Step 5: Email Configuration (যদি Email Auth ব্যবহার করেন)

1. **Email Templates** section এ যান
2. **Confirm signup** template এ localhost URLs যোগ করুন
3. **Reset password** template এ localhost URLs যোগ করুন

## 🔍 Detailed Configuration:

### Authentication Settings:
```
Site URL: http://localhost:3001
Additional Redirect URLs:
- http://localhost:3000/auth/callback
- http://localhost:3001/auth/callback
- http://localhost:3000/login
- http://localhost:3001/login
- http://localhost:3000/signup
- http://localhost:3001/signup
```

### CORS Settings:
```
Allowed Origins:
- http://localhost:3000
- http://localhost:3001
- http://127.0.0.1:3000
- http://127.0.0.1:3001
```

## 🚀 Testing Steps:

### 1. Configuration Save করুন:
- সব settings save করুন
- 2-3 মিনিট অপেক্ষা করুন

### 2. Browser Test:
1. **http://localhost:3001** এ যান
2. **Login page** এ যান: http://localhost:3001/login
3. **Signup page** এ যান: http://localhost:3001/signup

### 3. Browser Console Check:
```javascript
// Console এ এই command run করুন
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Current URL:', window.location.origin)
```

### 4. Network Tab Check:
1. **Developer Tools** → **Network tab**
2. **Login attempt** করুন
3. **Supabase requests** দেখুন
4. **CORS errors** check করুন

## ⚠️ Important Notes:

1. **Port 3001** ব্যবহার করছেন (3000 busy ছিল)
2. **HTTP protocol** ব্যবহার করুন (localhost এর জন্য)
3. **Configuration save** করার পর 2-3 মিনিট অপেক্ষা করুন
4. **Browser cache clear** করুন

## 🔧 Alternative Configuration:

### যদি Email Auth ব্যবহার করেন:
1. **Email Templates** → **Confirm signup**
2. **Redirect URL** এ: `http://localhost:3001/auth/callback`
3. **Email Templates** → **Reset password**
4. **Redirect URL** এ: `http://localhost:3001/reset-password`

### যদি Social Auth ব্যবহার করেন:
1. **Providers** section এ যান
2. **Google/GitHub** etc. enable করুন
3. **Redirect URLs** এ localhost URLs যোগ করুন

## 🎯 Quick Fix Commands:

### Browser Console Test:
```javascript
// Test Supabase connection
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  'https://pozoauxismiqgytbsjic.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvem9hdXhpc21pcWd5dGJzamljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MTkyNjksImV4cCI6MjA3MDM5NTI2OX0.RiZZ0Phft_U3XShCvWwKpeFQtwve3ZfCaX9WETPfBGU'
)
console.log('Supabase Client:', supabase)
```

## 📞 Troubleshooting:

### Common Issues:
1. **CORS Error**: Supabase settings এ localhost URLs যোগ করুন
2. **Redirect Error**: Callback URLs সঠিকভাবে set করুন
3. **Email Not Working**: Email templates এ localhost URLs যোগ করুন

### Debug Steps:
1. **Browser Console** check করুন
2. **Network Tab** check করুন
3. **Supabase Logs** check করুন
4. **Environment Variables** verify করুন

## ✅ Success Checklist:

- [ ] Supabase Dashboard এ localhost URLs যোগ করা হয়েছে
- [ ] Site URL set করা হয়েছে
- [ ] Redirect URLs যোগ করা হয়েছে
- [ ] CORS origins set করা হয়েছে
- [ ] Configuration save করা হয়েছে
- [ ] Browser cache clear করা হয়েছে
- [ ] Login test করা হয়েছে

এই configuration করার পর localhost এ login system কাজ করবে! 🎉
