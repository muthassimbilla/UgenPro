import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth-server"
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    console.log("🔧 Debug: Inserting sample data...")
    
    // Use service role client for admin operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("❌ Missing Supabase credentials")
      return NextResponse.json({ 
        error: "Missing Supabase credentials", 
        details: "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required" 
      }, { status: 500 })
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    console.log("✅ Service role client created successfully")

    // First, get a user from profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .limit(1)

    if (profilesError || !profiles || profiles.length === 0) {
      console.error("❌ No users found:", profilesError)
      return NextResponse.json({ 
        error: "No users found", 
        details: "Create some users first before inserting sample data",
        recommendations: [
          "Create a user account first",
          "Or use the 'New User' button in admin panel"
        ]
      }, { status: 400 })
    }

    const userId = profiles[0].id
    console.log("✅ Found user:", profiles[0].full_name, "ID:", userId)

    // Insert sample IP data
    const sampleIPData = [
      {
        user_id: userId,
        ip_address: '192.168.1.100',
        country: 'Bangladesh',
        city: 'Dhaka',
        isp: 'Grameenphone',
        is_current: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        user_id: userId,
        ip_address: '203.76.32.4',
        country: 'Bangladesh',
        city: 'Chittagong',
        isp: 'Robi',
        is_current: false,
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        updated_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        user_id: userId,
        ip_address: '103.21.244.0',
        country: 'Bangladesh',
        city: 'Sylhet',
        isp: 'Banglalink',
        is_current: false,
        created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        updated_at: new Date(Date.now() - 172800000).toISOString()
      }
    ]

    // If there are multiple users, add data for the second user too
    if (profiles.length > 1) {
      sampleIPData.push({
        user_id: profiles[1].id,
        ip_address: '45.76.123.45',
        country: 'Bangladesh',
        city: 'Rajshahi',
        isp: 'Teletalk',
        is_current: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }

    console.log("🔧 Inserting sample IP data...")
    const { data: insertData, error: insertError } = await supabase
      .from('user_ip_history')
      .insert(sampleIPData)
      .select()

    if (insertError) {
      console.error("❌ Error inserting sample data:", insertError)
      return NextResponse.json({ 
        error: "Failed to insert sample data", 
        details: insertError.message,
        recommendations: [
          "Check database permissions",
          "Verify table structure",
          "Check RLS policies"
        ]
      }, { status: 500 })
    }

    console.log("✅ Sample data inserted successfully:", insertData.length, "records")

    // Verify the data was inserted
    const { data: verifyData, error: verifyError } = await supabase
      .from('user_ip_history')
      .select('*')
      .eq('user_id', userId)

    if (verifyError) {
      console.error("❌ Error verifying data:", verifyError)
    } else {
      console.log("✅ Verification successful:", verifyData.length, "records found")
    }

    return NextResponse.json({
      success: true,
      message: "Sample data inserted successfully",
      inserted_records: insertData.length,
      sample_data: insertData,
      verification: {
        user_id: userId,
        total_records: verifyData?.length || 0,
        unique_ips: verifyData ? new Set(verifyData.map(ip => ip.ip_address)).size : 0
      },
      next_steps: [
        "Sample data has been inserted",
        "Try the 'Debug Devices' button again",
        "Check user cards for device count",
        "View detailed device information"
      ]
    })

  } catch (error) {
    console.error("❌ Sample data insertion failed:", error)
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
