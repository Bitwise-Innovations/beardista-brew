-- Staff can see everything in the admin, including hidden rows.

drop policy if exists "menu items staff read all" on public.menu_items;
create policy "menu items staff read all" on public.menu_items
  for select to authenticated
  using ((select public.is_staff()));

drop policy if exists "menu categories staff read all" on public.categories;
create policy "menu categories staff read all" on public.categories
  for select to authenticated
  using ((select public.is_staff()));

drop policy if exists "announcements staff read all" on public.announcements;
create policy "announcements staff read all" on public.announcements
  for select to authenticated
  using ((select public.is_staff()));

-- Bucket for site images (story, team, announcements, event covers).
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "site images public read" on storage.objects;
create policy "site images public read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'site-images');

drop policy if exists "site images staff insert" on storage.objects;
create policy "site images staff insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'site-images' and (select public.is_staff()));

drop policy if exists "site images staff update" on storage.objects;
create policy "site images staff update" on storage.objects
  for update to authenticated
  using (bucket_id = 'site-images' and (select public.is_staff()))
  with check (bucket_id = 'site-images' and (select public.is_staff()));

drop policy if exists "site images staff delete" on storage.objects;
create policy "site images staff delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'site-images' and (select public.is_staff()));