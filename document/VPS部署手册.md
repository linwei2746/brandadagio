# VPS 部署手册

单台 VPS 上跑三个东西：**Node（Next.js + Payload）、PostgreSQL 18、Caddy**。
HTTPS 证书由 Caddy 自动申请续期，不需要手动管。

部署用的文件都在 [`deploy/`](../deploy) 目录：

| 文件 | 作用 |
|---|---|
| `setup-server.sh` | 服务器初始化，只跑一次 |
| `brandadagio.service` | systemd 服务定义 |
| `Caddyfile` | 反向代理 + HTTPS |
| `deploy.sh` | 每次部署跑这个 |
| `backup.sh` | 每日备份（cron） |

---

## 目录结构（服务器上）

```
/srv/brandadagio/
├── app/      ← git 检出 + node_modules + 构建工作区
└── live/     ← 实际运行的 standalone 产物（与 app 分离）

/var/lib/brandadagio/
├── media/    ← 上传的图片（部署不会动它）
└── backups/  ← 本地备份

/etc/brandadagio.env    ← 所有密钥（root 600，不进 git）
```

**为什么 `app` 和 `live`分开**：构建会重写 `.next`，如果运行中的服务直接从那里读文件，构建到一半的瞬间会 500。构建成功后才同步到 `live` 再重启，失败的话 `live` 原封不动，网站继续正常跑。

---

## 第一次部署

### 0. 先把代码推上去（在你的 Windows 上）

本次会话的改动还没提交。`deploy.sh` 是从 GitHub 拉代码的，不推上去服务器拿不到。

```bash
git add -A && git commit -m "feat: VPS 部署配置" && git push origin main
```

### 1. DNS（用 Cloudflare 托管）

域名**继续注册在 お名前.com**，只是把 DNS 解析交给 Cloudflare。这样除了解析更快、改记录立即生效，
还白送 CDN、DDoS 防护，并且隐藏服务器真实 IP。

#### 1-a. 迁移前先抄下现有记录

在 お名前.com Navi → ドメイン → DNS設定 里，**把现有记录全部截图或抄下来**，
尤其是 `MX`（邮件）和 `TXT`（SPF / 域名验证）。漏掉 MX 会导致域名邮箱收不到信。

#### 1-b. 在 Cloudflare 添加站点

1. 注册 [Cloudflare](https://dash.cloudflare.com/)（免费版足够）→ **Add a site** → `brandadagio.com`
2. 选 **Free** 套餐，Cloudflare 会自动扫描导入现有记录——**逐条核对**，缺的手动补上
3. 把 A 记录改成新服务器，**代理先关掉**（灰色云朵 DNS only）：

   | 类型 | 名称 | 内容 | 代理状态 |
   |---|---|---|---|
   | A | `brandadagio.com` | `160.251.138.108` | 🔘 DNS only（暂时） |
   | A | `www` | `160.251.138.108` | 🔘 DNS only（暂时） |

4. Cloudflare 会给你两个名前服务器（形如 `xxx.ns.cloudflare.com`）
5. 回 お名前.com Navi → **ネームサーバー設定** → 选「**その他のネームサーバーを使う**」→ 填入这两个
6. 等待生效（通常 10 分钟～数小时），Cloudflare 后台会显示 **Active**

#### 1-c. 关键设置：SSL 模式

进 Cloudflare 的 **SSL/TLS** → **Overview**，选 **Full (strict)**。

> ⚠️ **默认的 Flexible 绝对不能用**。Flexible 下 Cloudflare 用 HTTP 回源，而 Caddy 会把 HTTP 跳转到
> HTTPS，结果是**无限重定向**，网站直接打不开。我们的 Caddy 有正规 Let's Encrypt 证书，
> 用 Full (strict) 才是对的。

#### 1-d. 确认解析

```bash
dig +short brandadagio.com
dig +short www.brandadagio.com
```

**两条都必须返回 `160.251.138.108`。** 返回别的 IP 或为空就先别往下走，
否则 Caddy 拿不到证书，还可能触发 Let's Encrypt 的失败次数限制（同域名每小时 5 次）。

> 代理（橙色云朵）**等第 7 步部署成功、HTTPS 正常之后再打开**。
> 先用 DNS only 让 Caddy 顺利签到证书，顺序反了容易卡在证书环节不好排查。

---

### 2. 登录服务器，装 git 并拉代码

```bash
ssh root@160.251.138.108
apt-get update && apt-get install -y git
git clone https://github.com/linwei2746/brandadagio /srv/brandadagio/app
```

> 仓库是私有的话，先在服务器上生成部署密钥：
> `ssh-keygen -t ed25519 -C "vps" -f ~/.ssh/id_ed25519 -N ""` → 把 `~/.ssh/id_ed25519.pub` 的内容加到
> GitHub 仓库 Settings → Deploy keys，然后用 SSH 地址 clone：
> `git clone git@github.com:linwei2746/brandadagio /srv/brandadagio/app`

### 3. 初始化服务器

```bash
bash /srv/brandadagio/app/deploy/setup-server.sh
```

这一步会装 Node 22、PostgreSQL 18、Caddy，建数据库和运行用户，开防火墙（只放行 22/80/443），
并生成 `/etc/brandadagio.env`（数据库密码和 `PAYLOAD_SECRET` 自动随机生成）。

### 4. 填环境变量

```bash
nano /etc/brandadagio.env
```

必须手动改的只有两组：

```ini
STRIPE_SECRET_KEY=sk_live_...                # ★
STRIPE_WEBHOOK_SECRET=whsec_...              # ★ 第 9 步拿到后回来填
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

其余（`NEXT_PUBLIC_SERVER_URL`、`DATABASE_URI`、`PAYLOAD_SECRET`、`MEDIA_DIR`）
脚本已经按 `https://brandadagio.com` 填好，不用改。

### 5. 装 systemd 服务和 Caddy 配置

```bash
cp /srv/brandadagio/app/deploy/brandadagio.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable brandadagio

cp /srv/brandadagio/app/deploy/Caddyfile /etc/caddy/Caddyfile
caddy validate --config /etc/caddy/Caddyfile
systemctl reload caddy
```

### 6. 放入种子图片

数据库里有 3 条 media 记录指向 `public/img` 里的图。Payload 现在从 `MEDIA_DIR` 读文件，
所以要把它们放过去一次（以后后台上传的图会直接落在这里）：

```bash
cp /srv/brandadagio/app/public/img/*.png /var/lib/brandadagio/media/
chown brandadagio:brandadagio /var/lib/brandadagio/media/*
```

### 7. 部署

```bash
bash /srv/brandadagio/app/deploy/deploy.sh
```

脚本会：拉代码 → `npm ci` → 构建 → 跑数据库迁移 → 同步到 `live/` → 重启 → 健康检查。
最后打印 `OK — HTTP 200` 就成功了。

打开 **https://brandadagio.com** 应该能看到网站，**https://brandadagio.com/admin** 能看到登录页。
访问 `www.brandadagio.com` 会 301 跳到不带 www 的地址。

### 7-b. 打开 Cloudflare 代理

确认 `https://brandadagio.com` 能正常访问、证书有效之后，回到 Cloudflare DNS 页面，
把两条 A 记录的云朵点成**橙色（Proxied）**。

生效后：

- 静态资源（`/_next/static/*`、`/img/*`）由 Cloudflare 全球节点分发，VPS 带宽压力大降
- 服务器真实 IP 不再暴露
- 自动获得 DDoS 防护

**不需要做的事**：
- **不用设置「Cache Everything」**。默认规则只缓存静态扩展名，HTML 不缓存——这正是我们要的。
  开了 Cache Everything 会把 `/admin`、购物车、订单页也缓存掉，直接出事。
- **部署后不用清缓存**。构建产物的文件名带内容哈希，内容变了文件名就变，不存在旧缓存问题。

上传限制方面，Cloudflare 免费版单次请求体上限 100 MB，我们 Caddy 设的是 50 MB，在限制内。

---

### 8. 把数据从 Neon 搬过来

此时数据库是空的（只有表结构）。把新加坡 Neon 上的数据拉过来：

```bash
cd /srv/brandadagio/app
sudo -u brandadagio env \
  DATABASE_URI="$(grep ^DATABASE_URI= /etc/brandadagio.env | cut -d= -f2-)" \
  REMOTE_DATABASE_URI="postgresql://...neon.tech/neondb?sslmode=verify-full" \
  node scripts/sync-db.mjs
```

完成后用你原来的账号登录 `/admin` 确认商品和文章都在。

### 9. Stripe Webhook

到 Stripe 控制台 → Developers → Webhooks → Add endpoint：

- URL：`https://brandadagio.com/api/stripe/webhook`
- 事件：`checkout.session.completed`

拿到 `whsec_...` 填回 `/etc/brandadagio.env` 的 `STRIPE_WEBHOOK_SECRET`，然后：

```bash
systemctl restart brandadagio
```

### 10. 开启每日备份

```bash
crontab -e
```

加一行（凌晨 3:30 跑）：

```
30 3 * * * /srv/brandadagio/app/deploy/backup.sh >> /var/log/brandadagio-backup.log 2>&1
```

**强烈建议配上异地备份**，否则 VPS 硬盘坏了备份也一起没了：

```bash
apt-get install -y rclone
rclone config                      # 建一个叫 offsite 的远端（S3 / B2 / Wasabi 均可）
```

然后把 cron 那行改成 `RCLONE_REMOTE=offsite /srv/brandadagio/app/deploy/backup.sh ...`。

---

## 日常操作

| 要做的事 | 命令 |
|---|---|
| 发布新版本 | `bash /srv/brandadagio/app/deploy/deploy.sh` |
| 看实时日志 | `journalctl -u brandadagio -f` |
| 看最近报错 | `journalctl -u brandadagio -p err -n 50` |
| 重启 | `systemctl restart brandadagio` |
| 查状态 | `systemctl status brandadagio` |
| 手动备份 | `bash /srv/brandadagio/app/deploy/backup.sh` |
| 看 Caddy 日志 | `tail -f /var/log/caddy/brandadagio.log` |

**客户更新商品和博客不需要部署**，在 `/admin` 里改完，缓存会被 `revalidateTag` 立即失效，几秒内生效。
只有改代码才需要跑 `deploy.sh`。

### 回滚

```bash
cd /srv/brandadagio/app
git log --oneline -10                      # 找到要回到的 commit
sudo -u brandadagio git reset --hard <commit>
bash deploy/deploy.sh
```

> 注意：**数据库迁移不会自动回滚**。如果那次发布包含了删列之类的迁移，
> 要先 `npx payload migrate:down` 再回滚代码。日常的改版式、改文案不涉及这个问题。

---

## 部署时会不会断线

重启只有 1–2 秒，而且 Caddy 配了：

```
lb_try_duration 15s
lb_try_interval 250ms
```

这期间请求会在 Caddy 侧排队重试，不会直接返回 502。用户基本感觉不到。

---

## 排错

**部署脚本卡在构建或被 kill**
内存不够。确认是 4 GB 机器；如果是 2 GB，加 swap：

```bash
fallocate -l 4G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

**打开 https://brandadagio.com 返回 502**

```bash
systemctl status brandadagio          # 服务挂了？
journalctl -u brandadagio -n 50       # 为什么挂
```

最常见是 `/etc/brandadagio.env` 里某个值填错，比如 `DATABASE_URI` 密码不对。

**HTTPS 证书申请失败**
八成是 DNS 还没生效或者 80 端口被挡。

```bash
dig +short brandadagio.com        # 必须返回 160.251.138.108
ufw status                        # 80/443 必须 ALLOW
journalctl -u caddy -n 50
```

**网站无限重定向 / ERR_TOO_MANY_REDIRECTS**
Cloudflare 的 SSL 模式是 Flexible。改成 **Full (strict)**。

**访问日志里全是 Cloudflare 的 IP**
`/etc/caddy/Caddyfile` 顶部的 `trusted_proxies` 没生效。确认文件开头有全局 `{ servers { ... } }` 块，
然后 `systemctl reload caddy`。

**后台上传的图片 404**
检查 `MEDIA_DIR` 和目录权限：

```bash
grep MEDIA_DIR /etc/brandadagio.env
ls -la /var/lib/brandadagio/media | head
# 属主必须是 brandadagio
```

**数据库连不上**

```bash
systemctl status postgresql
sudo -u postgres psql -c '\l'          # brandadagio 库在不在
```

---

## 和本地开发的差异

只有三处，代码完全相同：

| | 本地 | VPS |
|---|---|---|
| 数据库 | 绿色版 PostgreSQL，端口 5433 | 系统服务，端口 5432 |
| 表结构变更 | dev push，重启即生效 | `payload migrate`，走迁移文件 |
| 图片保存 | `<项目>/media` | `/var/lib/brandadagio/media` |

本地开发见 [本地开发环境.md](本地开发环境.md)。
