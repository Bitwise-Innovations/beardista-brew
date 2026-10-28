-- Secure event registration: hashed codes, 10-minute expiry, resend limits,
-- lock after 5 wrong tries, per-participant-type capacity.

alter table public.event_registrations
  add column if not exists verification_code_hash text,
  add column if not exists resend_window_start timestamptz,
  add column if not exists resend_count integer not null default 0;

-- Old codes were stored as plain text. Clear them.
alter table public.event_registrations alter column verification_code drop not null;
update public.event_registrations set verification_code = null where verification_code is not null;

drop function if exists public.create_event_registration(bigint, text, text, text, text);
drop function if exists public.verify_event_registration(uuid, text);

-- Gives a registration a new code, enforcing 1 per minute and 5 per hour.
create or replace function public.issue_event_code(p_registration_id uuid, p_code_hash text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_sent_at timestamptz;
  v_window timestamptz;
  v_count integer;
begin
  select verification_sent_at, resend_window_start, resend_count
    into v_sent_at, v_window, v_count
  from public.event_registrations
  where id = p_registration_id
  for update;

  if v_sent_at > now() - interval '1 minute' then
    raise exception using errcode = '55000', message = 'Please wait a minute before requesting another code.';
  end if;
  if v_window > now() - interval '1 hour' and v_count >= 5 then
    raise exception using errcode = '55000', message = 'Too many codes requested. Please try again in an hour.';
  end if;

  update public.event_registrations
  set verification_code_hash = p_code_hash,
      verification_expires_at = now() + interval '10 minutes',
      verification_attempts = 0,
      verification_sent_at = now(),
      resend_count = case when resend_window_start > now() - interval '1 hour' then resend_count + 1 else 1 end,
      resend_window_start = case when resend_window_start > now() - interval '1 hour' then resend_window_start else now() end
  where id = p_registration_id;
end;
$$;

create or replace function public.create_event_registration(
  p_event_id bigint,
  p_participant_type_id bigint,
  p_user_email text,
  p_full_name text,
  p_answers jsonb,
  p_code_hash text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_event public.events%rowtype;
  v_type public.participant_types%rowtype;
  v_today date := (now() at time zone 'Asia/Manila')::date;
  v_email text := lower(trim(p_user_email));
  v_answers jsonb := coalesce(p_answers, '[]'::jsonb);
  v_existing public.event_registrations%rowtype;
  v_id uuid;
  v_missing text;
begin
  select * into v_event from public.events where id = p_event_id;
  if not found
     or v_event.status <> 'open'
     or (v_event.registration_opens_at is not null and v_today < v_event.registration_opens_at)
     or (v_event.registration_closes_at is not null and v_today > v_event.registration_closes_at) then
    raise exception using errcode = 'P0002', message = 'This event is not open for registration.';
  end if;

  select * into v_type
  from public.participant_types
  where id = p_participant_type_id and event_id = p_event_id;
  if not found
     or (v_type.opens_at is not null and v_today < v_type.opens_at)
     or (v_type.closes_at is not null and v_today > v_type.closes_at) then
    raise exception using errcode = 'P0002', message = 'This registration type is not open.';
  end if;

  -- Every required question must have a non-empty answer.
  select q.label into v_missing
  from public.form_questions q
  where q.participant_type_id = p_participant_type_id
    and q.required
    and not exists (
      select 1
      from jsonb_array_elements(v_answers) a
      where (a ->> 'questionId')::bigint = q.id
        and a -> 'value' is not null
        and a -> 'value' not in ('""'::jsonb, '[]'::jsonb, 'null'::jsonb)
    )
  limit 1;
  if v_missing is not null then
    raise exception using errcode = '22023', message = format('Please answer: %s', v_missing);
  end if;

  select * into v_existing
  from public.event_registrations
  where event_id = p_event_id and lower(user_email) = v_email and status <> 'cancelled'
  for update;

  if found then
    if v_existing.is_verified then
      raise exception using errcode = '23505', message = 'This email is already registered for this event.';
    end if;
    -- Not verified yet: update the existing sign-up instead of creating a second one.
    v_id := v_existing.id;
    update public.event_registrations
    set full_name = trim(p_full_name), participant_type_id = p_participant_type_id
    where id = v_id;
    delete from public.registration_answers where registration_id = v_id;
  else
    insert into public.event_registrations
      (event_id, participant_type_id, user_email, full_name, status, is_verified, verification_attempts)
    values
      (p_event_id, p_participant_type_id, v_email, trim(p_full_name), 'pending', false, 0)
    returning id into v_id;
  end if;

  insert into public.registration_answers (registration_id, question_id, question_label, value)
  select v_id, q.id, q.label, a -> 'value'
  from jsonb_array_elements(v_answers) a
  join public.form_questions q
    on q.id = (a ->> 'questionId')::bigint and q.participant_type_id = p_participant_type_id
  where a -> 'value' is not null;

  perform public.issue_event_code(v_id, p_code_hash);

  return jsonb_build_object(
    'id', v_id,
    'userEmail', v_email,
    'fullName', trim(p_full_name),
    'eventTitle', v_event.title,
    'typeName', v_type.name
  );
end;
$$;

create or replace function public.resend_event_code(p_registration_id uuid, p_code_hash text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  r public.event_registrations%rowtype;
  v_title text;
begin
  select * into r from public.event_registrations where id = p_registration_id;
  if not found or r.status = 'cancelled' then
    raise exception using errcode = 'P0002', message = 'Registration not found.';
  end if;
  if r.is_verified then
    raise exception using errcode = '23505', message = 'This registration is already verified.';
  end if;

  perform public.issue_event_code(p_registration_id, p_code_hash);
  select title into v_title from public.events where id = r.event_id;

  return jsonb_build_object('id', r.id, 'userEmail', r.user_email, 'fullName', r.full_name, 'eventTitle', v_title);
end;
$$;

create or replace function public.verify_event_registration(p_registration_id uuid, p_code_hash text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  r public.event_registrations%rowtype;
  v_title text;
  v_capacity integer;
  v_taken integer;
  v_status text;
begin
  select * into r from public.event_registrations where id = p_registration_id for update;
  if not found or r.status = 'cancelled' then
    raise exception using errcode = 'P0002', message = 'Registration not found.';
  end if;

  select title into v_title from public.events where id = r.event_id;

  if r.is_verified then
    return jsonb_build_object('id', r.id, 'status', r.status, 'userEmail', r.user_email,
      'fullName', r.full_name, 'eventTitle', v_title, 'alreadyVerified', true);
  end if;
  if r.verification_attempts >= 5 then
    return jsonb_build_object('error', 'Too many wrong tries. Request a new code.', 'locked', true);
  end if;
  if r.verification_code_hash is null or r.verification_expires_at < now() then
    return jsonb_build_object('error', 'This code has expired. Request a new one.', 'expired', true);
  end if;
  if r.verification_code_hash <> p_code_hash then
    -- Returned (not raised) so the attempt count is saved.
    update public.event_registrations
    set verification_attempts = verification_attempts + 1
    where id = r.id;
    return jsonb_build_object('error', 'Incorrect code.', 'attemptsLeft', greatest(0, 4 - r.verification_attempts));
  end if;

  -- Lock the type row so two people can't take the last spot at the same time.
  select capacity into v_capacity
  from public.participant_types
  where id = r.participant_type_id
  for update;

  select count(*) into v_taken
  from public.event_registrations
  where participant_type_id = r.participant_type_id and status = 'confirmed';

  v_status := case when v_capacity is null or v_taken < v_capacity then 'confirmed' else 'waitlisted' end;

  update public.event_registrations
  set is_verified = true,
      status = v_status,
      verification_code_hash = null,
      verification_expires_at = null
  where id = r.id;

  return jsonb_build_object('id', r.id, 'status', v_status, 'userEmail', r.user_email,
    'fullName', r.full_name, 'eventTitle', v_title);
end;
$$;

-- Only the Edge Function (service role) may call these.
revoke all on function public.issue_event_code(uuid, text) from public, anon, authenticated;
revoke all on function public.create_event_registration(bigint, bigint, text, text, jsonb, text) from public, anon, authenticated;
revoke all on function public.resend_event_code(uuid, text) from public, anon, authenticated;
revoke all on function public.verify_event_registration(uuid, text) from public, anon, authenticated;
grant execute on function public.issue_event_code(uuid, text) to service_role;
grant execute on function public.create_event_registration(bigint, bigint, text, text, jsonb, text) to service_role;
grant execute on function public.resend_event_code(uuid, text) to service_role;
grant execute on function public.verify_event_registration(uuid, text) to service_role;