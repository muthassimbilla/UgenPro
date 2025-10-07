-- Insert test session data for existing users
-- This will help verify that the session tracking is working
-- NOTE: Run script 020 first to add the unique constraint!

-- First, check existing users
DO $$
DECLARE
  v_user_id UUID;
  v_user_email TEXT;
BEGIN
  -- Get the first user
  SELECT id, email INTO v_user_id, v_user_email
  FROM auth.users
  LIMIT 1;

  IF v_user_id IS NOT NULL THEN
    RAISE NOTICE 'Found user: % (%)', v_user_email, v_user_id;
    
    -- Insert current active session with proper conflict handling
    INSERT INTO user_ip_history (user_id, ip_address, country, city, isp, is_current, created_at, updated_at)
    VALUES (
      v_user_id,
      '103.230.105.45',
      'Bangladesh',
      'Dhaka',
      'Grameenphone',
      true,
      NOW(),
      NOW()
    )
    ON CONFLICT (user_id, ip_address) 
    DO UPDATE SET 
      is_current = true,
      updated_at = NOW();

    -- Insert previous session from different location
    INSERT INTO user_ip_history (user_id, ip_address, country, city, isp, is_current, created_at, updated_at)
    VALUES (
      v_user_id,
      '203.76.32.100',
      'Bangladesh',
      'Chittagong',
      'Robi',
      false,
      NOW() - INTERVAL '2 days',
      NOW() - INTERVAL '2 days'
    )
    ON CONFLICT (user_id, ip_address) 
    DO UPDATE SET 
      is_current = false,
      updated_at = NOW() - INTERVAL '2 days';

    -- Insert another old session
    INSERT INTO user_ip_history (user_id, ip_address, country, city, isp, is_current, created_at, updated_at)
    VALUES (
      v_user_id,
      '45.123.67.89',
      'Bangladesh',
      'Sylhet',
      'Banglalink',
      false,
      NOW() - INTERVAL '5 days',
      NOW() - INTERVAL '5 days'
    )
    ON CONFLICT (user_id, ip_address) 
    DO UPDATE SET 
      is_current = false,
      updated_at = NOW() - INTERVAL '5 days';

    RAISE NOTICE 'Inserted test session data for user %', v_user_email;
  ELSE
    RAISE NOTICE 'No users found in the database';
  END IF;
END $$;

-- Verify the inserted data
SELECT 
  u.email,
  uih.ip_address,
  uih.city,
  uih.country,
  uih.isp,
  uih.is_current,
  uih.created_at,
  uih.updated_at
FROM user_ip_history uih
JOIN auth.users u ON uih.user_id = u.id
ORDER BY uih.created_at DESC;

-- Show summary
SELECT 
  u.email,
  COUNT(DISTINCT uih.ip_address) as total_devices,
  COUNT(CASE WHEN uih.is_current = true THEN 1 END) as active_sessions
FROM auth.users u
LEFT JOIN user_ip_history uih ON u.id = uih.user_id
GROUP BY u.id, u.email
ORDER BY total_devices DESC;
