-- Additional Schema for AIB Hub
-- Run this in Supabase SQL Editor after the initial schema

-- 1. Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Job Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references public.jobs(id) on delete cascade not null,
  creator_id uuid references public.creators(id) on delete cascade not null,
  cover_letter text,
  status text default 'PENDING',
  applied_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(job_id, creator_id) -- One application per job per creator
);

-- 3. Job Invitations Table (for "Invite for Job" feature)
CREATE TABLE IF NOT EXISTS public.invitations (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references public.jobs(id) on delete cascade,
  creator_id uuid references public.creators(id) on delete cascade not null,
  sender_email text not null,
  message text,
  job_title text, -- For quick invites without existing job
  job_budget text,
  status text default 'PENDING',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- 5. Policies for contact_messages
CREATE POLICY "Anyone can submit contact messages" 
  ON public.contact_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can view contact messages" 
  ON public.contact_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

-- 6. Policies for applications
CREATE POLICY "Creators can view their own applications" 
  ON public.applications FOR SELECT 
  USING (creator_id IN (SELECT id FROM creators WHERE linked_user_id = auth.uid()));

CREATE POLICY "Job posters can view applications to their jobs" 
  ON public.applications FOR SELECT 
  USING (job_id IN (SELECT id FROM jobs WHERE creator_id = auth.uid()));

CREATE POLICY "Authenticated users can apply to jobs" 
  ON public.applications FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- 7. Policies for invitations
CREATE POLICY "Anyone can send invitations" 
  ON public.invitations FOR INSERT WITH CHECK (true);

CREATE POLICY "Creators can view invitations sent to them" 
  ON public.invitations FOR SELECT 
  USING (creator_id IN (SELECT id FROM creators WHERE linked_user_id = auth.uid()));
