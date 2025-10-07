-- Insert sample data with actual user ID
-- This script will get a real user ID and insert sample IP data

-- First, let's see what users we have
SELECT id, full_name, email FROM profiles LIMIT 5;

-- Insert sample data using the first user's ID
-- Replace the UUID below with an actual user ID from the query above
INSERT INTO user_ip_history (user_id, ip_address, country, city, isp, is_current, created_at, updated_at)
SELECT 
  p.id as user_id,
  '192.168.1.100' as ip_address,
  'Bangladesh' as country,
  'Dhaka' as city,
  'Grameenphone' as isp,
  true as is_current,
  NOW() as created_at,
  NOW() as updated_at
FROM profiles p
LIMIT 1;

-- Insert second IP for the same user
INSERT INTO user_ip_history (user_id, ip_address, country, city, isp, is_current, created_at, updated_at)
SELECT 
  p.id as user_id,
  '203.76.32.4' as ip_address,
  'Bangladesh' as country,
  'Chittagong' as city,
  'Robi' as isp,
  false as is_current,
  NOW() - INTERVAL '1 day' as created_at,
  NOW() - INTERVAL '1 day' as updated_at
FROM profiles p
LIMIT 1;

-- Insert third IP for the same user
INSERT INTO user_ip_history (user_id, ip_address, country, city, isp, is_current, created_at, updated_at)
SELECT 
  p.id as user_id,
  '103.21.244.0' as ip_address,
  'Bangladesh' as country,
  'Sylhet' as city,
  'Banglalink' as isp,
  false as is_current,
  NOW() - INTERVAL '2 days' as created_at,
  NOW() - INTERVAL '2 days' as updated_at
FROM profiles p
LIMIT 1;

-- If you have multiple users, insert data for the second user too
INSERT INTO user_ip_history (user_id, ip_address, country, city, isp, is_current, created_at, updated_at)
SELECT 
  p.id as user_id,
  '45.76.123.45' as ip_address,
  'Bangladesh' as country,
  'Rajshahi' as city,
  'Teletalk' as isp,
  true as is_current,
  NOW() as created_at,
  NOW() as updated_at
FROM profiles p
OFFSET 1
LIMIT 1;

-- Verify the data was inserted
SELECT 
  uih.user_id,
  p.full_name,
  uih.ip_address,
  uih.city,
  uih.country,
  uih.isp,
  uih.is_current,
  uih.created_at
FROM user_ip_history uih
JOIN profiles p ON uih.user_id = p.id
ORDER BY uih.created_at DESC;

-- Check device count per user
SELECT 
  p.full_name,
  COUNT(DISTINCT uih.ip_address) as unique_devices,
  COUNT(*) as total_records
FROM profiles p
LEFT JOIN user_ip_history uih ON p.id = uih.user_id
GROUP BY p.id, p.full_name
ORDER BY unique_devices DESC;
