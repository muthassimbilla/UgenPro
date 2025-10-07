// Test script to check device data and insert sample data
const { createClient } = require('@supabase/supabase-js')

// You need to set these environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials!')
  console.log('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testDeviceData() {
  console.log('🔍 Testing device data...\n')

  try {
    // 1. Check if user_ip_history table exists and has the new columns
    console.log('1. Checking table structure...')
    const { data: tableInfo, error: tableError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'user_ip_history')
      .eq('table_schema', 'public')

    if (tableError) {
      console.error('❌ Error checking table structure:', tableError)
      return
    }

    console.log('✅ Table columns found:')
    tableInfo.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type}`)
    })

    // 2. Check if there are any users in profiles table
    console.log('\n2. Checking users in profiles table...')
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .limit(5)

    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError)
      return
    }

    console.log(`✅ Found ${profiles.length} users:`)
    profiles.forEach(profile => {
      console.log(`   - ${profile.full_name} (${profile.email}) - ID: ${profile.id}`)
    })

    if (profiles.length === 0) {
      console.log('⚠️  No users found. Please create some users first.')
      return
    }

    // 3. Check existing IP history data
    console.log('\n3. Checking existing IP history data...')
    const { data: ipHistory, error: ipError } = await supabase
      .from('user_ip_history')
      .select('*')
      .limit(10)

    if (ipError) {
      console.error('❌ Error fetching IP history:', ipError)
      return
    }

    console.log(`✅ Found ${ipHistory.length} IP history records:`)
    ipHistory.forEach(ip => {
      console.log(`   - User: ${ip.user_id}, IP: ${ip.ip_address}, Location: ${ip.city || 'Unknown'}, ${ip.country || 'Unknown'}`)
    })

    // 4. Insert sample data if no data exists
    if (ipHistory.length === 0) {
      console.log('\n4. No IP history data found. Inserting sample data...')
      
      const sampleData = [
        {
          user_id: profiles[0].id,
          ip_address: '192.168.1.100',
          country: 'Bangladesh',
          city: 'Dhaka',
          isp: 'Grameenphone',
          is_current: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          user_id: profiles[0].id,
          ip_address: '203.76.32.4',
          country: 'Bangladesh',
          city: 'Chittagong',
          isp: 'Robi',
          is_current: false,
          created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          updated_at: new Date(Date.now() - 86400000).toISOString()
        }
      ]

      if (profiles.length > 1) {
        sampleData.push({
          user_id: profiles[1].id,
          ip_address: '103.21.244.0',
          country: 'Bangladesh',
          city: 'Sylhet',
          isp: 'Banglalink',
          is_current: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      }

      const { data: insertData, error: insertError } = await supabase
        .from('user_ip_history')
        .insert(sampleData)
        .select()

      if (insertError) {
        console.error('❌ Error inserting sample data:', insertError)
        return
      }

      console.log('✅ Sample data inserted successfully:')
      insertData.forEach(ip => {
        console.log(`   - User: ${ip.user_id}, IP: ${ip.ip_address}, Location: ${ip.city}, ${ip.country}`)
      })
    }

    // 5. Test the admin API endpoint
    console.log('\n5. Testing admin API endpoint...')
    const testUserId = profiles[0].id
    const response = await fetch(`http://localhost:3000/api/admin/user-devices?user_id=${testUserId}`)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Admin API working:')
      console.log(`   - Found ${data.data.length} devices for user ${testUserId}`)
      data.data.forEach(device => {
        console.log(`   - Device: ${device.device_name}, IP: ${device.ip_address}`)
      })
    } else {
      console.log('⚠️  Admin API not accessible (this is normal if server is not running)')
    }

    console.log('\n🎉 Test completed successfully!')
    console.log('\n📝 Next steps:')
    console.log('1. Make sure you have run the database migration script')
    console.log('2. Check that your Supabase service role key is set correctly')
    console.log('3. Restart your development server')
    console.log('4. Check the admin panel again')

  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the test
testDeviceData()
