create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  is_active boolean not null default true,
  start_date timestamptz,
  end_date timestamptz,
  created_at timestamptz not null default now(),
  constraint announcements_date_range_check
    check (end_date is null or start_date is null or end_date > start_date)
);

create table if not exists public.barista_team (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  bio text,
  photo_url text,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.faqs
  add column if not exists category text,
  add column if not exists display_order integer not null default 0,
  add column if not exists created_at timestamptz not null default now();

update public.faqs
set display_order = sort_order
where display_order = 0 and sort_order <> 0;

create table if not exists public.store_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists announcements_active_dates_idx
  on public.announcements (is_active, start_date, end_date);
create index if not exists barista_team_display_order_idx
  on public.barista_team (display_order);
create index if not exists faqs_category_display_order_idx
  on public.faqs (category, display_order);

alter table public.announcements enable row level security;
alter table public.barista_team enable row level security;
alter table public.faqs enable row level security;
alter table public.store_settings enable row level security;

create policy "announcements public read active"
  on public.announcements for select to anon, authenticated
  using (
    is_active
    and (start_date is null or start_date <= now())
    and (end_date is null or end_date > now())
  );
create policy "announcements staff insert"
  on public.announcements for insert to authenticated
  with check ((select public.is_staff()));
create policy "announcements staff update"
  on public.announcements for update to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));
create policy "announcements staff delete"
  on public.announcements for delete to authenticated
  using ((select public.is_staff()));

create policy "barista team public read"
  on public.barista_team for select to anon, authenticated
  using (true);
create policy "barista team staff insert"
  on public.barista_team for insert to authenticated
  with check ((select public.is_staff()));
create policy "barista team staff update"
  on public.barista_team for update to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));
create policy "barista team staff delete"
  on public.barista_team for delete to authenticated
  using ((select public.is_staff()));

drop policy if exists "read faqs" on public.faqs;
drop policy if exists "admin all faqs" on public.faqs;
drop policy if exists "active staff all faqs" on public.faqs;
create policy "faqs public read"
  on public.faqs for select to anon, authenticated
  using (true);
create policy "faqs staff insert"
  on public.faqs for insert to authenticated
  with check ((select public.is_staff()));
create policy "faqs staff update"
  on public.faqs for update to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));
create policy "faqs staff delete"
  on public.faqs for delete to authenticated
  using ((select public.is_staff()));

create policy "store settings public read"
  on public.store_settings for select to anon, authenticated
  using (true);
create policy "store settings staff insert"
  on public.store_settings for insert to authenticated
  with check ((select public.is_staff()));
create policy "store settings staff update"
  on public.store_settings for update to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));
create policy "store settings staff delete"
  on public.store_settings for delete to authenticated
  using ((select public.is_staff()));
