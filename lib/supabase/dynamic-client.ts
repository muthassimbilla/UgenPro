import { createBrowserClient } from "@supabase/ssr"

// Dynamic domain configuration for Supabase
export function createDynamicClient() {
  // Get current domain
  const currentDomain = typeof window !== 'undefined' ? window.location.origin : ''
  
  // Default Supabase configuration
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  // Log current domain for debugging
  if (typeof window !== 'undefined') {
    console.log('[Supabase] Current domain:', currentDomain)
    console.log('[Supabase] Supabase URL:', supabaseUrl)
  }
  
  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      // Allow multiple domains
      redirectTo: `${currentDomain}/auth/callback`
    },
    global: {
      headers: {
        'X-Client-Info': 'supabase-js-web',
        'X-Requested-With': 'XMLHttpRequest'
      }
    }
  })
}

// Fallback client for server-side rendering
export function createServerDynamicClient() {
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

// Domain validation helper
export function isValidDomain(domain: string): boolean {
  const allowedDomains = [
    'localhost:3000',
    'localhost:3001',
    '127.0.0.1:3000',
    // Add your production domains here
    'your-domain.com',
    'your-domain.netlify.app',
    'your-domain.vercel.app'
  ]
  
  return allowedDomains.some(allowed => domain.includes(allowed))
}

// Get current domain info
export function getCurrentDomainInfo() {
  if (typeof window === 'undefined') {
    return {
      domain: 'server',
      isValid: true,
      protocol: 'https'
    }
  }
  
  const domain = window.location.hostname
  const protocol = window.location.protocol
  const port = window.location.port
  const fullDomain = port ? `${domain}:${port}` : domain
  
  return {
    domain: fullDomain,
    isValid: isValidDomain(fullDomain),
    protocol,
    fullUrl: window.location.origin
  }
}
