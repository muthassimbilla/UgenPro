# 🚀 Quick Domain Setup - UGenPro

## 🌐 **Your Domain:** `https://www.ugenpro.site/`

### ⚡ **Quick Supabase Configuration:**

#### **1. Site URL:**
```
https://www.ugenpro.site
```

#### **2. Redirect URLs (Add these one by one):**
```
https://www.ugenpro.site/auth/callback
https://www.ugenpro.site/login
https://www.ugenpro.site/signup
https://www.ugenpro.site/reset-password
https://www.ugenpro.site/change-password
https://www.ugenpro.site/profile
https://www.ugenpro.site/adminbilla
https://www.ugenpro.site/adminbilla/login
```

#### **3. CORS Origins:**
```
https://www.ugenpro.site
https://ugenpro.site
```

## 🎯 **Step-by-Step:**

1. **Go to:** https://supabase.com/dashboard
2. **Select Project:** `pozoauxismiqgytbsjic`
3. **Go to:** Settings → Authentication
4. **Update Site URL:** `https://www.ugenpro.site`
5. **Add Redirect URLs:** Click "Add URL" and add each URL from the list above
6. **Save Changes**
7. **Wait 2-3 minutes**
8. **Test your domain**

## 🔧 **Environment Variables for Production:**

### **Netlify/Vercel:**
```
NEXT_PUBLIC_SUPABASE_URL=https://pozoauxismiqgytbsjic.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvem9hdXhpc21pcWd5dGJzamljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MTkyNjksImV4cCI6MjA3MDM5NTI2OX0.RiZZ0Phft_U3XShCvWwKpeFQtwve3ZfCaX9WETPfBGU
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1c2Jjanluam1pd29tZm12am9tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTI2MjEzMywiZXhwIjoyMDc0ODM4MTMzfQ.IAhVdaxsLc1eRdz67llEfcAYUqkAjOW8XHAUJPTy0I0
```

## ✅ **Testing Checklist:**

- [ ] Domain loads: https://www.ugenpro.site
- [ ] Login works: https://www.ugenpro.site/login
- [ ] Signup works: https://www.ugenpro.site/signup
- [ ] Admin panel: https://www.ugenpro.site/adminbilla
- [ ] No console errors
- [ ] SSL certificate valid

## 🚨 **Important:**

1. **Use HTTPS** (not HTTP) for production
2. **Wait 2-3 minutes** after saving Supabase settings
3. **Clear browser cache** after changes
4. **Test on different browsers**

## 📞 **If Still Not Working:**

1. **Check browser console** for errors
2. **Check Network tab** for failed requests
3. **Verify SSL certificate** is valid
4. **Check DNS propagation** (can take 24-48 hours)

---

**🎉 After this setup, your domain will work perfectly!**
