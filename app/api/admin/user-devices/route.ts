import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Helper function to extract device name from user agent
function extractDeviceName(userAgent: string): string {
  if (userAgent.includes("iPhone")) return "iPhone"
  if (userAgent.includes("iPad")) return "iPad"
  if (userAgent.includes("Android")) return "Android Device"
  if (userAgent.includes("Windows")) return "Windows PC"
  if (userAgent.includes("Mac")) return "Mac"
  if (userAgent.includes("Linux")) return "Linux PC"
  return "Unknown Device"
}

// Helper function to extract browser from user agent
function extractBrowser(userAgent: string): string {
  if (userAgent.includes("Chrome")) return "Chrome"
  if (userAgent.includes("Firefox")) return "Firefox"
  if (userAgent.includes("Safari")) return "Safari"
  if (userAgent.includes("Edge")) return "Edge"
  return "Unknown Browser"
}

// Helper function to extract OS from user agent
function extractOS(userAgent: string): string {
  if (userAgent.includes("Windows NT 10.0")) return "Windows 10"
  if (userAgent.includes("Windows NT 6.1")) return "Windows 7"
  if (userAgent.includes("Mac OS X")) return "macOS"
  if (userAgent.includes("Android")) return "Android"
  if (userAgent.includes("iPhone OS")) return "iOS"
  return "Unknown OS"
}

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user_id")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    console.log("[v0] Fetching devices for user:", userId)

    // Get devices based on unique IP addresses instead of sessions
    let processedDevices = []

    // Get IP history for this user to create devices based on unique IPs
    const { data: ipHistory, error: ipError } = await supabase
      .from("user_ip_history")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    console.log("[v0] IP history query result:", {
      count: ipHistory?.length || 0,
      error: ipError,
      userId,
    })

    if (ipError) {
      console.error("[v0] Error fetching IP history:", ipError)
      return NextResponse.json({ error: "Failed to fetch IP history" }, { status: 500 })
    }

    if (ipHistory && ipHistory.length > 0) {
      console.log("[v0] Processing IP history records:", ipHistory.length)

      // Group IPs by unique IP address
      const deviceMap = new Map()

      ipHistory.forEach((ipRecord) => {
        const ipAddress = ipRecord.ip_address

        if (!deviceMap.has(ipAddress)) {
          // Create a more descriptive device name
          const location =
            ipRecord.city && ipRecord.country
              ? `${ipRecord.city}, ${ipRecord.country}`
              : ipRecord.country || "Unknown Location"

          deviceMap.set(ipAddress, {
            device_fingerprint: `ip-${ipAddress}`,
            device_name: `Device from ${location}`,
            browser_info: "Unknown Browser",
            os_info: "Unknown OS",
            screen_resolution: "Unknown",
            timezone: "Unknown",
            language: "Unknown",
            first_seen: ipRecord.created_at,
            last_seen: ipRecord.updated_at || ipRecord.created_at,
            is_trusted: true,
            is_blocked: false,
            total_logins: 1,
            user_id: userId,
            ip_address: ipAddress,
            country: ipRecord.country || "Unknown",
            city: ipRecord.city || "Unknown",
            current_ips: [ipAddress],
            ip_history: [
              {
                ip_address: ipAddress,
                country: ipRecord.country || "Unknown",
                city: ipRecord.city || "Unknown",
                isp: ipRecord.isp || "Unknown",
                first_seen: ipRecord.created_at,
                last_seen: ipRecord.updated_at || ipRecord.created_at,
                is_current: ipRecord.is_current || false,
              },
            ],
            active_sessions: ipRecord.is_current ? 1 : 0,
          })
        } else {
          const device = deviceMap.get(ipAddress)
          device.total_logins += 1

          // Update last_seen to the most recent IP record
          if (new Date(ipRecord.updated_at || ipRecord.created_at) > new Date(device.last_seen)) {
            device.last_seen = ipRecord.updated_at || ipRecord.created_at
          }

          // Update active sessions count
          if (ipRecord.is_current) {
            device.active_sessions = 1
          }

          // Add to IP history if not already present
          const existingIP = device.ip_history.find((ip) => ip.ip_address === ipAddress)
          if (!existingIP) {
            device.ip_history.push({
              ip_address: ipAddress,
              country: ipRecord.country || "Unknown",
              city: ipRecord.city || "Unknown",
              isp: ipRecord.isp || "Unknown",
              first_seen: ipRecord.created_at,
              last_seen: ipRecord.updated_at || ipRecord.created_at,
              is_current: ipRecord.is_current || false,
            })
          }
        }
      })

      // Convert map to array and sort by last_seen
      processedDevices = Array.from(deviceMap.values()).sort(
        (a, b) => new Date(b.last_seen).getTime() - new Date(a.last_seen).getTime(),
      )
      console.log("[v0] Created devices from IP history:", processedDevices.length)
    } else {
      // If no IP history, return empty array
      console.log("[v0] No IP history found for user:", userId)
      processedDevices = []
    }

    return NextResponse.json({
      success: true,
      data: processedDevices,
    })
  } catch (error) {
    console.error("[v0] Error in user-devices API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user_id")
    const action = searchParams.get("action")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    if (action === "logout-others") {
      // Logout from all other devices (IPs) except current one
      const { error } = await supabase
        .from("user_sessions")
        .update({
          is_active: false,
          logout_reason: "admin_logout_others",
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("is_active", true)

      if (error) {
        console.error("Error logging out other devices:", error)
        return NextResponse.json({ error: "Failed to logout other devices" }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: "Successfully logged out from other devices",
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error in user-devices DELETE API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
