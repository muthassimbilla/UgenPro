import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  // Handle CORS for different domains
  const origin = request.headers.get("origin")
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://ugenpro.site",
    "https://www.ugenpro.site",
  ]

  // Set CORS headers if origin is allowed
  const response = NextResponse.next()
  if (origin && allowedOrigins.some((allowed) => origin.includes(allowed.replace(/^https?:\/\//, "")))) {
    response.headers.set("Access-Control-Allow-Origin", origin)
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
    response.headers.set("Access-Control-Allow-Credentials", "true")
  }

  if (request.nextUrl.pathname.startsWith("/api/")) {
    return response
  }

  let supabaseResponse = response

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            // Set secure cookie options for session persistence
            const cookieOptions = {
              ...options,
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax' as const,
              maxAge: 7 * 24 * 60 * 60, // 7 days
              path: '/'
            }
            supabaseResponse.cookies.set(name, value, cookieOptions)
          })
        },
      },
    },
  )

  const publicRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/auth",
    "/adminbilla",
    "/contact",
    "/",
  ]

  const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // If it's a public route, allow access without authentication check
  if (isPublicRoute) {
    return supabaseResponse
  }

  // For protected routes, check authentication
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  // Check for session validity
  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession()

  // If there's a session error or no valid session, clear cookies
  if (sessionError || !session) {
    console.log("[v0] Middleware: Invalid session, clearing cookies")
    supabaseResponse.cookies.delete('sb-access-token')
    supabaseResponse.cookies.delete('sb-refresh-token')
  }

  // Redirect authenticated users away from auth pages
  if (user && session && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup")) {
    const url = request.nextUrl.clone()
    url.pathname = "/tool"
    return NextResponse.redirect(url)
  }

  // Redirect unauthenticated users to login for protected routes
  if ((!user || !session) && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
