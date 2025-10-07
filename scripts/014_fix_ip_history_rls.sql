-- Fix RLS policies for user_ip_history to allow server-side inserts
-- Drop existing policies
drop policy if exists "Users can insert their own IP history" on public.user_ip_history;

-- Create new policy that allows service role to insert
create policy "Allow service role to insert IP history"
  on public.user_ip_history for insert
  with check (true);

-- Keep the select policy for users
-- Users can still view their own IP history
