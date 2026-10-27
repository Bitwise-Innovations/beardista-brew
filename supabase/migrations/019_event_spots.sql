-- How many confirmed spots each participant type has, for the public sign-up form.
-- Returns only counts, never names or emails.
create or replace function public.get_event_type_spots(p_event_id bigint)
returns table (participant_type_id bigint, confirmed integer)
language sql
stable
security definer
set search_path = ''
as $$
  select t.id, count(r.id)::integer
  from public.participant_types t
  join public.events e on e.id = t.event_id and e.status <> 'draft'
  left join public.event_registrations r
    on r.participant_type_id = t.id and r.status = 'confirmed'
  where t.event_id = p_event_id
  group by t.id;
$$;

revoke all on function public.get_event_type_spots(bigint) from public;
grant execute on function public.get_event_type_spots(bigint) to anon, authenticated;