alter table public.events
  add column if not exists location text,
  add column if not exists start_time timestamptz,
  add column if not exists end_time timestamptz,
  add column if not exists capacity integer,
  add column if not exists status text,
  add column if not exists created_at timestamptz not null default now();

update public.events
set status = case when is_active then 'upcoming' else 'cancelled' end
where status is null;

alter table public.events
  alter column status set default 'upcoming',
  alter column status set not null;

alter table public.events
  add constraint events_status_check
    check (status in ('draft', 'upcoming', 'completed', 'cancelled')),
  add constraint events_capacity_check
    check (capacity is null or capacity > 0),
  add constraint events_end_time_check
    check (end_time is null or start_time is null or end_time > start_time);

create or replace function public.sync_event_active_status()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    if new.status = 'upcoming' and not new.is_active then
      new.status := 'cancelled';
    end if;
    new.is_active := new.status in ('upcoming', 'completed');
  elsif new.status is distinct from old.status then
    new.is_active := new.status in ('upcoming', 'completed');
  elsif new.is_active is distinct from old.is_active then
    new.status := case when new.is_active then 'upcoming' else 'cancelled' end;
  end if;

  return new;
end;
$$;

drop trigger if exists sync_event_active_status on public.events;
create trigger sync_event_active_status
  before insert or update of is_active, status on public.events
  for each row execute function public.sync_event_active_status();

create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id bigint not null references public.events(id) on delete cascade,
  user_email text not null,
  full_name text not null,
  phone text,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'waitlisted', 'cancelled')),
  verification_code text,
  verification_attempts integer not null default 0,
  verification_expires_at timestamptz,
  verification_sent_at timestamptz,
  is_verified boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index if not exists event_registrations_active_email_idx
  on public.event_registrations (event_id, lower(user_email))
  where status <> 'cancelled';

create index if not exists event_registrations_event_status_idx
  on public.event_registrations (event_id, status, is_verified);

alter table public.events enable row level security;
alter table public.event_registrations enable row level security;

drop policy if exists "read events" on public.events;
drop policy if exists "admin all events" on public.events;
drop policy if exists "active staff all events" on public.events;
drop policy if exists "events public read" on public.events;
drop policy if exists "events staff all" on public.events;
create policy "events public read" on public.events
  for select to anon, authenticated
  using (status <> 'draft');

create policy "events staff all" on public.events
  for all to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));

drop policy if exists "event registrations public insert" on public.event_registrations;
create policy "event registrations public insert" on public.event_registrations
  for insert to anon, authenticated
  with check (
    status = 'pending'
    and not is_verified
    and verification_code is null
    and exists (
      select 1 from public.events
      where id = event_id and status = 'upcoming'
    )
  );

drop policy if exists "event registrations staff all" on public.event_registrations;
create policy "event registrations staff all" on public.event_registrations
  for all to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));

create or replace function public.create_event_registration(
  p_event_id bigint,
  p_user_email text,
  p_full_name text,
  p_phone text,
  p_verification_code text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_event_status text;
  v_registration public.event_registrations%rowtype;
begin
  select status
  into v_event_status
  from public.events
  where id = p_event_id
  for update;

  if not found or v_event_status <> 'upcoming' then
    raise exception using errcode = 'P0002', message = 'Event is not open for registration';
  end if;

  select *
  into v_registration
  from public.event_registrations
  where event_id = p_event_id
    and lower(user_email) = lower(p_user_email)
    and status <> 'cancelled'
  for update;

  if found then
    if v_registration.is_verified or v_registration.status <> 'pending' then
      raise exception using errcode = '23505', message = 'This email is already registered for the event';
    end if;
    if v_registration.verification_sent_at > pg_catalog.now() - interval '1 minute' then
      raise exception using errcode = '55000', message = 'Please wait before requesting another code';
    end if;

    update public.event_registrations
    set verification_code = p_verification_code,
        verification_attempts = 0,
        verification_expires_at = pg_catalog.now() + interval '15 minutes',
        verification_sent_at = pg_catalog.now()
    where id = v_registration.id
    returning * into v_registration;
  else
    insert into public.event_registrations (
      event_id,
      user_email,
      full_name,
      phone,
      verification_code,
      verification_expires_at,
      verification_sent_at
    )
    values (
      p_event_id,
      lower(p_user_email),
      p_full_name,
      p_phone,
      p_verification_code,
      pg_catalog.now() + interval '15 minutes',
      pg_catalog.now()
    )
    returning * into v_registration;
  end if;

  return pg_catalog.jsonb_build_object(
    'id', v_registration.id,
    'eventId', p_event_id,
    'userEmail', v_registration.user_email,
    'fullName', v_registration.full_name
  );
end;
$$;

revoke all on function public.create_event_registration(bigint, text, text, text, text) from public;
grant execute on function public.create_event_registration(bigint, text, text, text, text) to service_role;

create or replace function public.verify_event_registration(
  p_registration_id uuid,
  p_verification_code text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_event_id bigint;
  v_capacity integer;
  v_event_status text;
  v_registration public.event_registrations%rowtype;
  v_event_title text;
  v_confirmed_count integer;
  v_registration_status text;
  v_attempts integer;
begin
  select event_id
  into v_event_id
  from public.event_registrations
  where id = p_registration_id;

  if not found then
    raise exception using errcode = 'P0002', message = 'Registration not found';
  end if;

  select capacity, title, status
  into v_capacity, v_event_title, v_event_status
  from public.events
  where id = v_event_id
  for update;

  if not found or v_event_status <> 'upcoming' then
    raise exception using errcode = '22023', message = 'Event is not open for registration';
  end if;

  select *
  into v_registration
  from public.event_registrations
  where id = p_registration_id
  for update;

  if v_registration.status = 'cancelled' then
    raise exception using errcode = '22023', message = 'Registration was cancelled';
  end if;

  if v_registration.verification_code is distinct from p_verification_code then
    if v_registration.is_verified then
      return pg_catalog.jsonb_build_object('error', 'Invalid verification code');
    end if;

    if v_registration.verification_expires_at is null
      or v_registration.verification_expires_at <= pg_catalog.now() then
      update public.event_registrations
      set verification_code = null
      where id = p_registration_id;
      return pg_catalog.jsonb_build_object('error', 'Verification code expired');
    end if;

    if v_registration.verification_attempts >= 5 then
      return pg_catalog.jsonb_build_object('error', 'Too many verification attempts');
    end if;

    v_attempts := v_registration.verification_attempts + 1;
    update public.event_registrations
    set verification_attempts = v_attempts,
        verification_code = case when v_attempts >= 5 then null else verification_code end
    where id = p_registration_id;
    return pg_catalog.jsonb_build_object(
      'error',
      case when v_attempts >= 5
        then 'Too many verification attempts'
        else 'Invalid verification code'
      end
    );
  end if;

  if v_registration.is_verified then
    v_registration_status := v_registration.status;
  else
    if v_registration.verification_expires_at is null
      or v_registration.verification_expires_at <= pg_catalog.now() then
      update public.event_registrations
      set verification_code = null
      where id = p_registration_id;
      return pg_catalog.jsonb_build_object('error', 'Verification code expired');
    end if;

    if v_registration.verification_attempts >= 5 then
      return pg_catalog.jsonb_build_object('error', 'Too many verification attempts');
    end if;

    select count(*)::integer
    into v_confirmed_count
    from public.event_registrations
    where event_id = v_event_id
      and status = 'confirmed'
      and is_verified;

    v_registration_status := case
      when v_capacity is null or v_confirmed_count < v_capacity then 'confirmed'
      else 'waitlisted'
    end;

    update public.event_registrations
    set is_verified = true, status = v_registration_status
    where id = p_registration_id;
  end if;

  return pg_catalog.jsonb_build_object(
    'id', v_registration.id,
    'eventId', v_event_id,
    'eventTitle', v_event_title,
    'userEmail', v_registration.user_email,
    'fullName', v_registration.full_name,
    'status', v_registration_status
  );
end;
$$;

revoke all on function public.verify_event_registration(uuid, text) from public;
grant execute on function public.verify_event_registration(uuid, text) to service_role;
