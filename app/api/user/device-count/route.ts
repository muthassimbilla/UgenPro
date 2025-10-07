import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth-server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 })
    }

    const { data: ipHistory, error: ipError } = await supabase
      .from("user_ip_history")
      .select("ip_address")
      .eq("user_id", user.id)
      .eq("is_current", true)

    if (ipError) {
      console.error("[v0] Error fetching IP history:", ipError)
      return NextResponse.json({ error: "Failed to fetch device count" }, { status: 500 })
    }

    // Count unique IP addresses - each unique IP represents a different device
    const uniqueIPs = new Set(ipHistory?.map((ip) => ip.ip_address) || [])
    const deviceCount = uniqueIPs.size

    console.log(`[v0] User ${user.id} has ${deviceCount} devices (unique IPs):`, Array.from(uniqueIPs))

    return NextResponse.json({
      success: true,
      data: {
        device_count: deviceCount,
        unique_ips: Array.from(uniqueIPs),
      },
    })
  } catch (error) {
    console.error("[v0] Error in device-count API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
