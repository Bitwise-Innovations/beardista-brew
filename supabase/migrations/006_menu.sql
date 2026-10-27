alter table public.categories
  add column if not exists is_active boolean not null default true,
  add column if not exists created_at timestamptz not null default now();

create table if not exists public.menu_items (
  id bigint generated always as identity primary key,
  category_id bigint references public.categories(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10, 2) not null,
  image_url text,
  is_available boolean not null default true,
  is_favorite boolean not null default false,
  view_count integer not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists menu_items_category_available_idx
  on public.menu_items (category_id, is_available);

alter table public.categories enable row level security;
alter table public.menu_items enable row level security;

drop policy if exists "read categories" on public.categories;
drop policy if exists "menu categories public read" on public.categories;
create policy "menu categories public read" on public.categories
  for select to anon, authenticated
  using (is_active);

drop policy if exists "menu categories staff insert" on public.categories;
create policy "menu categories staff insert" on public.categories
  for insert to authenticated
  with check ((select public.is_staff()));

drop policy if exists "menu categories staff update" on public.categories;
create policy "menu categories staff update" on public.categories
  for update to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));

drop policy if exists "menu categories staff delete" on public.categories;
create policy "menu categories staff delete" on public.categories
  for delete to authenticated
  using ((select public.is_staff()));

drop policy if exists "menu items public read" on public.menu_items;
create policy "menu items public read" on public.menu_items
  for select to anon, authenticated
  using (is_available);

drop policy if exists "menu items staff insert" on public.menu_items;
create policy "menu items staff insert" on public.menu_items
  for insert to authenticated
  with check ((select public.is_staff()));

drop policy if exists "menu items staff update" on public.menu_items;
create policy "menu items staff update" on public.menu_items
  for update to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));

drop policy if exists "menu items staff delete" on public.menu_items;
create policy "menu items staff delete" on public.menu_items
  for delete to authenticated
  using ((select public.is_staff()));

create or replace function public.increment_menu_item_view_count(p_item_id bigint)
returns integer
language sql
security definer
set search_path = ''
as $$
  update public.menu_items
  set view_count = coalesce(view_count, 0) + 1
  where id = p_item_id and is_available
  returning view_count;
$$;

revoke all on function public.increment_menu_item_view_count(bigint) from public;
grant execute on function public.increment_menu_item_view_count(bigint) to anon, authenticated;

create or replace function public.reorder_categories(category_orders jsonb)
returns void
language plpgsql
set search_path = ''
as $$
begin
  if not (select public.is_staff()) then
    raise exception using errcode = '42501', message = 'Active staff access required';
  end if;

  update public.categories as category
  set sort_order = (entry.value ->> 'sort_order')::integer
  from jsonb_array_elements(category_orders) as entry(value)
  where category.id = (entry.value ->> 'id')::bigint;
end;
$$;

revoke all on function public.reorder_categories(jsonb) from public;
grant execute on function public.reorder_categories(jsonb) to authenticated;

insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "menu images public read" on storage.objects;
create policy "menu images public read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'menu-images');

drop policy if exists "menu images staff insert" on storage.objects;
create policy "menu images staff insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'menu-images'
    and (select public.is_staff())
  );

drop policy if exists "menu images staff update" on storage.objects;
create policy "menu images staff update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'menu-images'
    and (select public.is_staff())
  )
  with check (
    bucket_id = 'menu-images'
    and (select public.is_staff())
  );

drop policy if exists "menu images staff delete" on storage.objects;
create policy "menu images staff delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'menu-images'
    and (select public.is_staff())
  );
