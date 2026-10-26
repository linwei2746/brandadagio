#!/usr/bin/env bash
# ============================================================
#  brandadagio — デプロイ（サーバー上で実行）
#
#  実行: sudo bash /srv/brandadagio/app/deploy/deploy.sh
#
#  流れ:
#    app/   … git チェックアウト＋ビルド作業場
#    live/  … 実際に動いているスタンドアロン一式（app とは別物）
#
#  ビルド中に live/ を壊さないよう、ビルドが成功してから live/ へ同期する。
#  途中で失敗したら live/ は無傷のまま、サイトは動き続ける。
# ============================================================
set -euo pipefail

APP_USER="brandadagio"
APP_DIR="/srv/brandadagio/app"
LIVE_DIR="/srv/brandadagio/live"
ENV_FILE="/etc/brandadagio.env"
SERVICE="brandadagio"
BRANCH="${DEPLOY_BRANCH:-main}"

log() { printf "\n\033[1;36m==> %s\033[0m\n" "$*"; }

[[ $EUID -eq 0 ]] || { echo "root で実行してください" >&2; exit 1; }
[[ -f "$ENV_FILE" ]] || { echo "$ENV_FILE がありません。先に setup-server.sh を実行してください" >&2; exit 1; }

# shellcheck disable=SC1090
set -a; source "$ENV_FILE"; set +a

# ---------- 0. 所有者の確認 ----------
# root で git clone するとリポジトリが root 所有になり、
# アプリユーザーで動かす git / npm / build がすべて失敗する
# （git は "detected dubious ownership" で止まる）。
if [[ "$(stat -c %U "$APP_DIR/.git")" != "$APP_USER" ]]; then
  log "リポジトリの所有者を ${APP_USER} に修正"
  chown -R "${APP_USER}:${APP_USER}" "$APP_DIR"
fi

# ---------- 1. 最新コードを取得 ----------
log "コードを取得（${BRANCH}）"
cd "$APP_DIR"
sudo -u "$APP_USER" git fetch --prune origin
sudo -u "$APP_USER" git reset --hard "origin/${BRANCH}"
echo "HEAD: $(git log -1 --oneline)"

# ---------- 2. 依存関係 ----------
log "依存パッケージをインストール（npm ci）"
sudo -u "$APP_USER" npm ci --no-audit --no-fund

# ---------- 3. ビルド ----------
# ピーク 2GB 程度。4GB 未満のマシンでは swap を用意すること。
log "ビルド（1〜2 分かかります）"
sudo -u "$APP_USER" env NODE_ENV=production npm run build

# ---------- 4. DB マイグレーション ----------
# push モードは本番で無効化済み。スキーマ変更は必ずここを通る。
log "データベースマイグレーション"
sudo -u "$APP_USER" env NODE_ENV=production NODE_OPTIONS=--no-deprecation \
  DATABASE_URI="$DATABASE_URI" PAYLOAD_SECRET="$PAYLOAD_SECRET" \
  npx payload migrate

# ---------- 5. live/ へ反映 ----------
# standalone には .next/static と public が含まれないので手で入れる
log "成果物を live/ へ同期"
sudo -u "$APP_USER" cp -r "$APP_DIR/.next/static" "$APP_DIR/.next/standalone/.next/static"
sudo -u "$APP_USER" cp -r "$APP_DIR/public" "$APP_DIR/.next/standalone/public"
sudo -u "$APP_USER" rsync -a --delete "$APP_DIR/.next/standalone/" "$LIVE_DIR/"

# ---------- 6. 再起動 ----------
log "サービス再起動"
systemctl restart "$SERVICE"

# ---------- 7. ヘルスチェック ----------
log "ヘルスチェック"
for i in $(seq 1 30); do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "http://127.0.0.1:${PORT:-3000}/" || true)
  if [[ "$code" == "200" ]]; then
    echo "OK — HTTP 200（${i} 秒）"
    systemctl --no-pager --lines=5 status "$SERVICE" || true
    echo
    echo "デプロイ完了: ${NEXT_PUBLIC_SERVER_URL}"
    exit 0
  fi
  sleep 1
done

echo "起動確認に失敗しました。ログを確認してください:" >&2
echo "  journalctl -u ${SERVICE} -n 50 --no-pager" >&2
exit 1
