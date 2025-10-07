import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("📋 Debug: Generating manual data insertion guide...")

    const guide = {
      success: true,
      title: "Manual Data Insertion Guide",
      description: "Since automatic insertion failed due to RLS policies, here's how to manually insert sample data",
      
      steps: [
        {
          step: 1,
          title: "Run RLS Policy Fix Script",
          description: "Execute the SQL script to fix Row Level Security policies",
          sql_script: "scripts/016_fix_user_ip_history_rls.sql",
          instructions: [
            "Go to your Supabase dashboard",
            "Navigate to SQL Editor",
            "Copy and paste the content from scripts/016_fix_user_ip_history_rls.sql",
            "Execute the script"
          ]
        },
        {
          step: 2,
          title: "Manual Data Insertion",
          description: "Insert sample data directly in Supabase",
          sql_commands: [
            `-- First, get a user ID from profiles table
SELECT id, full_name FROM profiles LIMIT 1;`,
            `-- Then insert sample IP data (replace 'USER_ID_HERE' with actual user ID)
INSERT INTO user_ip_history (user_id, ip_address, country, city, isp, is_current, created_at, updated_at)
VALUES 
  ('USER_ID_HERE', '192.168.1.100', 'Bangladesh', 'Dhaka', 'Grameenphone', true, NOW(), NOW()),
  ('USER_ID_HERE', '203.76.32.4', 'Bangladesh', 'Chittagong', 'Robi', false, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
  ('USER_ID_HERE', '103.21.244.0', 'Bangladesh', 'Sylhet', 'Banglalink', false, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days');`
          ]
        },
        {
          step: 3,
          title: "Verify Data Insertion",
          description: "Check if data was inserted successfully",
          sql_commands: [
            `-- Check total records
SELECT COUNT(*) as total_records FROM user_ip_history;`,
            `-- Check unique IPs per user
SELECT user_id, COUNT(DISTINCT ip_address) as unique_devices 
FROM user_ip_history 
GROUP BY user_id;`
          ]
        }
      ],
      
      alternative_methods: [
        {
          method: "Supabase Dashboard",
          description: "Use the Supabase dashboard table editor",
          steps: [
            "Go to Table Editor in Supabase dashboard",
            "Select user_ip_history table",
            "Click 'Insert' button",
            "Add rows manually with sample data"
          ]
        },
        {
          method: "Direct SQL Execution",
          description: "Execute SQL commands directly",
          steps: [
            "Open SQL Editor in Supabase",
            "Copy the provided SQL commands",
            "Replace USER_ID_HERE with actual user ID",
            "Execute the commands"
          ]
        }
      ],
      
      sample_data: {
        user_id: "Replace with actual user ID from profiles table",
        ip_addresses: [
          { ip: "192.168.1.100", location: "Dhaka, Bangladesh", isp: "Grameenphone" },
          { ip: "203.76.32.4", location: "Chittagong, Bangladesh", isp: "Robi" },
          { ip: "103.21.244.0", location: "Sylhet, Bangladesh", isp: "Banglalink" }
        ]
      },
      
      next_steps: [
        "Run the RLS policy fix script",
        "Insert sample data manually",
        "Try the 'Insert Sample Data' button again",
        "Check device count in user cards"
      ]
    }

    return NextResponse.json(guide)

  } catch (error) {
    console.error("❌ Manual guide generation failed:", error)
    return NextResponse.json({ 
      error: "Failed to generate manual guide", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
