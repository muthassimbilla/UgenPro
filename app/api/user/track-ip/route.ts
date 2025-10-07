import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { user_id, ip_address } = await request.json()

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
        is_current: true,
      })

      if (insertError) {
        console.error("[v0] Error inserting IP history:", insertError)
        return NextResponse.json({ error: "Failed to track IP" }, { status: 500 })
      }

      console.log("[v0] IP tracked successfully:", ip_address)
    } else {
      console.log("[v0] IP already exists for user:", ip_address)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in track-ip route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
