import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get the session
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    if (!session) {
      return NextResponse.json({ message: "No active session" })
    }
    
    // Get user data
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 })
    }
    
    return NextResponse.json({
      message: "Session active",
      session,
      user
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}