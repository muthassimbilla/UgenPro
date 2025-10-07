import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { user_id, ip_address, country, city, isp } = await request.json()

    if (!user_id || !ip_address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if this IP already exists for this user
    const { data: existingIP } = await supabase
      .from("user_ip_history")
      .select("id")
      .eq("user_id", user_id)
      .eq("ip_address", ip_address)
      .single()

    // Only insert if this IP doesn't exist for this user
    if (!existingIP) {
      const { error: insertError } = await supabase.from("user_ip_history").insert({
        user_id,
        ip_address,
        country: country || null,
        city: city || null,
        isp: isp || null,
        is_current: true,
        updated_at: new Date().toISOString(),
      })

      if (insertError) {
        console.error("[v0] Error inserting IP history:", insertError)
        return NextResponse.json({ error: "Failed to track IP" }, { status: 500 })
      }

      console.log("[v0] IP tracked successfully:", ip_address, "Location:", city, country)
    } else {
      // Update existing IP record with new location info if available
      const { error: updateError } = await supabase
        .from("user_ip_history")
        .update({
          country: country || null,
          city: city || null,
          isp: isp || null,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user_id)
        .eq("ip_address", ip_address)

      if (updateError) {
        console.error("[v0] Error updating IP history:", updateError)
      } else {
        console.log("[v0] IP location updated:", ip_address, "Location:", city, country)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in track-ip route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
