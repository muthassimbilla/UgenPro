import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

async function getIPLocation(ipAddress: string) {
  try {
    console.log("[v0] Fetching location for IP:", ipAddress)
    const response = await fetch(`http://ip-api.com/json/${ipAddress}?fields=status,country,city,isp`, {
      signal: AbortSignal.timeout(5000), // Increased timeout to 5 seconds
    })

    if (!response.ok) {
      console.warn("[v0] IP location API failed with status:", response.status)
      return null
    }

    const data = await response.json()
    console.log("[v0] IP location API response:", data)

    if (data.status === "success") {
      return {
        country: data.country || "Unknown",
        city: data.city || "Unknown",
        isp: data.isp || "Unknown",
      }
    }

    console.warn("[v0] IP location API returned non-success status:", data.status)
    return null
  } catch (error) {
    console.error("[v0] Error fetching IP location:", error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Track IP route called")
    const body = await request.json()
    console.log("[v0] Request body:", body)

    const { user_id, ip_address, country, city, isp } = body

    if (!user_id || !ip_address) {
      console.error("[v0] Missing required fields - user_id:", user_id, "ip_address:", ip_address)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    let locationData = { country, city, isp }
    if (!country && !city && !isp) {
      console.log("[v0] No location data provided, fetching...")
      const fetchedLocation = await getIPLocation(ip_address)
      if (fetchedLocation) {
        locationData = fetchedLocation
        console.log("[v0] Location data fetched successfully:", fetchedLocation)
      } else {
        locationData = {
          country: "Unknown",
          city: "Unknown",
          isp: "Unknown",
        }
        console.log("[v0] Using default location data")
      }
    }

    console.log("[v0] Setting previous IPs to is_current = false for user:", user_id)
    const { error: updateError } = await supabase
      .from("user_ip_history")
      .update({ is_current: false })
      .eq("user_id", user_id)
      .eq("is_current", true)

    if (updateError) {
      console.error("[v0] Error updating old IPs:", updateError)
    } else {
      console.log("[v0] Successfully updated previous IPs")
    }

    console.log("[v0] Checking if IP already exists for user")
    const { data: existingIP, error: checkError } = await supabase
      .from("user_ip_history")
      .select("id")
      .eq("user_id", user_id)
      .eq("ip_address", ip_address)
      .maybeSingle()

    if (checkError) {
      console.error("[v0] Error checking existing IP:", checkError)
    }

    if (!existingIP) {
      console.log("[v0] Inserting new IP record")
      const { error: insertError } = await supabase.from("user_ip_history").insert({
        user_id,
        ip_address,
        country: locationData.country,
        city: locationData.city,
        isp: locationData.isp,
        is_current: true,
        updated_at: new Date().toISOString(),
      })

      if (insertError) {
        console.error("[v0] Error inserting IP history:", insertError)
        return NextResponse.json({ error: "Failed to track IP", details: insertError.message }, { status: 500 })
      }

      console.log("[v0] IP tracked successfully - New record created")
    } else {
      console.log("[v0] Updating existing IP record:", existingIP.id)
      const { error: updateError } = await supabase
        .from("user_ip_history")
        .update({
          country: locationData.country,
          city: locationData.city,
          isp: locationData.isp,
          is_current: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingIP.id)

      if (updateError) {
        console.error("[v0] Error updating IP history:", updateError)
        return NextResponse.json({ error: "Failed to update IP", details: updateError.message }, { status: 500 })
      }

      console.log("[v0] IP tracked successfully - Existing record updated")
    }

    return NextResponse.json({
      success: true,
      ip_address,
      location: locationData,
    })
  } catch (error: any) {
    console.error("[v0] Error in track-ip route:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
