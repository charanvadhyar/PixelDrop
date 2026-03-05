-- PixelDrop Database Schema
-- Run this in your Supabase project → SQL Editor

-- ─── TABLES ──────────────────────────────────────────────────────────────────

create table public.profiles (
  id uuid references auth.users primary key,
  username text unique not null,
  coins integer default 200,
  created_at timestamptz default now()
);

create table public.listings (
  id serial primary key,
  title text not null,
  description text not null,
  type text not null,         -- 'IMAGE' | 'DOC' | 'PDF'
  category text not null,
  price integer not null,
  emoji text not null,
  content_url text,           -- DALL-E image URL
  content_text text,          -- GPT-4o doc/pdf content
  creator_id uuid references profiles(id),
  creator_username text not null,
  sales integer default 0,
  created_at timestamptz default now()
);

create table public.transactions (
  id serial primary key,
  buyer_id uuid references profiles(id),
  listing_id integer references listings(id),
  amount integer not null,
  created_at timestamptz default now()
);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────

alter table profiles    enable row level security;
alter table listings    enable row level security;
alter table transactions enable row level security;

-- Profiles: anyone can read, owner can insert/update
create policy "profiles_read"   on profiles for select using (true);
create policy "profiles_insert" on profiles for insert with check (auth.uid() = id);
create policy "profiles_update" on profiles for update using (auth.uid() = id);

-- Listings: anyone can read, authenticated users can insert, creator can update
create policy "listings_read"   on listings for select using (true);
create policy "listings_insert" on listings for insert with check (auth.role() = 'authenticated');
create policy "listings_update" on listings for update using (creator_id = auth.uid());

-- Transactions: buyer can insert and read their own
create policy "tx_insert" on transactions for insert with check (auth.uid() = buyer_id);
create policy "tx_read"   on transactions for select using (auth.uid() = buyer_id);

-- ─── PURCHASE FUNCTION (atomic) ───────────────────────────────────────────────

create or replace function purchase_listing(listing_id int, buyer_id uuid, amount int)
returns void language plpgsql security definer as $$
declare
  seller_id uuid;
begin
  -- Check buyer has enough coins
  if (select coins from profiles where id = buyer_id) < amount then
    raise exception 'insufficient_coins';
  end if;

  -- Deduct coins from buyer
  update profiles set coins = coins - amount where id = buyer_id;

  -- Credit coins to seller (if listing has a creator)
  select creator_id into seller_id from listings where id = listing_id;
  if seller_id is not null then
    update profiles set coins = coins + amount where id = seller_id;
  end if;

  -- Increment listing sales count
  update listings set sales = sales + 1 where id = listing_id;

  -- Record the transaction
  insert into transactions (buyer_id, listing_id, amount) values (buyer_id, listing_id, amount);
end;
$$;

-- ─── SEED DATA ────────────────────────────────────────────────────────────────

insert into listings (title, description, type, category, price, emoji, creator_username, sales) values
  ('Neon City Skyline', 'AI-generated cyberpunk cityscape at dusk with vivid neon reflections on rain-slicked streets.', 'IMAGE', 'Art', 120, '🌆', 'nova_art', 8),
  ('Startup Pitch Deck', '20-slide investor-ready pitch template with financial model slides and storytelling arc.', 'DOC', 'Business', 250, '📊', 'biz_wizard', 3),
  ('Fantasy World Map Pack', 'Five hand-drawn style world maps generated with AI — perfect for games or novels.', 'IMAGE', 'Art', 80, '🗺️', 'map_maker', 15),
  ('Cold Email Templates', '50 proven cold email templates sorted by industry. Includes subject line formulas.', 'PDF', 'Marketing', 190, '📧', 'closer_king', 22),
  ('Midnight Abstract Series', 'Deep space abstract art generated with DALL·E 3. 8 unique high-res compositions.', 'IMAGE', 'Art', 150, '🎨', 'nova_art', 6),
  ('Brand Identity Guide', 'Full brand manual template — color palettes, typography rules, logo usage guidelines.', 'PDF', 'Design', 300, '✦', 'design_pro', 11),
  ('LinkedIn Bio Pack', '12 AI-written LinkedIn bios for different industries — copy, paste, get hired.', 'DOC', 'Marketing', 95, '💼', 'closer_king', 18),
  ('UI Component Library', 'Figma-style documentation for 40+ UI components with design tokens and specs.', 'PDF', 'Design', 220, '🧩', 'design_pro', 7);
