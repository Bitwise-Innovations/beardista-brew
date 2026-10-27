-- New fields used by the admin Menu Management page.

alter table public.menu_items
  add column if not exists flavor_profile text,
  add column if not exists temperatures text[] not null default '{}',
  add column if not exists calories integer,
  add column if not exists tags text[] not null default '{}',
  add column if not exists add_ons jsonb not null default '[]'::jsonb;

alter table public.menu_items
  drop constraint if exists menu_items_calories_check,
  add constraint menu_items_calories_check check (calories is null or calories >= 0),
  drop constraint if exists menu_items_price_check,
  add constraint menu_items_price_check check (price >= 0),
  drop constraint if exists menu_items_add_ons_check,
  add constraint menu_items_add_ons_check check (jsonb_typeof(add_ons) = 'array');

alter table public.categories
  add column if not exists slug text,
  add column if not exists description text,
  add column if not exists group_name text,
  add column if not exists color text not null default '#E58422',
  add column if not exists badge text,
  add column if not exists icon_url text,
  add column if not exists status text not null default 'active';

-- Fill slugs for categories that already exist (e.g. "Non-Coffee" -> "non-coffee").
update public.categories
set slug = trim(both '-' from regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g'))
where slug is null;

alter table public.categories
  alter column slug set not null,
  drop constraint if exists categories_slug_key,
  add constraint categories_slug_key unique (slug),
  drop constraint if exists categories_status_check,
  add constraint categories_status_check check (status in ('draft', 'active')),
  drop constraint if exists categories_color_check,
  add constraint categories_color_check check (color ~ '^#[0-9A-Fa-f]{6}$');

-- Customers only see categories that are shown AND not drafts.
drop policy if exists "menu categories public read" on public.categories;
create policy "menu categories public read" on public.categories
  for select to anon, authenticated
  using (is_active and status = 'active');