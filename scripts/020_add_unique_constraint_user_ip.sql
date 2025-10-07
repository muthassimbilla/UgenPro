-- Add unique constraint to user_ip_history table
-- This is required for ON CONFLICT clause to work properly
-- It ensures one user can have only one record per IP address

-- First, remove any duplicate entries (keep the most recent one)
DELETE FROM public.user_ip_history a
USING public.user_ip_history b
WHERE a.id < b.id 
  AND a.user_id = b.user_id 
  AND a.ip_address = b.ip_address;

-- Add unique constraint on (user_id, ip_address)
ALTER TABLE public.user_ip_history 
ADD CONSTRAINT user_ip_history_user_id_ip_address_unique 
UNIQUE (user_id, ip_address);

-- Add comment
COMMENT ON CONSTRAINT user_ip_history_user_id_ip_address_unique 
ON public.user_ip_history 
IS 'Ensures each user can have only one record per unique IP address';
