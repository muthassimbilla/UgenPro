import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// POST - Send bulk notifications (admin only)
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { userIds, title, message, type = "info", link, sendToAll } = body

    if (!title || !message) {
      return NextResponse.json({ error: "Title and message are required" }, { status: 400 })
    }

    let targetUserIds = userIds || []

    // If sendToAll is true, get all user IDs
    if (sendToAll) {
      const { data: allUsers, error: usersError } = await supabase
        .from("profiles")
        .select("id")
        .not("id", "is", null)

      if (usersError) {
        console.error("[v0] Error fetching all users:", usersError)
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
      }

      targetUserIds = allUsers?.map((user) => user.id) || []
    }

    if (targetUserIds.length === 0) {
      return NextResponse.json({ error: "No users specified" }, { status: 400 })
    }

    // Create notifications for all specified users
    const notifications = targetUserIds.map((userId: string) => ({
      user_id: userId,
      title,
      message,
      type,
      link,
    }))

    const { data: createdNotifications, error } = await supabase
      .from("notifications")
      .insert(notifications)
      .select()

    if (error) {
      console.error("[v0] Bulk create notifications error:", error)
      return NextResponse.json({ error: "Failed to create bulk notifications" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Successfully sent ${createdNotifications?.length || 0} notifications`,
      count: createdNotifications?.length || 0,
      notifications: createdNotifications,
    })
  } catch (error) {
    console.error("[v0] Bulk notifications API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET - Get bulk notification templates (admin only)
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

    // Return predefined notification templates
    const templates = [
      {
        id: "welcome",
        title: "স্বাগতম UGen Pro তে!",
        message: "আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে। আমাদের টুলস ব্যবহার করা শুরু করুন।",
        type: "success",
        link: "/tool",
      },
      {
        id: "account_approved",
        title: "অ্যাকাউন্ট অনুমোদিত",
        message: "আপনার অ্যাকাউন্ট অনুমোদিত হয়েছে। এখন আপনি সকল ফিচার ব্যবহার করতে পারবেন।",
        type: "success",
        link: "/profile",
      },
      {
        id: "maintenance",
        title: "সিস্টেম রক্ষণাবেক্ষণ",
        message: "আমরা সিস্টেম রক্ষণাবেক্ষণের জন্য অস্থায়ীভাবে সেবা বন্ধ রাখব। অসুবিধার জন্য দুঃখিত।",
        type: "warning",
        link: null,
      },
      {
        id: "new_feature",
        title: "নতুন ফিচার যোগ হয়েছে!",
        message: "আমাদের নতুন AI-চালিত কন্টেন্ট জেনারেটর দেখুন!",
        type: "info",
        link: "/tool",
      },
      {
        id: "account_expiring",
        title: "অ্যাকাউন্ট শীঘ্রই মেয়াদ উত্তীর্ণ",
        message: "আপনার অ্যাকাউন্ট ৭ দিনের মধ্যে মেয়াদ উত্তীর্ণ হবে। সেবা অব্যাহত রাখতে নবায়ন করুন।",
        type: "warning",
        link: "/profile",
      },
      {
        id: "security_alert",
        title: "নিরাপত্তা সতর্কতা",
        message: "আপনার অ্যাকাউন্টে সন্দেহজনক কার্যকলাপ সনাক্ত হয়েছে। অবিলম্বে পাসওয়ার্ড পরিবর্তন করুন।",
        type: "error",
        link: "/change-password",
      },
    ]

    return NextResponse.json({ templates })
  } catch (error) {
    console.error("[v0] Get notification templates API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
