#!/usr/bin/env bash
# ============================================================
#  brandadagio — VPS 初期セットアップ（サーバー上で 1 回だけ実行）
#
#  対象: Ubuntu 24.04 LTS / 26.04 LTS（x86_64）
#  実行: sudo bash setup-server.sh
#
#  やること:
#    1. パッケージ更新・タイムゾーン
#    2. Node 22（NodeSource）
#    3. PostgreSQL 18（PGDG 公式リポジトリ）＋ DB とユーザー作成
#    4. Caddy（公式リポジトリ）
#    5. 実行用ユーザー・ディレクトリ作成
#    6. ファイアウォール（ufw）
#
#  ※ このスクリプトはアプリ本体をデプロイしません。deploy.sh が担当します。
# ============================================================
set -euo pipefail

APP_USER="brandadagio"
APP_HOME="/srv/brandadagio"
DATA_DIR="/var/lib/brandadagio"
DB_NAME="brandadagio"
DB_USER="brandadagio"

log() { printf "\n\033[1;36m==> %s\033[0m\n" "$*"; }

if [[ $EUID -ne 0 ]]; then
  echo "root で実行してください: sudo bash $0" >&2
  exit 1
fi

# ---------- 1. 基本 ----------
log "システム更新"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get upgrade -y -qq
apt-get install -y -qq curl ca-certificates gnupg lsb-release git rsync ufw ntpsec

log "タイムゾーンを Asia/Tokyo に"
timedatectl set-timezone Asia/Tokyo

# ---------- 2. Node 22 ----------
if ! command -v node >/dev/null || [[ "$(node -v | cut -d. -f1)" != "v22" ]]; then
  log "Node.js 22 をインストール（NodeSource）"
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y -qq nodejs
fi
echo "node $(node -v) / npm $(npm -v)"

# ---------- 3. PostgreSQL 18 ----------
if ! command -v psql >/dev/null; then
  log "PostgreSQL 18 をインストール（PGDG 公式）"
  install -d /usr/share/postgresql-common/pgdg
  curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc \
    -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc
  echo "deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] \
https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" \
    > /etc/apt/sources.list.d/pgdg.list
  apt-get update -qq
  apt-get install -y -qq postgresql-18
fi
systemctl enable --now postgresql
echo "postgres $(sudo -u postgres psql -tAc 'show server_version')"

log "データベースとロールを作成"
# パスワードは生成して後で /etc/brandadagio.env に書き込む
DB_PASS="$(openssl rand -hex 24)"
sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
DO \$\$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${DB_USER}') THEN
    CREATE ROLE ${DB_USER} LOGIN PASSWORD '${DB_PASS}';
  ELSE
    ALTER ROLE ${DB_USER} PASSWORD '${DB_PASS}';
  END IF;
END \$\$;
SQL
sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1 \
  || sudo -u postgres createdb -O "${DB_USER}" "${DB_NAME}"

# ---------- 4. Caddy ----------
if ! command -v caddy >/dev/null; then
  log "Caddy をインストール（公式リポジトリ）"
  curl -fsSL https://dl.cloudsmith.io/public/caddy/stable/gpg.key \
    | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -fsSL https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt \
    > /etc/apt/sources.list.d/caddy-stable.list
  apt-get update -qq
  apt-get install -y -qq caddy
fi

# Caddyfile の log ディレクティブが書き込む先。
# 無いと起動時に失敗する（caddy validate では検出できない）。
install -d -o caddy -g caddy -m 755 /var/log/caddy

# ---------- 5. ユーザーとディレクトリ ----------
log "実行ユーザーとディレクトリを作成"
id -u "${APP_USER}" >/dev/null 2>&1 || useradd --system --create-home --home-dir "${APP_HOME}" --shell /usr/sbin/nologin "${APP_USER}"
install -d -o "${APP_USER}" -g "${APP_USER}" "${APP_HOME}/app" "${APP_HOME}/live"
install -d -o "${APP_USER}" -g "${APP_USER}" "${DATA_DIR}/media" "${DATA_DIR}/backups"

# ---------- 6. 環境変数ファイル ----------
if [[ ! -f /etc/brandadagio.env ]]; then
  log "/etc/brandadagio.env を作成（この後、手で埋める項目があります）"
  cat > /etc/brandadagio.env <<ENV
# brandadagio 本番環境変数 — root のみ読み取り可
NODE_ENV=production
PORT=3000
HOSTNAME=127.0.0.1

# 公開 URL
NEXT_PUBLIC_SERVER_URL=https://brandadagio.com

# Payload のトークン署名鍵（自動生成済み）
PAYLOAD_SECRET=$(openssl rand -hex 32)

# データベース（このスクリプトが作成）
DATABASE_URI=postgres://${DB_USER}:${DB_PASS}@127.0.0.1:5432/${DB_NAME}

# アップロード画像の保存先（リリースディレクトリの外）
MEDIA_DIR=${DATA_DIR}/media

# ★必ず書き換える: Stripe（本番キー）
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# VPS ではローカルディスクに保存するため空のまま
BLOB_READ_WRITE_TOKEN=
ENV
  chmod 600 /etc/brandadagio.env
else
  echo "/etc/brandadagio.env は既に存在するので触りません"
fi

# ---------- 7. ファイアウォール ----------
log "ufw を設定（22 / 80 / 443 のみ開放）"
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
ufw status verbose

cat <<DONE

============================================================
 初期セットアップ完了

 次にやること:
   1. nano /etc/brandadagio.env
        - NEXT_PUBLIC_SERVER_URL を実際のドメインに
        - STRIPE_* を本番キーに
   2. deploy/brandadagio.service を /etc/systemd/system/ へ
   3. deploy/Caddyfile を /etc/caddy/Caddyfile へ（ドメインを書き換え）
   4. bash deploy/deploy.sh を実行

 詳細は document/VPS部署手册.md を参照。
============================================================
DONE
