-- Audit logs: written automatically by triggers, read-only for staff.

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete set null,
  user_name text not null default 'System',
  action_type text not null check (action_type in ('create', 'update', 'delete', 'security')),
  table_name text not null,
  record_id text,
  item_label text,
  old_data jsonb,
  new_data jsonb
);

create index if not exists audit_logs_created_idx on public.audit_logs (created_at desc);
create index if not exists audit_logs_type_idx on public.audit_logs (action_type, created_at desc);

alter table public.audit_logs enable row level security;

-- Staff can read. No insert/update/delete policies, so logs can't be changed from the app.
drop policy if exists "audit logs staff read" on public.audit_logs;
create policy "audit logs staff read" on public.audit_logs
  for select to authenticated
  using ((select public.is_staff()));

create or replace function public.write_audit_log()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  -- Fields that are never logged: noise or secrets.
  v_ignored text[] := array[
    'view_count', 'created_at', 'updated_at',
    'verification_code', 'verification_code_hash', 'verification_attempts',
    'verification_expires_at', 'verification_sent_at'
  ];
  v_old jsonb := case when tg_op <> 'INSERT' then to_jsonb(old) else null end;
  v_new jsonb := case when tg_op <> 'DELETE' then to_jsonb(new) else null end;
  v_row jsonb := coalesce(v_new, v_old);
  v_old_diff jsonb := '{}'::jsonb;
  v_new_diff jsonb := '{}'::jsonb;
  v_key text;
  v_user_name text;
  v_action text;
begin
  if tg_op = 'UPDATE' then
    for v_key in select jsonb_object_keys(v_new) loop
      if not (v_key = any(v_ignored))
         and (v_old -> v_key) is distinct from (v_new -> v_key) then
        v_old_diff := v_old_diff || jsonb_build_object(v_key, v_old -> v_key);
        v_new_diff := v_new_diff || jsonb_build_object(v_key, v_new -> v_key);
      end if;
    end loop;

    -- Nothing worth logging changed (e.g. only view_count went up).
    if v_new_diff = '{}'::jsonb then
      return new;
    end if;
  else
    v_old_diff := v_old - v_ignored;
    v_new_diff := v_new - v_ignored;
  end if;

  v_action := case
    when tg_table_name = 'profiles' then 'security'
    when tg_op = 'INSERT' then 'create'
    when tg_op = 'UPDATE' then 'update'
    else 'delete'
  end;

  select full_name into v_user_name
  from public.profiles
  where id = (select auth.uid());

  insert into public.audit_logs
    (user_id, user_name, action_type, table_name, record_id, item_label, old_data, new_data)
  values (
    (select auth.uid()),
    coalesce(v_user_name, 'System'),
    v_action,
    tg_table_name,
    v_row ->> 'id',
    coalesce(v_row ->> 'name', v_row ->> 'title', v_row ->> 'full_name',
             v_row ->> 'key', v_row ->> 'label', v_row ->> 'id'),
    case when tg_op = 'INSERT' then null else v_old_diff end,
    case when tg_op = 'DELETE' then null else v_new_diff end
  );

  return coalesce(new, old);
end;
$$;

revoke all on function public.write_audit_log() from public;

-- Watch the tables staff change from the admin.
do $$
declare
  t text;
begin
  foreach t in array array[
    'menu_items', 'categories', 'announcements', 'barista_team', 'faqs',
    'store_settings', 'events', 'participant_types', 'form_questions',
    'surveys', 'profiles'
  ] loop
    execute format('drop trigger if exists audit_%1$s on public.%1$I', t);
    execute format(
      'create trigger audit_%1$s after insert or update or delete on public.%1$I
       for each row execute function public.write_audit_log()', t);
  end loop;
end;
$$;

-- Registrations and reviews: log staff changes only, not every new customer sign-up.
drop trigger if exists audit_event_registrations on public.event_registrations;
create trigger audit_event_registrations
  after update or delete on public.event_registrations
  for each row execute function public.write_audit_log();

drop trigger if exists audit_reviews on public.reviews;
create trigger audit_reviews
  after update or delete on public.reviews
  for each row execute function public.write_audit_log();