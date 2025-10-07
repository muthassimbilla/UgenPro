import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth-server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    console.log("🔍 Starting device count analysis...")

    // 1. Check total records in user_ip_history
    const { data: allIPHistory, error: allError } = await supabase
      .from("user_ip_history")
      .select("*")

    if (allError) {
      return NextResponse.json({
        success: false,
        error: "Failed to fetch IP history",
        details: allError.message,
      })
    }

    console.log(`📊 Total IP history records: ${allIPHistory?.length || 0}`)

    // 2. Check unique IPs
    const uniqueIPs = new Set(allIPHistory?.map(ip => ip.ip_address) || [])
    console.log(`🌐 Unique IP addresses: ${uniqueIPs.size}`)

    // 3. Check users and their device counts (simulate AdminUserService logic)
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .limit(10)

    if (profilesError) {
      return NextResponse.json({
        success: false,
        error: "Failed to fetch profiles",
        details: profilesError.message,
      })
    }

    console.log(`👥 Found ${profiles?.length || 0} profiles`)

    const userAnalysis = []
    for (const profile of profiles || []) {
      const { data: userIPHistory, error: userIPError } = await supabase
        .from("user_ip_history")
        .select("ip_address, is_current, created_at")
        .eq("user_id", profile.id)

      if (userIPError) {
        console.error(`❌ Error fetching IP history for user ${profile.id}:`, userIPError)
        userAnalysis.push({
          user_id: profile.id,
          full_name: profile.full_name,
          email: profile.email,
          device_count: 0,
          error: userIPError.message,
          ip_records: 0,
          unique_ips: []
        })
        continue
      }

      const userUniqueIPs = new Set(userIPHistory?.map(ip => ip.ip_address) || [])
      const deviceCount = userUniqueIPs.size

      console.log(`  - User ${profile.full_name}: ${deviceCount} devices (${userIPHistory?.length || 0} records)`)

      userAnalysis.push({
        user_id: profile.id,
        full_name: profile.full_name,
        email: profile.email,
        device_count: deviceCount,
        ip_records: userIPHistory?.length || 0,
        unique_ips: Array.from(userUniqueIPs),
        is_current_ips: userIPHistory?.filter(ip => ip.is_current === true).length || 0,
        non_current_ips: userIPHistory?.filter(ip => ip.is_current === false).length || 0
      })
    }

    // 4. Check for potential issues
    const issues = []
    const usersWithZeroDevices = userAnalysis.filter(user => user.device_count === 0)
    const usersWithMultipleIPs = userAnalysis.filter(user => user.device_count > 1)

    if (usersWithZeroDevices.length > 0) {
      issues.push({
        type: "zero_devices",
        message: `${usersWithZeroDevices.length} users showing 0 devices`,
        users: usersWithZeroDevices.map(u => u.full_name || u.email)
      })
    }

    if (usersWithMultipleIPs.length > 0) {
      issues.push({
        type: "multiple_devices",
        message: `${usersWithMultipleIPs.length} users have multiple devices`,
        users: usersWithMultipleIPs.map(u => `${u.full_name || u.email}: ${u.device_count} devices`)
      })
    }

    // 5. Check if AdminUserService logic would work
    const totalExpectedDevices = userAnalysis.reduce((sum, user) => sum + user.device_count, 0)
    const totalIPRecords = allIPHistory?.length || 0

    const analysis = {
      success: true,
      summary: {
        total_ip_records: totalIPRecords,
        unique_ip_addresses: uniqueIPs.size,
        total_users: profiles?.length || 0,
        users_with_devices: userAnalysis.filter(u => u.device_count > 0).length,
        users_with_zero_devices: usersWithZeroDevices.length,
        total_expected_devices: totalExpectedDevices
      },
      user_analysis: userAnalysis,
      issues: issues,
      recommendations: [
        usersWithZeroDevices.length > 0 ? "Some users show 0 devices - check IP history data" : "All users have device data",
        totalExpectedDevices > 0 ? "Device count calculation should work correctly" : "No devices found for any user",
        issues.length === 0 ? "No issues detected" : "Issues found - see details above"
      ]
    }

    console.log("✅ Device count analysis completed")
    return NextResponse.json(analysis)

  } catch (error) {
    console.error("❌ Error in device count analysis:", error)
    return NextResponse.json({
      success: false,
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    })
  }
}
