-- ============================================================
--  MAISON RESERVE — Supabase スキーマ
--  Supabase の SQL Editor に貼り付けて実行してください。
--  （認証は Supabase Auth の auth.users を利用します）
-- ============================================================

-- 拡張
create extension if not exists "pgcrypto";

-- ---------- 商品（販売在庫） ----------
create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  brand        text,
  category     text,                       -- bag / jewelry / watch / accessory
  spec         text,                       -- 素材・金具など
  condition    text default 'excellent',   -- new / excellent / good / fair
  location     text,                       -- 在庫拠点（東京・香港…）
  price        numeric(12,2) not null,
  currency     text default 'JPY',
  images       jsonb default '[]'::jsonb,  -- 画像URLの配列
  status       text default 'available',   -- available / reserved / sold
  is_featured  boolean default false,
  attributes   jsonb default '{}'::jsonb,  -- 色・サイズなど可変属性
  created_at   timestamptz default now()
);

create index if not exists products_status_idx   on public.products (status);
create index if not exists products_category_idx on public.products (category);
create index if not exists products_featured_idx on public.products (is_featured);

-- ---------- 買取・委託の申込（査定リクエスト） ----------
create table if not exists public.sell_requests (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users (id) on delete set null,
  type         text not null default 'buyback', -- buyback（買取） / consignment（委託）
  name         text not null,
  email        text not null,
  phone        text,
  brand        text,
  item_name    text,
  condition    text,
  note         text,
  images       jsonb default '[]'::jsonb,
  -- 進行状態: uploaded → pending_appraisal → appraised → accepted → shipped → completed
  status       text default 'uploaded',
  appraised_price numeric(12,2),
  appraised_at    timestamptz,
  created_at   timestamptz default now()
);

create index if not exists sell_requests_status_idx on public.sell_requests (status);
create index if not exists sell_requests_user_idx   on public.sell_requests (user_id);

-- ---------- お問い合わせ / 商品リクエスト ----------
create table if not exists public.inquiries (
  id          uuid primary key default gen_random_uuid(),
  kind        text default 'contact', -- contact / product_request / membership
  name        text not null,
  email       text not null,
  phone       text,
  message     text,
  created_at  timestamptz default now()
);

-- ============================================================
--  Row Level Security（RLS）
-- ============================================================

alter table public.products      enable row level security;
alter table public.sell_requests enable row level security;
alter table public.inquiries     enable row level security;

-- 商品: 公開商品は誰でも閲覧可
drop policy if exists "products readable" on public.products;
create policy "products readable"
  on public.products for select
  using (status <> 'draft');

-- 査定申込: 誰でも作成可（未ログインの見込み客も申込可能）
drop policy if exists "sell_requests insert" on public.sell_requests;
create policy "sell_requests insert"
  on public.sell_requests for insert
  with check (true);

-- 査定申込: 本人のみ自分の申込を閲覧可
drop policy if exists "sell_requests own select" on public.sell_requests;
create policy "sell_requests own select"
  on public.sell_requests for select
  using (auth.uid() = user_id);

-- お問い合わせ: 誰でも作成可
drop policy if exists "inquiries insert" on public.inquiries;
create policy "inquiries insert"
  on public.inquiries for insert
  with check (true);

-- 注意: 管理・鑑定用の更新は service_role キー経由（RLSをバイパス）で行います。
