-- Tables and unique constraints for Beardista Brew

create table if not exists categories (
  id bigint generated always as identity primary key,
  name text not null,
  sort_order int default 0,
  constraint categories_name_key unique (name)
);

create table if not exists items (
  id bigint generated always as identity primary key,
  slug text unique,
  category_id bigint references categories(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10,2) not null,
  image_url text,
  flavor_profile text[] default '{}',
  contains text,
  details jsonb default '{}',
  is_available boolean default true,
  is_featured boolean default false,
  sort_order int default 0,
  constraint items_category_name_key unique (category_id, name)
);

create table if not exists events (
  id bigint generated always as identity primary key,
  tag text,
  title text not null,
  description text,
  button_label text,
  image_url text,
  details jsonb default '{}',
  is_active boolean default true
);

create table if not exists reviews (
  id bigint generated always as identity primary key,
  quote text not null,
  author text not null,
  rating int check (rating between 1 and 5),
  status text default 'pending' check (status in ('pending','approved','spam')),
  created_at timestamptz default now()
);

create table if not exists faqs (
  id bigint generated always as identity primary key,
  question text not null,
  answer text not null,
  sort_order int default 0
);

create table if not exists settings (
  key text primary key,
  value text
);

create index if not exists items_category_available_idx on items (category_id, is_available);