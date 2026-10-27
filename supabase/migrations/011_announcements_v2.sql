-- Fields for the "What's Brewing" cards on the landing page.

alter table public.announcements
  add column if not exists type text not null default 'notice',
  add column if not exists custom_label text,
  add column if not exists image_url text,
  add column if not exists button_label text,
  add column if not exists link_type text not null default 'none',
  add column if not exists link_target text,
  add column if not exists sort_order integer not null default 0;

alter table public.announcements
  drop constraint if exists announcements_type_check,
  add constraint announcements_type_check
    check (type in ('new_event', 'new_drink', 'must_try', 'notice', 'custom')),
  drop constraint if exists announcements_custom_label_check,
  add constraint announcements_custom_label_check
    check (type <> 'custom' or length(trim(coalesce(custom_label, ''))) > 0),
  drop constraint if exists announcements_body_length_check,
  add constraint announcements_body_length_check
    check (length(body) <= 140),
  drop constraint if exists announcements_link_type_check,
  add constraint announcements_link_type_check
    check (link_type in ('none', 'event', 'menu_item', 'url')),
  -- A button needs both a label and a target; "none" needs neither.
  drop constraint if exists announcements_link_check,
  add constraint announcements_link_check
    check (
      (link_type = 'none' and link_target is null and button_label is null)
      or (link_type <> 'none'
          and length(trim(coalesce(link_target, ''))) > 0
          and length(trim(coalesce(button_label, ''))) > 0)
    ),
  -- Same-day start and end is allowed.
  drop constraint if exists announcements_date_range_check,
  add constraint announcements_date_range_check
    check (end_date is null or start_date is null or end_date >= start_date);

create index if not exists announcements_sort_order_idx
  on public.announcements (sort_order);