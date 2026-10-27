create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  action text not null check (action in ('INSERT', 'UPDATE', 'DELETE')),
  table_name text not null,
  record_id text not null,
  changes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null check (type in ('info', 'warning', 'event', 'system')),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_created_at_idx
  on public.audit_logs (created_at desc);

create index if not exists notifications_user_created_at_idx
  on public.notifications (user_id, created_at desc);

create or replace function public.log_audit_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_old jsonb;
  v_new jsonb;
  v_record_id text;
  v_changes jsonb;
begin
  if tg_op = 'INSERT' then
    v_new := to_jsonb(new);
    v_record_id := coalesce(v_new ->> 'id', v_new ->> 'key', v_new ->> 'slug', v_new::text);
    v_changes := jsonb_build_object('new', v_new);
  elsif tg_op = 'UPDATE' then
    v_old := to_jsonb(old);
    v_new := to_jsonb(new);
    v_record_id := coalesce(v_new ->> 'id', v_new ->> 'key', v_new ->> 'slug', v_new::text);
    v_changes := jsonb_build_object('old', v_old, 'new', v_new);
  else
    v_old := to_jsonb(old);
    v_record_id := coalesce(v_old ->> 'id', v_old ->> 'key', v_old ->> 'slug', v_old::text);
    v_changes := jsonb_build_object('old', v_old);
  end if;

  insert into public.audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    changes
  )
  values (
    auth.uid(),
    tg_op,
    tg_table_name,
    v_record_id,
    v_changes
  );

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

do $$
declare
  v_table_name text;
begin
  foreach v_table_name in array array['categories', 'items', 'events', 'settings']
  loop
    if pg_catalog.to_regclass(pg_catalog.format('public.%I', v_table_name)) is not null then
      execute pg_catalog.format(
        'drop trigger if exists audit_%I on public.%I',
        v_table_name,
        v_table_name
      );
      execute pg_catalog.format(
        'create trigger audit_%I after insert or update or delete on public.%I '
        'for each row execute function public.log_audit_event()',
        v_table_name,
        v_table_name
      );
    end if;
  end loop;
end;
$$;

alter table public.audit_logs enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "active staff read audit logs" on public.audit_logs;
create policy "active staff read audit logs" on public.audit_logs
  for select to authenticated
  using ((select public.is_staff()));

drop policy if exists "active staff manage notifications" on public.notifications;
create policy "active staff manage notifications" on public.notifications
  for all to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));

grant select on public.audit_logs to authenticated;
grant select, insert, update, delete on public.notifications to authenticated;
