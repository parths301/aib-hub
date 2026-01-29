-- Enable Row Level Security
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- 1. Create Profiles Table (extends auth.users)
-- This table tracks linked users
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  role text default 'CREATOR',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Creators Table
-- Note: id is now auto-generated UUID. linked_user_id is the link to Auth.
create table public.creators (
  id uuid default gen_random_uuid() primary key,
  linked_user_id uuid references public.profiles(id) on delete set null, 
  full_name text,
  email text,
  city text,
  skills text[], -- Array of strings
  purchased_tags text[],
  bio text,
  experience text,
  profile_photo text,
  whatsapp text,
  is_featured boolean default false,
  tier text default 'BASE',
  status text default 'PENDING',
  portfolio jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Jobs Table
create table public.jobs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  city text,
  required_skills text[],
  description text,
  budget text,
  company text,
  contact_email text,
  whatsapp text,
  posted_date date default current_date,
  status text default 'OPEN',
  creator_id uuid references public.profiles(id), -- If a user posted it, this links to their profile
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable RLS
alter table public.profiles enable row level security;
alter table public.creators enable row level security;
alter table public.jobs enable row level security;

-- 5. Policies

-- Profiles
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Creators
create policy "Public creators are viewable by everyone." on public.creators for select using (true);
-- Allow anyone to insert (for now, or restrict to service_role for seeding)
-- create policy "Service role can insert creators." on public.creators for insert with check (true); 
-- For MVP, let's allow authenticated users to 'create' a creator profile if they don't have one? 
-- Actually, let's allow public insert for the purpose of the 'Join' form if we weren't using Auth heavily, 
-- but since we are, let's say "Users can insert if they link their own ID".
create policy "Users can insert their own creator profile." on public.creators for insert with check (auth.uid() = linked_user_id);
create policy "Creators can update own profile." on public.creators for update using (auth.uid() = linked_user_id);

-- Jobs
create policy "Jobs are viewable by everyone." on public.jobs for select using (true);
create policy "Authenticated users can post jobs." on public.jobs for insert with check (auth.role() = 'authenticated');
create policy "Users can update their own jobs." on public.jobs for update using (auth.uid() = creator_id);

-- 6. Storage Buckets
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
insert into storage.buckets (id, name, public) values ('portfolio', 'portfolio', true);

-- Storage Policies
create policy "Avatar images are publicly accessible." on storage.objects for select using ( bucket_id = 'avatars' );
create policy "Anyone can upload an avatar." on storage.objects for insert with check ( bucket_id = 'avatars' );

create policy "Portfolio images are publicly accessible." on storage.objects for select using ( bucket_id = 'portfolio' );
create policy "Anyone can upload portfolio items." on storage.objects for insert with check ( bucket_id = 'portfolio' );
