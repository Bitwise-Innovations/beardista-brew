-- Row Level Security: public reads, admins write

alter table categories enable row level security;
alter table items      enable row level security;
alter table events     enable row level security;
alter table reviews    enable row level security;
alter table faqs       enable row level security;
alter table settings   enable row level security;

-- Public read
drop policy if exists "read categories" on categories;
create policy "read categories" on categories for select using (true);

drop policy if exists "read items" on items;
create policy "read items" on items for select using (true);

drop policy if exists "read events" on events;
create policy "read events" on events for select using (is_active);

drop policy if exists "read faqs" on faqs;
create policy "read faqs" on faqs for select using (true);

drop policy if exists "read approved reviews" on reviews;
create policy "read approved reviews" on reviews for select
  to anon, authenticated using (status = 'approved');

drop policy if exists "read settings" on settings;
create policy "read settings" on settings for select using (true);

-- Visitors may submit reviews, but only as pending
drop policy if exists "submit review" on reviews;
create policy "submit review" on reviews for insert
  to anon, authenticated with check (status = 'pending');

-- Admins (logged-in users) write everything
drop policy if exists "admin all categories" on categories;
create policy "admin all categories" on categories for all to authenticated using (true) with check (true);

drop policy if exists "admin all items" on items;
create policy "admin all items" on items for all to authenticated using (true) with check (true);

drop policy if exists "admin all events" on events;
create policy "admin all events" on events for all to authenticated using (true) with check (true);

drop policy if exists "admin all reviews" on reviews;
create policy "admin all reviews" on reviews for all to authenticated using (true) with check (true);

drop policy if exists "admin all faqs" on faqs;
create policy "admin all faqs" on faqs for all to authenticated using (true) with check (true);

drop policy if exists "admin all settings" on settings;
create policy "admin all settings" on settings for all to authenticated using (true) with check (true);