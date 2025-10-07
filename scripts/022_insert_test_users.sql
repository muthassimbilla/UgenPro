-- Insert test users into profiles table for testing admin panel
-- This script creates 3 test users with different statuses

DO $$
DECLARE
  v_user_id_1 uuid;
  v_user_id_2 uuid;
  v_user_id_3 uuid;
BEGIN
  -- Generate UUIDs for test users
  v_user_id_1 := gen_random_uuid();
  v_user_id_2 := gen_random_uuid();
  v_user_id_3 := gen_random_uuid();

  -- Insert test user 1: Active and approved
  INSERT INTO profiles (
    id,
    full_name,
    email,
    telegram_username,
    is_active,
    is_approved,
    account_status,
    approved_at,
    expiration_date,
    created_at,
    updated_at
  ) VALUES (
    v_user_id_1,
    'Test User 1',
    'testuser1@example.com',
    'testuser1',
    true,
    true,
    'active',
    NOW(),
    NOW() + INTERVAL '30 days',
    NOW() - INTERVAL '5 days',
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  -- Insert test user 2: Pending approval
  INSERT INTO profiles (
    id,
    full_name,
    email,
    telegram_username,
    is_active,
    is_approved,
    account_status,
    created_at,
    updated_at
  ) VALUES (
    v_user_id_2,
    'Test User 2',
    'testuser2@example.com',
    'testuser2',
    false,
    false,
    'active',
    NOW() - INTERVAL '2 days',
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  -- Insert test user 3: Active with IP history
  INSERT INTO profiles (
    id,
    full_name,
    email,
    telegram_username,
    is_active,
    is_approved,
    account_status,
    approved_at,
    expiration_date,
    created_at,
    updated_at
  ) VALUES (
    v_user_id_3,
    'Test User 3',
    'testuser3@example.com',
    'testuser3',
    true,
    true,
    'active',
    NOW() - INTERVAL '10 days',
    NOW() + INTERVAL '60 days',
    NOW() - INTERVAL '15 days',
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  -- Add IP history for test user 3
  INSERT INTO user_ip_history (
    user_id,
    ip_address,
    country,
    city,
    isp,
    is_current,
    created_at,
    updated_at
  ) VALUES
  (
    v_user_id_3,
    '103.230.105.45',
    'Bangladesh',
    'Dhaka',
    'Grameenphone',
    true,
    NOW() - INTERVAL '1 hour',
    NOW()
  ),
  (
    v_user_id_3,
    '103.230.105.46',
    'Bangladesh',
    'Dhaka',
    'Grameenphone',
    false,
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
  )
  ON CONFLICT (user_id, ip_address) DO UPDATE SET
    is_current = EXCLUDED.is_current,
    updated_at = EXCLUDED.updated_at;

  RAISE NOTICE 'Test users inserted successfully!';
  RAISE NOTICE 'User 1 ID: %', v_user_id_1;
  RAISE NOTICE 'User 2 ID: %', v_user_id_2;
  RAISE NOTICE 'User 3 ID: %', v_user_id_3;
END $$;
