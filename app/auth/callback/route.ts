import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Check if this is a password reset flow
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // If user exists and this is a password reset, redirect to reset-password page
        const forwardedHost = request.headers.get("x-forwarded-host")
        const isLocalhost = forwardedHost?.includes("localhost") || origin.includes("localhost")
        
        if (isLocalhost) {
          return NextResponse.redirect(`${origin}/reset-password`)
        } else {
          return NextResponse.redirect("https://ugenpro.site/reset-password")
        }
      }
    }
  }

  // If there's an error or no code, redirect to home
  return NextResponse.redirect(`${origin}/`)
}
