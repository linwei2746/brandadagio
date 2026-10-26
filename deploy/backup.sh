#!/usr/bin/env bash
# ============================================================
#  brandadagio — バックアップ
#
#  単一 VPS 構成で最大のリスクは「この 1 台が壊れること」。
#  このスクリプトは毎日 DB と画像をローカルに保存し、
#  rclone が設定されていればオフサイト（S3 / B2 / Wasabi 等）へ送る。
#
#  cron 登録（毎日 3:30）:
#    sudo crontab -e
#    30 3 * * * /srv/brandadagio/app/deploy/backup.sh >> /var/log/brandadagio-backup.log 2>&1
# ============================================================
set -euo pipefail

ENV_FILE="/etc/brandadagio.env"
BACKUP_DIR="/var/lib/brandadagio/backups"
MEDIA_SRC="/var/lib/brandadagio/media"
KEEP_DAYS=14

# rclone のリモート名（未設定ならローカル保存のみ）
#   設定例: rclone config  →  リモート名 "offsite" を作る
RCLONE_REMOTE="${RCLONE_REMOTE:-}"

# shellcheck disable=SC1090
set -a; source "$ENV_FILE"; set +a

STAMP="$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "[$(date -Is)] バックアップ開始"

# ---------- 1. データベース ----------
DB_FILE="${BACKUP_DIR}/db-${STAMP}.sql.gz"
pg_dump --no-owner --no-privileges "$DATABASE_URI" | gzip -9 > "$DB_FILE"
echo "  DB   : $(du -h "$DB_FILE" | cut -f1)  ${DB_FILE}"

# ---------- 2. アップロード画像 ----------
# 毎回フルで固めると重いので、ローカルはミラー、オフサイトへは差分同期
MEDIA_MIRROR="${BACKUP_DIR}/media"
mkdir -p "$MEDIA_MIRROR"
rsync -a --delete "${MEDIA_SRC}/" "${MEDIA_MIRROR}/"
echo "  画像 : $(du -sh "$MEDIA_MIRROR" | cut -f1)"

# ---------- 3. 古い DB ダンプを削除 ----------
find "$BACKUP_DIR" -name 'db-*.sql.gz' -mtime "+${KEEP_DAYS}" -delete
echo "  保持 : $(find "$BACKUP_DIR" -name 'db-*.sql.gz' | wc -l) 世代"

# ---------- 4. オフサイトへ ----------
if [[ -n "$RCLONE_REMOTE" ]] && command -v rclone >/dev/null; then
  rclone sync "$BACKUP_DIR" "${RCLONE_REMOTE}:brandadagio-backup" \
    --transfers 4 --checksum --stats-one-line
  echo "  転送 : ${RCLONE_REMOTE}:brandadagio-backup へ同期完了"
else
  echo "  ⚠ オフサイト転送なし（RCLONE_REMOTE 未設定）"
  echo "    このままだと VPS が壊れた時にバックアップごと失います。"
fi

echo "[$(date -Is)] 完了"

# ============================================================
#  復元手順（覚え書き）
#
#  DB:
#    gunzip -c db-YYYYmmdd-HHMMSS.sql.gz | psql "$DATABASE_URI"
#
#  画像:
#    rsync -a /var/lib/brandadagio/backups/media/ /var/lib/brandadagio/media/
#
#  まるごと作り直す場合:
#    setup-server.sh → 上の 2 つを復元 → deploy.sh
# ============================================================
