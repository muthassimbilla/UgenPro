-- Update user_ip_history table to include location and ISP information
-- This will help with better device tracking and security monitoring

-- Add new columns to user_ip_history table
alter table public.user_ip_history 
add column if not exists country text,
add column if not exists city text,
add column if not exists isp text,
add column if not exists updated_at timestamp with time zone default now();

-- Create index for the new columns
create index if not exists user_ip_history_country_idx on public.user_ip_history(country);
create index if not exists user_ip_history_city_idx on public.user_ip_history(city);
create index if not exists user_ip_history_isp_idx on public.user_ip_history(isp);

-- Update existing records to have updated_at = created_at
update public.user_ip_history 
set updated_at = created_at 
where updated_at is null;

-- Add comment to the table
comment on table public.user_ip_history is 'Tracks user IP addresses with location and ISP information for security monitoring';
