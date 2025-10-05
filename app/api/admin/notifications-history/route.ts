import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET - Fetch all notifications history (admin only)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get admin user from session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    // Get query params
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "100")
    const type = searchParams.get("type")

    // Build query to get notifications with user info
    let query = supabase
      .from("notifications")
      .select(`
        *,
        user:profiles!notifications_user_id_fkey(
          full_name,
          telegram_username
        )
      `)
      .order("created_at", { ascending: false })
      .limit(limit)

    // Filter by type if specified
    if (type && type !== "all") {
      query = query.eq("type", type)
    }

    const { data: notifications, error } = await query

    if (error) {
      console.error("[v0] Fetch notifications history error:", error)
      return NextResponse.json({ error: "Failed to fetch notifications history" }, { status: 500 })
    }

    // Get statistics
    const { data: stats } = await supabase
      .from("notifications")
      .select("type, is_read")

    const totalNotifications = stats?.length || 0
    const readNotifications = stats?.filter(n => n.is_read).length || 0
    const unreadNotifications = totalNotifications - readNotifications
    const typeStats = stats?.reduce((acc: any, notification: any) => {
      acc[notification.type] = (acc[notification.type] || 0) + 1
      return acc
    }, {}) || {}

    return NextResponse.json({
      notifications: notifications || [],
      statistics: {
        total: totalNotifications,
        read: readNotifications,
        unread: unreadNotifications,
        typeStats,
      },
    })
  } catch (error) {
    console.error("[v0] Notifications history API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete notification (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get admin user from session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const notificationId = searchParams.get("id")

    if (!notificationId) {
      return NextResponse.json({ error: "Notification ID required" }, { status: 400 })
    }

    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId)

    if (error) {
      console.error("[v0] Delete notification error:", error)
      return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Notification deleted successfully" })
  } catch (error) {
    console.error("[v0] Delete notification API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
