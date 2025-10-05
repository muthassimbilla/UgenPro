import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const origin = requestUrl.origin
  const next = requestUrl.searchParams.get("next") || "/tool"

  console.log("[v0] Auth callback received:", { code: !!code, origin, next })

  if (code) {
    try {
      const supabase = await createClient()

      // Exchange code for session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("[v0] Auth callback error:", error)
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
      }

      console.log("[v0] Auth callback success, user:", data.user?.id)

      // Redirect to the next URL or default to /tool
      return NextResponse.redirect(`${origin}${next}`)
    } catch (error: any) {
      console.error("[v0] Auth callback exception:", error)
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
    }
  }

  // No code present, redirect to login
  console.warn("[v0] Auth callback: no code present")
  return NextResponse.redirect(`${origin}/login`)
}
