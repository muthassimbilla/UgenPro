-- Fix RLS policies to allow admin access to user sessions and IP history
-- This allows the admin panel to view all user session data

-- Fix user_sessions table RLS policies
drop policy if exists "Admins can view all sessions" on public.user_sessions;
drop policy if exists "Service role can access all sessions" on public.user_sessions;

-- Allow service role (used by admin API) to access all sessions
create policy "Service role can access all sessions"
  on public.user_sessions for all
  to service_role
  using (true)
  with check (true);

-- Allow authenticated users with admin role to view all sessions
create policy "Admins can view all sessions"
  on public.user_sessions for select
  using (
    exists (
      select 1 from public.admins
      where admins.id::text = auth.jwt()->>'sub'
      and admins.is_active = true
    )
  );

-- Fix user_ip_history table RLS policies for admin access
drop policy if exists "Admins can view all IP history" on public.user_ip_history;

create policy "Admins can view all IP history"
  on public.user_ip_history for select
  using (
    exists (
      select 1 from public.admins
      where admins.id::text = auth.jwt()->>'sub'
      and admins.is_active = true
    )
  );

-- Add comment
comment on policy "Service role can access all sessions" on public.user_sessions is 'Allows admin API routes to access all user sessions';
comment on policy "Admins can view all sessions" on public.user_sessions is 'Allows admin users to view all user sessions in admin panel';
comment on policy "Admins can view all IP history" on public.user_ip_history is 'Allows admin users to view all user IP history in admin panel';
