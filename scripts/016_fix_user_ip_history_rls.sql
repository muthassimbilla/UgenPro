-- Fix RLS policies for user_ip_history table to allow admin operations
-- This script will allow service role to insert/update/delete IP history data

-- Drop existing restrictive policies
drop policy if exists "Users can view their own IP history" on public.user_ip_history;
drop policy if exists "Users can insert their own IP history" on public.user_ip_history;
drop policy if exists "Allow service role to insert IP history" on public.user_ip_history;

-- Create new policies that allow service role operations
create policy "Allow service role full access to IP history"
  on public.user_ip_history for all
  to service_role
  using (true)
  with check (true);

-- Allow users to view their own IP history
create policy "Users can view their own IP history"
  on public.user_ip_history for select
  using (auth.uid() = user_id);

-- Allow users to insert their own IP history
create policy "Users can insert their own IP history"
  on public.user_ip_history for insert
  with check (auth.uid() = user_id);

-- Allow service role to insert IP history for any user (for admin operations)
create policy "Service role can insert IP history for any user"
  on public.user_ip_history for insert
  to service_role
  with check (true);

-- Allow service role to update IP history for any user
create policy "Service role can update IP history for any user"
  on public.user_ip_history for update
  to service_role
  using (true)
  with check (true);

-- Allow service role to delete IP history for any user
create policy "Service role can delete IP history for any user"
  on public.user_ip_history for delete
  to service_role
  using (true);

-- Add comment to explain the policies
comment on table public.user_ip_history is 'Tracks user IP addresses with location and ISP information. Service role has full access for admin operations.';
