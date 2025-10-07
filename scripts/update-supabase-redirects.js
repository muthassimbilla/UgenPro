#!/usr/bin/env node

/**
 * Supabase Redirect URLs Update Script
 * This script provides instructions for updating Supabase redirect URLs
 */

console.log('🔧 Supabase Redirect URLs Configuration\n');

console.log('📋 Required Redirect URLs for Supabase Dashboard:');
console.log('   Go to: https://app.supabase.com/project/pozoauxismiqgytbsjic/auth/url-configuration\n');

console.log('🌐 Site URL:');
console.log('   https://ugenpro.site\n');

console.log('🔗 Redirect URLs (add all of these):');
console.log('   - https://ugenpro.site/auth/callback');
console.log('   - https://ugenpro.site/login');
console.log('   - https://ugenpro.site/signup');
console.log('   - https://ugenpro.site/reset-password');
console.log('   - https://ugenpro.site/change-password');
console.log('   - https://ugenpro.site/profile\n');

console.log('🏠 Additional URLs (for development):');
console.log('   - http://localhost:3000/auth/callback');
console.log('   - http://localhost:3000/login');
console.log('   - http://localhost:3000/signup');
console.log('   - http://localhost:3000/reset-password');
console.log('   - http://localhost:3000/change-password');
console.log('   - http://localhost:3000/profile\n');

console.log('⚠️  Important Notes:');
console.log('   1. Make sure to add ALL the URLs listed above');
console.log('   2. The auth/callback URL is crucial for password reset functionality');
console.log('   3. After updating, wait 2-3 minutes for changes to take effect');
console.log('   4. Test the password reset flow after making changes\n');

console.log('✅ After updating Supabase configuration:');
console.log('   1. Test password reset: Go to /forgot-password');
console.log('   2. Enter your email and check for reset email');
console.log('   3. Click the link in the email');
console.log('   4. Verify it redirects to /reset-password page\n');

console.log('🚀 Password Reset Flow:');
console.log('   Forgot Password → Email Link → Auth Callback → Reset Password Page');
