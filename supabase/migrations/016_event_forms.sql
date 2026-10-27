create table if not exists public.participant_types (
  id uuid primary key default gen_random_uuid(),
  event_id bigint not null references public.events(id) on delete cascade,
  name text not null,
  capacity integer not null,
  opens_at timestamptz,
  closes_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.form_questions (
  id uuid primary key default gen_random_uuid(),
  participant_type_id uuid not null references public.participant_types(id) on delete cascade,
  label text not null,
  type text not null,
  required boolean default false,
  help_text text,
  options jsonb,
  sort_order integer default 0
);

create table if not exists public.registration_answers (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.event_registrations(id) on delete cascade,
  question_id uuid not null references public.form_questions(id) on delete cascade,
  answer text
);

alter table public.event_registrations
  add column if not exists participant_type_id uuid
    references public.participant_types(id);

alter table public.participant_types enable row level security;
alter table public.form_questions enable row level security;
alter table public.registration_answers enable row level security;

drop policy if exists "read open event participant types" on public.participant_types;
create policy "read open event participant types" on public.participant_types
  for select to anon, authenticated
  using (
    exists (
      select 1
      from public.events
      where events.id = participant_types.event_id
        and events.status = 'upcoming'
    )
  );

drop policy if exists "read open event form questions" on public.form_questions;
create policy "read open event form questions" on public.form_questions
  for select to anon, authenticated
  using (
    exists (
      select 1
      from public.participant_types
      join public.events on events.id = participant_types.event_id
      where participant_types.id = form_questions.participant_type_id
        and events.status = 'upcoming'
    )
  );

drop policy if exists "manage participant types as admin" on public.participant_types;
create policy "manage participant types as admin" on public.participant_types
  for all to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role in ('owner', 'admin')
    )
  )
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role in ('owner', 'admin')
    )
  );

drop policy if exists "manage form questions as admin" on public.form_questions;
create policy "manage form questions as admin" on public.form_questions
  for all to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role in ('owner', 'admin')
    )
  )
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role in ('owner', 'admin')
    )
  );

drop policy if exists "manage registration answers as admin" on public.registration_answers;
create policy "manage registration answers as admin" on public.registration_answers
  for all to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role in ('owner', 'admin')
    )
  )
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role in ('owner', 'admin')
    )
  );

alter table public.event_registrations
  add column if not exists user_id uuid;

alter table public.event_registrations
  drop constraint if exists event_registrations_status_check;

alter table public.event_registrations
  add constraint event_registrations_status_check
    check (status in ('pending', 'registered', 'confirmed', 'waitlisted', 'cancelled'));

create or replace function public.create_event_registration(
  p_event_id bigint,
  p_user_id uuid,
  p_participant_type_id uuid,
  p_answers jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_capacity integer;
  v_registration_count integer;
  v_status text;
  v_user_email text;
  v_full_name text;
  v_registration public.event_registrations%rowtype;
  v_answer jsonb;
begin
  select participant_types.capacity
  into v_capacity
  from public.participant_types
  where participant_types.id = p_participant_type_id
    and participant_types.event_id = p_event_id
  for update;

  if not found then
    raise exception using errcode = 'P0002', message = 'Participant type not found for event';
  end if;

  select profiles.email, profiles.full_name
  into v_user_email, v_full_name
  from public.profiles
  where profiles.id = p_user_id;

  if not found or v_user_email is null or v_full_name is null then
    raise exception using errcode = 'P0002', message = 'User profile with email and full name not found';
  end if;

  select count(*)::integer
  into v_registration_count
  from public.event_registrations
  where event_registrations.participant_type_id = p_participant_type_id
    and event_registrations.status <> 'cancelled';

  v_status := case
    when v_registration_count >= v_capacity then 'waitlisted'
    else 'registered'
  end;

  insert into public.event_registrations (
    event_id,
    user_id,
    participant_type_id,
    user_email,
    full_name,
    status
  )
  values (
    p_event_id,
    p_user_id,
    p_participant_type_id,
    v_user_email,
    v_full_name,
    v_status
  )
  returning * into v_registration;

  for v_answer in
    select value
    from jsonb_array_elements(p_answers) as answers(value)
  loop
    insert into public.registration_answers (
      registration_id,
      question_id,
      answer
    )
    values (
      v_registration.id,
      (v_answer ->> 'question_id')::uuid,
      v_answer ->> 'answer'
    );
  end loop;

  return to_jsonb(v_registration);
end;
$$;

revoke all on function public.create_event_registration(bigint, uuid, uuid, jsonb) from public;
grant execute on function public.create_event_registration(bigint, uuid, uuid, jsonb) to service_role;
