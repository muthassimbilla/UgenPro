import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

async function getIPLocation(ipAddress: string) {
  try {
    const response = await fetch(`http://ip-api.com/json/${ipAddress}?fields=status,country,city,isp`, {
      signal: AbortSignal.timeout(3000),
    })

    if (!response.ok) {
      console.warn("[v0] IP location API failed:", response.status)
      return null
    }

    const data = await response.json()

    if (data.status === "success") {
      return {
        country: data.country || null,
        city: data.city || null,
        isp: data.isp || null,
      }
    }

    return null
  } catch (error) {
    console.warn("[v0] Error fetching IP location:", error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user_id, ip_address, country, city, isp } = await request.json()

    if (!user_id || !ip_address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    let locationData = { country, city, isp }
    if (!country && !city && !isp) {
      console.log("[v0] Fetching location data for IP:", ip_address)
      const fetchedLocation = await getIPLocation(ip_address)
      if (fetchedLocation) {
        locationData = fetchedLocation
        console.log("[v0] Location data fetched:", fetchedLocation)
      }
    }

    const { error: updateError } = await supabase
      .from("user_ip_history")
      .update({ is_current: false })
      .eq("user_id", user_id)
      .eq("is_current", true)

    if (updateError) {
      console.warn("[v0] Error updating old IPs:", updateError)
    } else {
      console.log("[v0] Set all previous IPs to is_current = false for user:", user_id)
    }

    // Check if this IP already exists for this user
    const { data: existingIP } = await supabase
      .from("user_ip_history")
      .select("id")
      .eq("user_id", user_id)
      .eq("ip_address", ip_address)
      .single()

    if (!existingIP) {
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
        return NextResponse.json({ error: "Failed to track IP" }, { status: 500 })
      }

      console.log("[v0] IP tracked successfully:", ip_address, "Location:", locationData.city, locationData.country)
    } else {
      const { error: updateError } = await supabase
        .from("user_ip_history")
        .update({
          country: locationData.country,
          city: locationData.city,
          isp: locationData.isp,
          is_current: true,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user_id)
        .eq("ip_address", ip_address)

      if (updateError) {
        console.error("[v0] Error updating IP history:", updateError)
      } else {
        console.log(
          "[v0] IP updated and set as current:",
          ip_address,
          "Location:",
          locationData.city,
          locationData.country,
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in track-ip route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
