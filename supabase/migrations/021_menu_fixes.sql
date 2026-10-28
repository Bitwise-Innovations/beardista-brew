-- Phase A: menu fixes.

-- 1. Customers see unavailable items (shown with an "Unavailable" label). Archived items stay hidden.
drop policy if exists "menu items public read" on public.menu_items;
create policy "menu items public read" on public.menu_items
  for select to anon, authenticated
  using (not is_archived);

-- 2. Calories are no longer used anywhere.
alter table public.menu_items drop constraint if exists menu_items_calories_check;
alter table public.menu_items drop column if exists calories;

-- 3. Category slug is generated from the name, and kept unique ("coffee", "coffee-2", ...).
create or replace function public.set_category_slug()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_base text;
  v_slug text;
  v_n integer := 1;
begin
  -- Keep an existing slug unless the name changed.
  if coalesce(new.slug, '') <> '' and (tg_op = 'INSERT' or new.name is not distinct from old.name) then
    return new;
  end if;

  v_base := coalesce(
    nullif(trim(both '-' from regexp_replace(lower(new.name), '[^a-z0-9]+', '-', 'g')), ''),
    'category'
  );
  v_slug := v_base;
  while exists (select 1 from public.categories where slug = v_slug and id is distinct from new.id) loop
    v_n := v_n + 1;
    v_slug := v_base || '-' || v_n;
  end loop;

  new.slug := v_slug;
  return new;
end;
$$;

drop trigger if exists categories_set_slug on public.categories;
create trigger categories_set_slug
  before insert or update of name, slug on public.categories
  for each row execute function public.set_category_slug();

-- 4. Category validation (also checked in the admin form).
update public.categories set name = trim(name) where name <> trim(name);

alter table public.categories
  drop constraint if exists categories_name_length_check,
  add constraint categories_name_length_check check (char_length(trim(name)) between 1 and 40),
  drop constraint if exists categories_description_length_check,
  add constraint categories_description_length_check check (description is null or char_length(description) <= 200);

create unique index if not exists categories_name_unique_idx
  on public.categories (lower(trim(name)));