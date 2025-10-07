import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("[v0] API: Starting to fetch users...")

    const supabase = await createClient()

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log("[v0] API: No authenticated user")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] API: Authenticated user:", user.email)

    // Check if user is an admin
    const { data: adminData, error: adminError } = await supabase
      .from("admins")
      .select("*")
      .eq("email", user.email)
      .single()

    if (adminError || !adminData) {
      console.log("[v0] API: User is not an admin")
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    console.log("[v0] API: User is admin, fetching all users...")

    // Fetch all users from profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })

    if (profilesError) {
      console.error("[v0] API: Error fetching profiles:", profilesError)
      return NextResponse.json({ error: "Failed to fetch users", details: profilesError.message }, { status: 500 })
    }

    console.log("[v0] API: Found", profiles?.length || 0, "profiles")

    // Fetch session data for each user
    const usersWithData = await Promise.all(
      (profiles || []).map(async (profile) => {
        // Get IP history count
        const { data: ipHistory, error: ipError } = await supabase
          .from("user_ip_history")
          .select("*")
          .eq("user_id", profile.user_id)

        const deviceCount = ipHistory?.length || 0
        const activeSessions = ipHistory?.filter((ip) => ip.is_current).length || 0

        // Get last login from user_sessions
        const { data: sessions } = await supabase
          .from("user_sessions")
          .select("last_accessed")
          .eq("user_id", profile.user_id)
          .order("last_accessed", { ascending: false })
          .limit(1)

        const lastLogin = sessions?.[0]?.last_accessed || null

        return {
          user_id: profile.user_id,
          email: profile.email,
          full_name: profile.full_name || "Unknown",
          phone: profile.phone || "",
          approval_status: profile.approval_status || "pending",
          account_status: profile.account_status || "active",
          subscription_tier: profile.subscription_tier || "free",
          subscription_expires_at: profile.subscription_expires_at,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
          device_count: deviceCount,
          active_sessions: activeSessions,
          last_login: lastLogin,
        }
      }),
    )

    console.log("[v0] API: Returning", usersWithData.length, "users with session data")

    return NextResponse.json({ users: usersWithData })
  } catch (error: any) {
    console.error("[v0] API: Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
  }
}
