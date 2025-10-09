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

  // Skip middleware for API routes - let them handle their own authentication
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
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
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
    "/tool", // Tool pages should be accessible but API calls will handle authentication
    "/premium-tools",
    "/profile"
  ]

  const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // If it's a public route, allow access without authentication check
  if (isPublicRoute) {
    return supabaseResponse
  }

  // For protected routes, check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log(`[Middleware] Path: ${request.nextUrl.pathname}, User: ${user ? user.id : 'null'}, Public: ${isPublicRoute}`)

  // Redirect authenticated users away from auth pages
  if (user && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup")) {
    console.log(`[Middleware] Redirecting authenticated user from ${request.nextUrl.pathname} to /tool`)
    const url = request.nextUrl.clone()
    url.pathname = "/tool"
    return NextResponse.redirect(url)
  }

  // Redirect unauthenticated users to login for protected routes
  if (!user && !isPublicRoute) {
    console.log(`[Middleware] Redirecting unauthenticated user from ${request.nextUrl.pathname} to /login`)
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
