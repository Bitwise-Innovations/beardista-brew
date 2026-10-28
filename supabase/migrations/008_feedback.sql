alter table public.reviews
  add column if not exists comment text,
  add column if not exists customer_name text,
  add column if not exists is_published boolean not null default false;

update public.reviews
set comment = coalesce(comment, quote),
    customer_name = coalesce(customer_name, author),
    is_published = status = 'approved';

alter table public.reviews
  alter column comment set not null,
  alter column customer_name set not null;

create or replace function public.sync_review_legacy_fields()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    new.comment := coalesce(new.comment, new.quote);
    new.quote := coalesce(new.quote, new.comment);
    new.customer_name := coalesce(new.customer_name, new.author);
    new.author := coalesce(new.author, new.customer_name);
    new.is_published := new.is_published or new.status = 'approved';
  else
    if new.comment is distinct from old.comment then
      new.quote := new.comment;
    elsif new.quote is distinct from old.quote then
      new.comment := new.quote;
    end if;

    if new.customer_name is distinct from old.customer_name then
      new.author := new.customer_name;
    elsif new.author is distinct from old.author then
      new.customer_name := new.author;
    end if;

    if new.is_published is distinct from old.is_published then
      new.status := case when new.is_published then 'approved' else 'pending' end;
    elsif new.status is distinct from old.status then
      new.is_published := new.status = 'approved';
    end if;
  end if;

  if new.is_published then
    new.status := 'approved';
  elsif new.status = 'approved' then
    new.status := 'pending';
  end if;

  return new;
end;
$$;

drop trigger if exists sync_review_legacy_fields on public.reviews;
create trigger sync_review_legacy_fields
  before insert or update of quote, author, status, comment, customer_name, is_published
  on public.reviews
  for each row execute function public.sync_review_legacy_fields();

create table if not exists public.surveys (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  questions jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  survey_id uuid not null references public.surveys(id) on delete cascade,
  answers jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists survey_responses_survey_created_idx
  on public.survey_responses (survey_id, created_at desc);

alter table public.reviews enable row level security;
alter table public.surveys enable row level security;
alter table public.survey_responses enable row level security;

drop policy if exists "read approved reviews" on public.reviews;
drop policy if exists "submit review" on public.reviews;
drop policy if exists "admin all reviews" on public.reviews;
drop policy if exists "active staff all reviews" on public.reviews;
drop policy if exists "reviews public read published" on public.reviews;
create policy "reviews public read published" on public.reviews
  for select to anon, authenticated
  using (is_published);

create policy "reviews public submit" on public.reviews
  for insert to anon, authenticated
  with check (
    not is_published
    and status = 'pending'
    and rating between 1 and 5
    and length(trim(comment)) > 0
    and length(trim(customer_name)) > 0
  );

drop policy if exists "reviews staff manage" on public.reviews;
create policy "reviews staff manage" on public.reviews
  for all to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));

create policy "surveys public read active" on public.surveys
  for select to anon, authenticated
  using (is_active);
create policy "surveys staff manage" on public.surveys
  for all to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));

create policy "survey responses public submit" on public.survey_responses
  for insert to anon, authenticated
  with check (
    exists (
      select 1
      from public.surveys
      where id = survey_id and is_active
    )
  );
create policy "survey responses staff manage" on public.survey_responses
  for all to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));

create or replace function public.get_dashboard_analytics()
returns table (
  total_sales numeric,
  active_menu_items_count bigint,
  upcoming_events_count bigint,
  average_rating numeric
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not (select public.is_staff()) then
    raise exception using errcode = '42501', message = 'Active staff access required';
  end if;

  return query
  select
    0::numeric,
    (
      select count(*) from public.menu_items
      where is_available
    ),
    (
      select count(*) from public.events
      where is_active
    ),
    (
      select avg(rating)::numeric from public.reviews
      where is_published
    );
end;
$$;

revoke all on function public.get_dashboard_analytics() from public;
grant execute on function public.get_dashboard_analytics() to authenticated;
