import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth-server"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Get all users with their session data
    const { data: users, error: usersError } = await supabase.from("profiles").select("id, full_name, email").limit(10)

    if (usersError) {
      console.error("[v0] Error fetching users:", usersError)
      return NextResponse.json(
        {
          error: "Failed to fetch users",
          details: usersError,
        },
        { status: 500 },
      )
    }

    console.log("[v0] Found users:", users?.length || 0)

    // For each user, get their IP history
    const usersWithSessions = await Promise.all(
      (users || []).map(async (user) => {
        const { data: ipHistory, error: ipError } = await supabase
          .from("user_ip_history")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (ipError) {
          console.error(`[v0] Error fetching IP history for user ${user.email}:`, ipError)
        }

        console.log(`[v0] User ${user.email} has ${ipHistory?.length || 0} IP records`)

        return {
          ...user,
          ip_history: ipHistory || [],
          total_devices: ipHistory?.length || 0,
          active_sessions: ipHistory?.filter((ip) => ip.is_current).length || 0,
        }
      }),
    )

    // Also check the raw table structure
    const { data: tableInfo, error: tableError } = await supabase.from("user_ip_history").select("*").limit(5)

    console.log("[v0] Sample IP history records:", tableInfo?.length || 0)

    return NextResponse.json({
      success: true,
      users: usersWithSessions,
      sample_records: tableInfo,
      summary: {
        total_users: users?.length || 0,
        users_with_sessions: usersWithSessions.filter((u) => u.total_devices > 0).length,
        total_ip_records: tableInfo?.length || 0,
      },
    })
  } catch (error) {
    console.error("[v0] Error in check-session-data API:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
