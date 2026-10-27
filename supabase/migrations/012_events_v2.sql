-- Events v2: statuses, dates, participant types, custom forms, answers.

-- 1. Status values: upcoming -> open, plus "closed" for registration closed.
alter table public.events drop constraint if exists events_status_check;

update public.events set status = 'open' where status = 'upcoming';

alter table public.events
  alter column status set default 'draft',
  add constraint events_status_check
    check (status in ('draft', 'open', 'closed', 'completed', 'cancelled'));

-- Keep is_active in sync with the new statuses.
create or replace function public.sync_event_active_status()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' or new.status is distinct from old.status then
    new.is_active := new.status in ('open', 'closed', 'completed');
  elsif new.is_active is distinct from old.is_active then
    new.status := case when new.is_active then 'open' else 'cancelled' end;
  end if;
  return new;
end;
$$;

-- 2. New event columns. Venue = location, cover = image_url,
--    times = start_time / end_time (date + time, Manila time).
alter table public.events
  add column if not exists event_date date,
  add column if not exists registration_opens_at date,
  add column if not exists registration_closes_at date;

update public.events
set event_date = (start_time at time zone 'Asia/Manila')::date
where event_date is null and start_time is not null;

alter table public.events
  drop constraint if exists events_registration_dates_check,
  add constraint events_registration_dates_check
    check (registration_closes_at is null or registration_opens_at is null
           or registration_closes_at >= registration_opens_at);

-- 3. Participant types (Competitor, Spectator/Guest, custom...), one capacity each.
create table if not exists public.participant_types (
  id bigint generated always as identity primary key,
  event_id bigint not null references public.events(id) on delete cascade,
  name text not null,
  capacity integer not null default 0 check (capacity >= 0),
  opens_at date,
  closes_at date,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint participant_types_dates_check
    check (closes_at is null or opens_at is null or closes_at >= opens_at)
);

create unique index if not exists participant_types_event_name_idx
  on public.participant_types (event_id, lower(name));

-- 4. Form questions, one list per participant type.
--    (Full name and email are always asked and live on the registration.)
create table if not exists public.form_questions (
  id bigint generated always as identity primary key,
  participant_type_id bigint not null references public.participant_types(id) on delete cascade,
  label text not null default '',
  type text not null default 'short_answer'
    check (type in ('short_answer', 'paragraph', 'multiple_choice', 'checkboxes',
                    'dropdown', 'date', 'email', 'phone')),
  required boolean not null default false,
  help_text text,
  options jsonb not null default '[]'::jsonb check (jsonb_typeof(options) = 'array'),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists form_questions_type_order_idx
  on public.form_questions (participant_type_id, sort_order);

-- 5. Link each registration to a participant type.
--    No ON DELETE rule: a type that still has registrations cannot be deleted,
--    but deleting a whole event still works (both cascade from events).
alter table public.event_registrations
  add column if not exists participant_type_id bigint references public.participant_types(id);

create index if not exists event_registrations_type_status_idx
  on public.event_registrations (participant_type_id, status);

-- 6. Answers. question_label keeps the wording even if the question is edited or deleted later.
create table if not exists public.registration_answers (
  id bigint generated always as identity primary key,
  registration_id uuid not null references public.event_registrations(id) on delete cascade,
  question_id bigint references public.form_questions(id) on delete set null,
  question_label text not null,
  value jsonb not null,
  created_at timestamptz not null default now()
);

create unique index if not exists registration_answers_unique_idx
  on public.registration_answers (registration_id, question_id)
  where question_id is not null;

-- 7. Existing events get one "Spectator/Guest" type; existing registrations move to it.
insert into public.participant_types (event_id, name, capacity, opens_at, closes_at)
select e.id, 'Spectator/Guest', coalesce(e.capacity, 50),
       e.registration_opens_at, e.registration_closes_at
from public.events e
where not exists (select 1 from public.participant_types t where t.event_id = e.id);

update public.event_registrations r
set participant_type_id = t.id
from public.participant_types t
where r.participant_type_id is null
  and t.event_id = r.event_id
  and t.name = 'Spectator/Guest';

-- 8. Security rules.
alter table public.participant_types enable row level security;
alter table public.form_questions enable row level security;
alter table public.registration_answers enable row level security;

-- Customers can read the types and questions of non-draft events (to show the form).
drop policy if exists "participant types public read" on public.participant_types;
create policy "participant types public read" on public.participant_types
  for select to anon, authenticated
  using (exists (select 1 from public.events e
                 where e.id = event_id and e.status <> 'draft'));

drop policy if exists "participant types staff all" on public.participant_types;
create policy "participant types staff all" on public.participant_types
  for all to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));

drop policy if exists "form questions public read" on public.form_questions;
create policy "form questions public read" on public.form_questions
  for select to anon, authenticated
  using (exists (select 1
                 from public.participant_types t
                 join public.events e on e.id = t.event_id
                 where t.id = participant_type_id and e.status <> 'draft'));

drop policy if exists "form questions staff all" on public.form_questions;
create policy "form questions staff all" on public.form_questions
  for all to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));

-- Answers hold personal data: staff only. Customers submit through the Edge Function.
drop policy if exists "registration answers staff all" on public.registration_answers;
create policy "registration answers staff all" on public.registration_answers
  for all to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));