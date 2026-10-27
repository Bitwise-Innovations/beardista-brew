-- Archive hides an item from customers and the admin list without deleting it.
alter table public.menu_items
  add column if not exists is_archived boolean not null default false;

drop policy if exists "menu items public read" on public.menu_items;
create policy "menu items public read" on public.menu_items
  for select to anon, authenticated
  using (is_available and not is_archived);