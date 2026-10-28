-- Public survey submission: validated, size-limited, rate-limited.
-- Public Customer Voice: only name, rating, and quote of Live responses.

alter table public.survey_responses
  add column if not exists client_hash text;

create index if not exists survey_responses_client_idx
  on public.survey_responses (client_hash, created_at desc);

create or replace function public.submit_survey_response(p_answers jsonb)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_ip text;
  v_hash text;
  v_survey uuid;
  v_id uuid;
  v_rating text := p_answers ->> 'rating';
  v_frequency text := coalesce(p_answers ->> 'visitFrequency', '');
  v_age text := coalesce(p_answers ->> 'ageGroup', '');
  v_prefs jsonb := '[]'::jsonb;
begin
  if p_answers is null or jsonb_typeof(p_answers) <> 'object' then
    raise exception using errcode = '22023', message = 'Invalid survey answers.';
  end if;

  -- One-way hash of the caller's connection, used only for rate limiting.
  v_ip := coalesce(
    nullif(trim(split_part(current_setting('request.headers', true)::json ->> 'x-forwarded-for', ',', 1)), ''),
    'unknown'
  );
  v_hash := encode(extensions.digest(v_ip, 'sha256'), 'hex');

  if (
    select count(*) from public.survey_responses
    where client_hash = v_hash and created_at > now() - interval '10 minutes'
  ) >= 3 then
    raise exception using errcode = '55000', message = 'Thanks! You just sent feedback. Please try again in a few minutes.';
  end if;

  if v_rating is null or v_rating not in ('Very Poor', 'Poor', 'Average', 'Good', 'Excellent') then
    raise exception using errcode = '22023', message = 'Please choose a rating.';
  end if;
  if v_frequency not in ('', 'First-time visitor', 'Weekly regular', 'Monthly regular', 'Occasional') then
    v_frequency := '';
  end if;
  if v_age not in ('', 'Under 18', '18-24', '25-34', '35-44', '45-54', '55+') then
    v_age := '';
  end if;
  if jsonb_typeof(p_answers -> 'orderPreferences') = 'array' then
    select coalesce(jsonb_agg(value), '[]'::jsonb) into v_prefs
    from jsonb_array_elements_text(p_answers -> 'orderPreferences') as value
    where value in ('Coffee', 'Non-Coffee', 'Cocktails', 'Food');
  end if;

  select id into v_survey from public.surveys where is_active order by created_at desc limit 1;
  if v_survey is null then
    insert into public.surveys (title, questions) values ('Customer Survey', '[]'::jsonb)
    returning id into v_survey;
  end if;

  insert into public.survey_responses (survey_id, answers, client_hash)
  values (
    v_survey,
    jsonb_build_object(
      'name', left(trim(coalesce(p_answers ->> 'name', '')), 80),
      'ageGroup', v_age,
      'visitFrequency', v_frequency,
      'orderPreferences', v_prefs,
      'orderHighlight', left(trim(coalesce(p_answers ->> 'orderHighlight', '')), 200),
      'rating', v_rating,
      'notes', left(trim(coalesce(p_answers ->> 'notes', '')), 1000)
    ),
    v_hash
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.submit_survey_response(jsonb) from public;
grant execute on function public.submit_survey_response(jsonb) to anon, authenticated;

-- Replace the broad public read from 016 with a function that returns only safe fields.
drop policy if exists "survey responses public read featured" on public.survey_responses;

create or replace function public.get_customer_voice(p_limit integer default 6)
returns table (id uuid, author text, rating integer, quote text)
language sql
stable
security definer
set search_path = ''
as $$
  select
    r.id,
    coalesce(nullif(r.answers ->> 'name', ''), 'A happy customer'),
    case r.answers ->> 'rating'
      when 'Excellent' then 5 when 'Good' then 4 when 'Average' then 3
      when 'Poor' then 2 when 'Very Poor' then 1 else 5
    end,
    coalesce(nullif(r.answers ->> 'notes', ''), r.answers ->> 'orderHighlight')
  from public.survey_responses r
  where r.is_featured and not r.is_archived
    and coalesce(nullif(r.answers ->> 'notes', ''), nullif(r.answers ->> 'orderHighlight', '')) is not null
  order by r.created_at desc
  limit least(greatest(p_limit, 1), 12);
$$;

revoke all on function public.get_customer_voice(integer) from public;
grant execute on function public.get_customer_voice(integer) to anon, authenticated;