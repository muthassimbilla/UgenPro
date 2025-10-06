# 🌐 UGenPro Domain Configuration Guide

## 🎯 আপনার Domain: https://www.ugenpro.site/

### 🚀 **Supabase Dashboard Configuration:**

#### **Step 1: Site URL Configuration**
**Site URL** field এ এই value দিন:
\`\`\`
https://www.ugenpro.site
\`\`\`

#### **Step 2: Redirect URLs যোগ করুন**
**"Add URL"** button এ ক্লিক করে এই URLs যোগ করুন:

1. `https://www.ugenpro.site/auth/callback`
2. `https://www.ugenpro.site/login`
3. `https://www.ugenpro.site/signup`
4. `https://www.ugenpro.site/reset-password`
5. `https://www.ugenpro.site/change-password`
6. `https://www.ugenpro.site/profile`

#### **Step 3: CORS Configuration**
**CORS Origins** section এ এই URLs যোগ করুন:
\`\`\`
https://www.ugenpro.site
https://ugenpro.site
\`\`\`

## 🔧 **Complete Configuration List:**

### **Site URL:**
\`\`\`
https://www.ugenpro.site
\`\`\`

### **Redirect URLs:**
\`\`\`
https://www.ugenpro.site/auth/callback
https://www.ugenpro.site/login
https://www.ugenpro.site/signup
https://www.ugenpro.site/reset-password
https://www.ugenpro.site/change-password
https://www.ugenpro.site/profile
https://www.ugenpro.site/adminbilla
https://www.ugenpro.site/adminbilla/login
\`\`\`

### **CORS Origins:**
\`\`\`
https://www.ugenpro.site
https://ugenpro.site
\`\`\`

## 🌍 **Production Environment Variables:**

### **Netlify/Vercel এ Environment Variables:**
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://pozoauxismiqgytbsjic.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvem9hdXhpc21pcWd5dGJzamljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MTkyNjksImV4cCI6MjA3MDM5NTI2OX0.RiZZ0Phft_U3XShCvWwKpeFQtwve3ZfCaX9WETPfBGU
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1c2Jjanluam1pd29tZm12am9tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTI2MjEzMywiZXhwIjoyMDc0ODM4MTMzfQ.IAhVdaxsLc1eRdz67llEfcAYUqkAjOW8XHAUJPTy0I0
\`\`\`

## 🎯 **Domain Configuration Steps:**

### **1. Supabase Dashboard:**
1. **https://supabase.com/dashboard** → **Your Project** → **Settings** → **Authentication**
2. **Site URL:** `https://www.ugenpro.site`
3. **Redirect URLs:** উপরের list থেকে সব URLs যোগ করুন
4. **Save changes**

### **2. Hosting Platform (Netlify/Vercel):**
1. **Environment Variables** section এ যান
2. **Production environment** এ variables set করুন
3. **Deploy** করুন

### **3. Domain DNS:**
1. **A Record:** `www.ugenpro.site` → Your hosting IP
2. **CNAME Record:** `ugenpro.site` → `www.ugenpro.site`

## 🔍 **Testing Steps:**

### **1. Domain Test:**
\`\`\`bash
# Test domain accessibility
curl -I https://www.ugenpro.site

# Test Supabase connection
curl -I https://pozoauxismiqgytbsjic.supabase.co
\`\`\`

### **2. Browser Test:**
1. **https://www.ugenpro.site** এ যান
2. **Login page:** https://www.ugenpro.site/login
3. **Signup page:** https://www.ugenpro.site/signup
4. **Admin panel:** https://www.ugenpro.site/adminbilla

### **3. Console Test:**
\`\`\`javascript
// Browser console এ run করুন
console.log('Domain:', window.location.origin)
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)

// Test Supabase connection
fetch('https://pozoauxismiqgytbsjic.supabase.co/rest/v1/', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvem9hdXhpc21pcWd5dGJzamljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MTkyNjksImV4cCI6MjA3MDM5NTI2OX0.RiZZ0Phft_U3XShCvWwKpeFQtwve3ZfCaX9WETPfBGU'
  }
}).then(response => {
  console.log('Supabase connection:', response.ok ? '✅ Success' : '❌ Failed')
})
\`\`\`

## ⚠️ **Important Notes:**

1. **HTTPS Required:** Production domain এ সবসময় HTTPS ব্যবহার করুন
2. **SSL Certificate:** Domain এ SSL certificate enable করুন
3. **DNS Propagation:** DNS changes 24-48 ঘন্টা লাগতে পারে
4. **Cache Clear:** Configuration change করার পর browser cache clear করুন

## 🚀 **Deployment Checklist:**

### **Supabase Configuration:**
- [ ] Site URL set to `https://www.ugenpro.site`
- [ ] All redirect URLs added
- [ ] CORS origins configured
- [ ] Configuration saved

### **Hosting Platform:**
- [ ] Environment variables set
- [ ] Domain connected
- [ ] SSL certificate enabled
- [ ] Site deployed

### **Domain DNS:**
- [ ] A record configured
- [ ] CNAME record configured
- [ ] DNS propagated

### **Testing:**
- [ ] Domain accessible
- [ ] Login system working
- [ ] Admin panel accessible
- [ ] No console errors

## 📞 **Troubleshooting:**

### **Common Issues:**
1. **CORS Error:** Supabase settings এ domain URLs যোগ করুন
2. **SSL Error:** SSL certificate enable করুন
3. **DNS Error:** DNS propagation অপেক্ষা করুন
4. **Environment Error:** Hosting platform এ variables check করুন

### **Debug Commands:**
\`\`\`bash
# Check domain status
nslookup www.ugenpro.site

# Check SSL certificate
openssl s_client -connect www.ugenpro.site:443

# Test Supabase connection
curl -H "apikey: YOUR_ANON_KEY" https://pozoauxismiqgytbsjic.supabase.co/rest/v1/
\`\`\`

## ✅ **Success Indicators:**

- ✅ Domain loads without errors
- ✅ Login/signup forms work
- ✅ Admin panel accessible
- ✅ No CORS errors in console
- ✅ SSL certificate valid
- ✅ Supabase connection successful

এই configuration করার পর আপনার domain এ login system সম্পূর্ণভাবে কাজ করবে! 🎉
