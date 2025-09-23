
-- Profiles (user id, role)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  role text not null default 'user' check (role in ('user','subscriber','editor','admin')),
  created_at timestamp with time zone default now()
);
alter table profiles enable row level security;
create policy "public read profiles" on profiles for select using (true);
create policy "user manage own" on profiles for update using (auth.uid() = id);

-- Posts
create table if not exists posts (
  id bigint primary key generated always as identity,
  title text not null,
  slug text not null unique,
  body text,
  is_published boolean not null default false,
  created_at timestamp with time zone default now()
);
alter table posts enable row level security;
create policy "read published" on posts for select using (is_published = true);
create policy "admin edit posts" on posts for all using (exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','editor')));

-- Pages
create table if not exists pages (
  id bigint primary key generated always as identity,
  title text not null,
  slug text not null unique,
  body text,
  created_at timestamp with time zone default now()
);
alter table pages enable row level security;
create policy "read pages" on pages for select using (true);
create policy "admin edit pages" on pages for all using (exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','editor')));
