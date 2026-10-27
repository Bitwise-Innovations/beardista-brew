-- Staff can rename themselves without being able to change their role or status.
create or replace function public.update_my_name(p_full_name text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then
    raise exception using errcode = '42501', message = 'Not signed in';
  end if;
  if length(trim(coalesce(p_full_name, ''))) = 0 or length(p_full_name) > 120 then
    raise exception using errcode = '22023', message = 'Name must be 1 to 120 characters';
  end if;

  update public.profiles
  set full_name = trim(p_full_name)
  where id = (select auth.uid()) and status = 'active';
end;
$$;

revoke all on function public.update_my_name(text) from public;
grant execute on function public.update_my_name(text) to authenticated;

-- When a new email is confirmed in Supabase Auth, copy it to profiles.
create or replace function public.sync_profile_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles set email = new.email where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_email_change on auth.users;
create trigger on_auth_email_change
  after update of email on auth.users
  for each row
  when (old.email is distinct from new.email)
  execute function public.sync_profile_email();