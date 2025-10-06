# 🔐 Authentication System Fix Guide

## 🚨 Current Issue
Your authentication system is showing a **400 Bad Request** error because the Supabase anon key is not properly configured.

## 🔧 Step-by-Step Fix

### 1. Get Your Supabase Credentials

1. Go to your Supabase project: https://app.supabase.com/project/pozoauxismiqgytbsjic/settings/api
2. Copy your **Project URL** and **anon public** key
3. Your Project URL should be: `https://pozoauxismiqgytbsjic.supabase.co`

### 2. Update Environment Variables

Edit your `.env.local` file and replace the placeholder values:

\`\`\`env
# UGen Pro Environment Variables
NEXT_PUBLIC_SUPABASE_URL=https://pozoauxismiqgytbsjic.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... # Your actual anon key here
NEXT_PUBLIC_SUPABASE_REDIRECT_URL=https://ugenpro.site/login
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/login
ADMIN_EMAIL=admin@ugenpro.site
ADMIN_PASSWORD=your_admin_password_here
\`\`\`

### 3. Configure Supabase Dashboard

In your Supabase project dashboard, go to **Authentication > URL Configuration** and add:

**Site URL:**
\`\`\`
https://ugenpro.site
\`\`\`

**Redirect URLs:**
\`\`\`
https://ugenpro.site/auth/callback
https://ugenpro.site/login
https://ugenpro.site/signup
https://ugenpro.site/reset-password
https://ugenpro.site/change-password
https://ugenpro.site/profile
\`\`\`

### 4. Test the Configuration

Run the connection test:
\`\`\`bash
node scripts/test-supabase-connection.js
\`\`\`

### 5. Start the Development Server

\`\`\`bash
npm run dev
\`\`\`

## 🔍 Troubleshooting

### Error: "Invalid API key"
- **Solution**: Check your anon key in `.env.local`
- **Get it from**: Supabase Dashboard > Settings > API

### Error: "relation 'profiles' does not exist"
- **Solution**: Run the database setup scripts in the `scripts/` folder

### Error: "400 Bad Request"
- **Solution**: Check that your Supabase project is active and URLs are configured correctly

## 📋 Database Setup

If you need to set up the database tables, run these scripts in order:

1. `001_create_profiles_table.sql`
2. `002_create_user_sessions_table.sql`
3. `003_create_user_ip_history_table.sql`
4. `004_create_admins_table.sql`
5. `005_insert_default_admin.sql`

## 🎯 Quick Test

After fixing the configuration:

1. Go to `http://localhost:3000/login`
2. Try to create a new account
3. Check the browser console for any errors
4. Verify that the authentication flow works

## 📞 Support

If you're still having issues:

1. Check the browser console for detailed error messages
2. Verify your Supabase project is active
3. Ensure all environment variables are set correctly
4. Test the connection with the provided script

---

**Note**: Make sure to keep your Supabase credentials secure and never commit them to version control.
