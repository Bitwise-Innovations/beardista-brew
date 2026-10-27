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
