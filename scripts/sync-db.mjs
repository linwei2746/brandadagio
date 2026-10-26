#!/usr/bin/env node
/**
 * 本番（Neon）のデータをローカル DB にコピーする。
 *
 *   node scripts/sync-db.mjs            REMOTE_DATABASE_URI → DATABASE_URI
 *   node scripts/sync-db.mjs --wipe     コピー前にローカルの全行を削除
 *
 * 前提: ローカル側は Payload がスキーマを作成済みであること
 *       （DATABASE_URI をローカルに向けて一度 `npm run dev` で /admin を開く）
 *
 * 書き込み先は必ず DATABASE_URI 側。本番には一切書き込みません。
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import pg from "pg";

const { Client } = pg;

// .env.local を読む（Next.js の外で動かすため自前で読み込む）。
// サーバー上では存在しないので、その場合は既存の環境変数をそのまま使う。
function loadEnv(file) {
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!m) continue;
    const [, k, v] = m;
    // 既に環境変数が設定されていればそちらを優先（本番の EnvironmentFile 等）
    if (process.env[k] === undefined) process.env[k] = v.replace(/^["']|["']$/g, "");
  }
}
loadEnv(fileURLToPath(new URL("../.env.local", import.meta.url)));

const SRC = process.env.REMOTE_DATABASE_URI;
const DST = process.env.DATABASE_URI;
const WIPE = process.argv.includes("--wipe");

if (!SRC || !DST) {
  console.error("❌ .env.local に REMOTE_DATABASE_URI と DATABASE_URI の両方が必要です");
  process.exit(1);
}
if (/neon\.tech|amazonaws|supabase/.test(DST)) {
  console.error("❌ DATABASE_URI がリモートを指しています。事故防止のため中止しました。");
  process.exit(1);
}

const mask = (u) => u.replace(/(\/\/[^:]+:)[^@]+@/, "$1***@");
console.log("  from :", mask(SRC));
console.log("  to   :", mask(DST), "\n");

// FK 依存を解決してコピー順を決める（トポロジカルソート）
async function tableOrder(c) {
  const { rows: tables } = await c.query(`
    select table_name from information_schema.tables
    where table_schema = current_schema() and table_type = 'BASE TABLE'`);
  const names = tables.map((r) => r.table_name);
  const { rows: fks } = await c.query(`
    select tc.table_name as child, ccu.table_name as parent
    from information_schema.table_constraints tc
    join information_schema.constraint_column_usage ccu
      on tc.constraint_name = ccu.constraint_name
    where tc.constraint_type = 'FOREIGN KEY' and tc.table_schema = current_schema()`);
  const deps = new Map(names.map((n) => [n, new Set()]));
  for (const { child, parent } of fks)
    if (child !== parent && deps.has(child)) deps.get(child).add(parent);

  const out = [];
  const seen = new Set();
  const visit = (n, stack = new Set()) => {
    if (seen.has(n) || stack.has(n)) return;
    stack.add(n);
    for (const p of deps.get(n) || []) visit(p, stack);
    stack.delete(n);
    seen.add(n);
    out.push(n);
  };
  names.forEach((n) => visit(n));
  return out;
}

const src = new Client({ connectionString: SRC });
const dst = new Client({ connectionString: DST });
await src.connect();
await dst.connect();

const order = await tableOrder(src);
const dstTables = new Set(
  (
    await dst.query(`select table_name from information_schema.tables
      where table_schema = current_schema() and table_type='BASE TABLE'`)
  ).rows.map((r) => r.table_name)
);

const missing = order.filter((t) => !dstTables.has(t));
if (missing.length) {
  console.error(
    `❌ ローカルに未作成のテーブルがあります: ${missing.join(", ")}\n` +
      "   先に `npm run dev` で http://localhost:3000/admin を開いてスキーマを生成してください。"
  );
  process.exit(1);
}

if (WIPE) {
  for (const t of [...order].reverse()) await dst.query(`delete from "${t}"`);
  console.log("🧹 ローカルの既存データを削除しました\n");
}

let total = 0;
for (const t of order) {
  const { rows } = await src.query(`select * from "${t}"`);
  if (rows.length === 0) continue;
  const cols = Object.keys(rows[0]);
  const collist = cols.map((c) => `"${c}"`).join(",");
  const ph = cols.map((_, i) => `$${i + 1}`).join(",");
  let inserted = 0;
  for (const r of rows) {
    try {
      await dst.query(
        `insert into "${t}" (${collist}) values (${ph}) on conflict do nothing`,
        cols.map((c) => r[c])
      );
      inserted++;
    } catch (e) {
      console.error(`  ⚠ ${t}: ${e.message}`);
    }
  }
  total += inserted;
  console.log(`  ${t}: ${inserted}/${rows.length} 行`);
}

// シーケンス（id 採番）を最大値に合わせる
const { rows: seqs } = await dst.query(`
  select c.relname as seq, t.relname as tbl, a.attname as col
  from pg_class c
  join pg_depend d on d.objid = c.oid
  join pg_class t on d.refobjid = t.oid
  join pg_attribute a on a.attrelid = t.oid and a.attnum = d.refobjsubid
  where c.relkind = 'S'`);
for (const s of seqs) {
  try {
    await dst.query(
      `select setval('"${s.seq}"', coalesce((select max("${s.col}") from "${s.tbl}"), 1))`
    );
  } catch (e) {
    console.error(`  ⚠ ${s.seq}: ${e.message}`);
  }
}

console.log(`\n✔ 完了：${total} 行をコピー、${seqs.length} 件のシーケンスを調整`);
await src.end();
await dst.end();
