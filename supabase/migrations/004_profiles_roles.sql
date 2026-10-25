create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role text not null check (role in ('owner', 'admin', 'staff')),
  status text not null default 'active' check (status in ('active', 'disabled')),
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and status = 'active'
      and role in ('owner', 'admin', 'staff')
  );
$$;

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and status = 'active'
      and role = 'owner'
  );
$$;

drop policy if exists "profiles read own or owner" on public.profiles;
create policy "profiles read own or owner" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or (select public.is_owner()));

drop policy if exists "profiles owner manage" on public.profiles;
create policy "profiles owner manage" on public.profiles
  for all to authenticated
  using ((select public.is_owner()))
  with check ((select public.is_owner()));

drop policy if exists "admin all categories" on public.categories;
drop policy if exists "active staff all categories" on public.categories;
create policy "active staff all categories" on public.categories
  for all to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));

drop policy if exists "admin all items" on public.items;
drop policy if exists "active staff all items" on public.items;
create policy "active staff all items" on public.items
  for all to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));

drop policy if exists "admin all events" on public.events;
drop policy if exists "active staff all events" on public.events;
create policy "active staff all events" on public.events
  for all to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));

drop policy if exists "admin all reviews" on public.reviews;
drop policy if exists "active staff all reviews" on public.reviews;
create policy "active staff all reviews" on public.reviews
  for all to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));

drop policy if exists "admin all faqs" on public.faqs;
drop policy if exists "active staff all faqs" on public.faqs;
create policy "active staff all faqs" on public.faqs
  for all to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));

drop policy if exists "admin all settings" on public.settings;
drop policy if exists "active staff all settings" on public.settings;
create policy "active staff all settings" on public.settings
  for all to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));
