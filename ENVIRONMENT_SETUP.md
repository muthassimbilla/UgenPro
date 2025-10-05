# 🔧 Environment Setup for Localhost

## 🚨 সমস্যা: Localhost এ Login System কাজ করছে না

### মূল কারণ: Environment Variables নেই

আপনার প্রজেক্টে `.env.local` file নেই, তাই Supabase configuration load হচ্ছে না।

## 🎯 সমাধান:

### Step 1: Environment File তৈরি করুন

প্রজেক্টের root directory তে `.env.local` file তৈরি করুন:

```bash
# Windows
echo. > .env.local

# Mac/Linux
touch .env.local
```

### Step 2: Environment Variables যোগ করুন

`.env.local` file এ এই content যোগ করুন:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### Step 3: Supabase Credentials পাবেন কোথায়?

1. **Supabase Dashboard** এ যান: https://supabase.com/dashboard
2. **Your Project** select করুন
3. **Settings** → **API** এ যান
4. সেখান থেকে credentials copy করুন:

```
Project URL: https://your-project-id.supabase.co
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Example Configuration

```env
# Example (replace with your actual values)
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5ODc2MDAwMCwiZXhwIjoyMDE0MzM2MDAwfQ.example_signature_here
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjk4NzYwMDAwLCJleHAiOjIwMTQzMzYwMDB9.example_service_role_signature_here
```

### Step 5: Development Server Restart করুন

```bash
# Stop current server (Ctrl+C)
# Then restart
npm run dev
```

## 🔍 Testing Steps:

### 1. Environment Variables Check:
Browser console এ এই command run করুন:
```javascript
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Has Anon Key:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
```

### 2. Login Test:
1. http://localhost:3000/login এ যান
2. Email/password দিয়ে login করার চেষ্টা করুন
3. Browser console check করুন errors এর জন্য

### 3. Network Tab Check:
1. Developer Tools → Network tab
2. Login attempt করুন
3. Supabase requests দেখুন

## ⚠️ Important Notes:

1. **`.env.local` file কখনো Git এ commit করবেন না**
2. **Credentials কখনো share করবেন না**
3. **Development server restart করুন** environment variables change করার পর
4. **Browser cache clear করুন**

## 🚀 Quick Commands:

```bash
# Create .env.local file
echo. > .env.local

# Start development server
npm run dev

# Check if server is running
curl http://localhost:3000
```

## 📞 Troubleshooting:

### যদি এখনো কাজ না করে:

1. **Check file name**: `.env.local` (not `.env` or `.env.local.txt`)
2. **Check file location**: Project root directory তে
3. **Check syntax**: No spaces around `=`
4. **Restart server**: `npm run dev`
5. **Clear browser cache**: Ctrl+Shift+Delete

### Common Errors:

```
Error: Missing Supabase URL
→ Check NEXT_PUBLIC_SUPABASE_URL

Error: Missing Supabase Key
→ Check NEXT_PUBLIC_SUPABASE_ANON_KEY

Error: Invalid credentials
→ Check if credentials are correct
```

## ✅ Success Checklist:

- [ ] `.env.local` file created
- [ ] Supabase URL added
- [ ] Supabase anon key added
- [ ] Service role key added
- [ ] Development server restarted
- [ ] Browser cache cleared
- [ ] Login tested successfully

এই setup করার পর localhost এ login system কাজ করবে! 🎉
