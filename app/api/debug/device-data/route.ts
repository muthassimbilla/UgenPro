import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth-server"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Debug: Starting device data check...")
    
    const supabase = createServerSupabaseClient()
    
    if (!supabase) {
      console.error("❌ Supabase client not available")
      return NextResponse.json({ 
        error: "Supabase client not available", 
        details: "Check your environment variables" 
      }, { status: 500 })
    }

    console.log("✅ Supabase client created successfully")

    // 1. Check if user_ip_history table has the new columns
    console.log("🔍 Checking table structure...")
    const { data: tableInfo, error: tableError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'user_ip_history')
      .eq('table_schema', 'public')

    if (tableError) {
      console.error("❌ Error checking table structure:", tableError)
      
      // Try alternative method - direct table access
      console.log("🔄 Trying alternative method - direct table access...")
      const { data: directTableCheck, error: directError } = await supabase
        .from('user_ip_history')
        .select('*')
        .limit(1)
      
      if (directError) {
        console.error("❌ Direct table access also failed:", directError)
        return NextResponse.json({ 
          error: "Database access failed", 
          details: `Table structure check: ${tableError.message}, Direct access: ${directError.message}`,
          recommendations: [
            "Check if SUPABASE_SERVICE_ROLE_KEY is set correctly",
            "Verify database permissions",
            "Ensure user_ip_history table exists",
            "Check if RLS policies allow access"
          ]
        }, { status: 500 })
      }
      
      console.log("✅ Direct table access successful")
      // If direct access works, we can still provide some info
      return NextResponse.json({
        success: true,
        message: "Direct table access successful, but information_schema access failed",
        table_structure: {
          has_required_columns: "Unknown (information_schema access failed)",
          direct_access: "Working"
        },
        recommendations: [
          "Table exists and is accessible",
          "information_schema access may be restricted",
          "Try running the database migration script manually"
        ]
      })
    }

    // 2. Check if there are any users
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .limit(5)

    if (profilesError) {
      console.error("❌ Error fetching profiles:", profilesError)
      return NextResponse.json({ 
        error: "Failed to fetch profiles", 
        details: profilesError.message 
      }, { status: 500 })
    }

    // 3. Check existing IP history data
    const { data: ipHistory, error: ipError } = await supabase
      .from('user_ip_history')
      .select('*')
      .limit(10)

    if (ipError) {
      console.error("❌ Error fetching IP history:", ipError)
      return NextResponse.json({ 
        error: "Failed to fetch IP history", 
        details: ipError.message 
      }, { status: 500 })
    }

    // 4. Test device count calculation for first user
    let deviceCountTest = null
    if (profiles.length > 0) {
      const { data: userIPHistory, error: userIPError } = await supabase
        .from('user_ip_history')
        .select('ip_address, is_current')
        .eq('user_id', profiles[0].id)

      if (!userIPError && userIPHistory) {
        const uniqueIPs = new Set(userIPHistory.map((ip) => ip.ip_address))
        deviceCountTest = {
          user_id: profiles[0].id,
          user_name: profiles[0].full_name,
          total_records: userIPHistory.length,
          unique_ips: uniqueIPs.size,
          ip_addresses: Array.from(uniqueIPs)
        }
      }
    }

    const debugInfo = {
      success: true,
      table_structure: {
        columns: tableInfo.map(col => ({
          name: col.column_name,
          type: col.data_type
        })),
        has_required_columns: tableInfo.some(col => col.column_name === 'country') &&
                             tableInfo.some(col => col.column_name === 'city') &&
                             tableInfo.some(col => col.column_name === 'isp') &&
                             tableInfo.some(col => col.column_name === 'updated_at')
      },
      users: {
        count: profiles.length,
        sample: profiles.map(p => ({
          id: p.id,
          name: p.full_name,
          email: p.email
        }))
      },
      ip_history: {
        count: ipHistory.length,
        sample: ipHistory.map(ip => ({
          id: ip.id,
          user_id: ip.user_id,
          ip_address: ip.ip_address,
          country: ip.country,
          city: ip.city,
          isp: ip.isp,
          is_current: ip.is_current,
          created_at: ip.created_at,
          updated_at: ip.updated_at
        }))
      },
      device_count_test: deviceCountTest,
      recommendations: []
    }

    // Add recommendations based on findings
    if (!debugInfo.table_structure.has_required_columns) {
      debugInfo.recommendations.push("Run the database migration script to add missing columns")
    }
    
    if (profiles.length === 0) {
      debugInfo.recommendations.push("No users found. Create some users first.")
    }
    
    if (ipHistory.length === 0) {
      debugInfo.recommendations.push("No IP history data found. Users need to log in to generate device data.")
    }

    console.log("✅ Debug info generated:", debugInfo)

    return NextResponse.json(debugInfo)

  } catch (error) {
    console.error("❌ Debug failed:", error)
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { user_id, ip_address, country, city, isp } = await request.json()

    if (!user_id || !ip_address) {
      return NextResponse.json({ error: "Missing user_id or ip_address" }, { status: 400 })
    }

    console.log("🔧 Debug: Inserting test IP data...")

    // Insert test IP data
    const { data: insertData, error: insertError } = await supabase
      .from('user_ip_history')
      .insert({
        user_id,
        ip_address,
        country: country || 'Bangladesh',
        city: city || 'Dhaka',
        isp: isp || 'Test ISP',
        is_current: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()

    if (insertError) {
      console.error("❌ Error inserting test data:", insertError)
      return NextResponse.json({ 
        error: "Failed to insert test data", 
        details: insertError.message 
      }, { status: 500 })
    }

    console.log("✅ Test data inserted:", insertData)

    return NextResponse.json({
      success: true,
      message: "Test data inserted successfully",
      data: insertData[0]
    })

  } catch (error) {
    console.error("❌ Debug insert failed:", error)
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
