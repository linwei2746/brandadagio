#!/usr/bin/env node
/**
 * ローカル開発用 PostgreSQL（ポータブル版）の管理スクリプト。
 *
 *   node scripts/pg.mjs setup    初期化 → 起動 → DB 作成（初回のみ）
 *   node scripts/pg.mjs start    起動
 *   node scripts/pg.mjs stop     停止
 *   node scripts/pg.mjs status   状態確認
 *   node scripts/pg.mjs psql     対話シェル
 *   node scripts/pg.mjs reset    DB を削除して作り直す（スキーマは次回 dev 起動時に再生成）
 *
 * バイナリの場所は環境変数 PG_HOME で変更できます（既定: D:/pgsql18）。
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import net from "node:net";

const PG_HOME = process.env.PG_HOME || "D:/pgsql18";
const BIN = path.join(PG_HOME, "pgsql", "bin");
const DATA = path.join(PG_HOME, "data");
const LOG = path.join(PG_HOME, "pg.log");
// 既存の PostgreSQL 15 サービスが 5432 を使っているため、既定は 5433
const PORT = process.env.PG_PORT || "5433";
const DBNAME = process.env.PG_DBNAME || "brandadagio";
const USER = "postgres";

function exe(name) {
  return path.join(BIN, process.platform === "win32" ? `${name}.exe` : name);
}

function run(name, args, opts = {}) {
  const bin = exe(name);
  if (!existsSync(bin)) {
    console.error(`❌ ${bin} が見つかりません。PG_HOME を確認してください（現在: ${PG_HOME}）`);
    process.exit(1);
  }
  const r = spawnSync(bin, args, { stdio: "inherit", env: { ...process.env, PGPORT: PORT }, ...opts });
  if (r.error) {
    console.error(`❌ ${name}: ${r.error.message}`);
    process.exit(1);
  }
  return r.status ?? 1;
}

function waitForPort(port, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve) => {
    const tryOnce = () => {
      const sock = net.connect({ host: "127.0.0.1", port: Number(port) });
      sock.once("connect", () => {
        sock.destroy();
        resolve(true);
      });
      sock.once("error", () => {
        sock.destroy();
        if (Date.now() > deadline) resolve(false);
        else setTimeout(tryOnce, 300);
      });
    };
    tryOnce();
  });
}

const isRunning = () =>
  spawnSync(exe("pg_ctl"), ["-D", DATA, "status"], { stdio: "ignore" }).status === 0;

const cmd = process.argv[2];

switch (cmd) {
  case "init": {
    if (existsSync(path.join(DATA, "PG_VERSION"))) {
      console.log("ℹ データディレクトリは初期化済みです:", DATA);
      break;
    }
    // ローカル専用（127.0.0.1 のみ待受）なので認証は trust
    run("initdb", ["-D", DATA, "-U", USER, "-A", "trust", "-E", "UTF8", "--locale=C"]);
    console.log("✔ 初期化しました:", DATA);
    break;
  }

  case "start": {
    if (isRunning()) {
      console.log("ℹ すでに起動しています（port", PORT + "）");
      break;
    }
    // stdio は必ず ignore。pipe/inherit にすると postgres 本体がハンドルを
    // 握ったままになり、このスクリプトが終了できなくなる（Windows）
    const st = spawnSync(exe("pg_ctl"), ["-D", DATA, "-l", LOG, "-o", `-p ${PORT}`, "start"], {
      stdio: "ignore",
    });
    if (st.status !== 0 || !(await waitForPort(PORT, 15000))) {
      console.error("❌ 起動に失敗しました。ログを確認してください:", LOG);
      process.exit(1);
    }
    console.log("✔ 起動しました — postgres://postgres@127.0.0.1:" + PORT + "/" + DBNAME);
    break;
  }

  case "stop": {
    if (!isRunning()) {
      console.log("ℹ 起動していません");
      break;
    }
    run("pg_ctl", ["-D", DATA, "-m", "fast", "-w", "stop"]);
    console.log("✔ 停止しました");
    break;
  }

  case "status":
    process.exit(run("pg_ctl", ["-D", DATA, "status"]));

  case "createdb": {
    const r = spawnSync(exe("createdb"), ["-h", "127.0.0.1", "-p", PORT, "-U", USER, DBNAME], {
      encoding: "utf8",
    });
    if (r.status === 0) console.log(`✔ データベース ${DBNAME} を作成しました`);
    else if ((r.stderr || "").includes("already exists"))
      console.log(`ℹ データベース ${DBNAME} は既に存在します`);
    else {
      console.error(r.stderr || r.stdout);
      process.exit(1);
    }
    break;
  }

  case "psql":
    process.exit(
      run("psql", [
        "-P",
        "pager=off",
        "-h",
        "127.0.0.1",
        "-p",
        PORT,
        "-U",
        USER,
        "-d",
        DBNAME,
        ...process.argv.slice(3),
      ])
    );

  case "reset": {
    if (!isRunning()) {
      console.error("❌ まず `npm run db:start` で起動してください");
      process.exit(1);
    }
    run("dropdb", ["-h", "127.0.0.1", "-p", PORT, "-U", USER, "--if-exists", DBNAME]);
    run("createdb", ["-h", "127.0.0.1", "-p", PORT, "-U", USER, DBNAME]);
    console.log(
      `✔ ${DBNAME} を作り直しました。\n  次に \`npm run dev\` で /admin を開くとスキーマが再生成されます。\n  その後 \`npm run db:sync\` で本番データを取り込めます。`
    );
    break;
  }

  case "setup": {
    const self = process.argv[1];
    for (const step of ["init", "start", "createdb"]) {
      const r = spawnSync(process.execPath, [self, step], { stdio: "inherit" });
      if (r.status !== 0) process.exit(r.status ?? 1);
    }
    console.log(
      "\n✔ セットアップ完了。\n  1) npm run dev → http://localhost:3000/admin を開く（スキーマ自動生成）\n  2) npm run db:sync → 本番データを取り込む"
    );
    break;
  }

  default:
    console.log(
      "usage: node scripts/pg.mjs <setup|init|start|stop|status|createdb|reset|psql>"
    );
    process.exit(1);
}
