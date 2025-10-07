import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth-server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    console.log("🔍 Direct database check starting...")

    // 1. Direct query to check user_ip_history
    const { data: ipHistory, error: ipError } = await supabase
      .from("user_ip_history")
      .select("*")
      .limit(10)

    if (ipError) {
      return NextResponse.json({
        success: false,
        error: "Failed to fetch IP history",
        details: ipError.message,
      })
    }

    console.log(`📊 Found ${ipHistory?.length || 0} IP history records`)

    // 2. Direct query to check profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .limit(5)

    if (profilesError) {
      return NextResponse.json({
        success: false,
        error: "Failed to fetch profiles",
        details: profilesError.message,
      })
    }

    console.log(`👥 Found ${profiles?.length || 0} profiles`)

    // 3. Manual device count calculation for each user
    const userDeviceCounts = []
    
    for (const profile of profiles || []) {
      const { data: userIPs, error: userIPError } = await supabase
        .from("user_ip_history")
        .select("ip_address")
        .eq("user_id", profile.id)

      if (userIPError) {
        console.error(`❌ Error for user ${profile.id}:`, userIPError)
        userDeviceCounts.push({
          user_id: profile.id,
          full_name: profile.full_name,
          email: profile.email,
          device_count: 0,
          error: userIPError.message,
          ip_addresses: []
        })
        continue
      }

      const uniqueIPs = [...new Set(userIPs?.map(ip => ip.ip_address) || [])]
      const deviceCount = uniqueIPs.length

      console.log(`  - User ${profile.full_name}: ${deviceCount} devices (IPs: ${uniqueIPs.join(', ')})`)

      userDeviceCounts.push({
        user_id: profile.id,
        full_name: profile.full_name,
        email: profile.email,
        device_count: deviceCount,
        ip_addresses: uniqueIPs,
        total_records: userIPs?.length || 0
      })
    }

    // 4. Check if AdminUserService would work
    const totalDevices = userDeviceCounts.reduce((sum, user) => sum + user.device_count, 0)
    const usersWithDevices = userDeviceCounts.filter(user => user.device_count > 0).length

    const result = {
      success: true,
      message: "Direct database check completed",
      summary: {
        total_ip_records: ipHistory?.length || 0,
        total_profiles: profiles?.length || 0,
        users_with_devices: usersWithDevices,
        total_devices: totalDevices,
        sample_ip_addresses: [...new Set(ipHistory?.map(ip => ip.ip_address) || [])].slice(0, 5)
      },
      user_device_counts: userDeviceCounts,
      sample_ip_history: ipHistory?.slice(0, 3),
      recommendations: [
        totalDevices > 0 ? "Database has device data - AdminUserService should work" : "No device data found",
        usersWithDevices > 0 ? "Some users have devices - UI should show device counts" : "No users have devices",
        "Check AdminUserService.getAllUsers() logic if UI still shows 0"
      ]
    }

    console.log("✅ Direct database check completed:", result.summary)
    return NextResponse.json(result)

  } catch (error) {
    console.error("❌ Direct database check failed:", error)
    return NextResponse.json({
      success: false,
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    })
  }
}
