import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Debug: Checking environment variables...")

    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    }

    const missingVars = Object.entries(envCheck)
      .filter(([key, value]) => !value)
      .map(([key]) => key)

    const recommendations = []
    
    if (missingVars.length > 0) {
      recommendations.push(`Missing environment variables: ${missingVars.join(', ')}`)
      recommendations.push("Create a .env.local file with the required variables")
      recommendations.push("Restart your development server after adding variables")
    }

    if (envCheck.SUPABASE_SERVICE_ROLE_KEY) {
      recommendations.push("SUPABASE_SERVICE_ROLE_KEY is present - good!")
    } else {
      recommendations.push("SUPABASE_SERVICE_ROLE_KEY is missing - this is required for admin operations")
    }

    return NextResponse.json({
      success: missingVars.length === 0,
      environment_variables: envCheck,
      missing_variables: missingVars,
      recommendations,
      next_steps: missingVars.length === 0 ? [
        "Environment variables are set correctly",
        "Try the Debug Devices button again",
        "If still failing, check database permissions"
      ] : [
        "Add missing environment variables to .env.local",
        "Restart development server",
        "Try Debug Devices button again"
      ]
    })

  } catch (error) {
    console.error("❌ Environment check failed:", error)
    return NextResponse.json({ 
      error: "Environment check failed", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
