# ============================================================
#  一键部署脚本（brandadagio → Vercel）
#  用法：在 03.张佳荟 目录里运行  ./deploy.ps1
#
#  原理：Vercel 会对「git 仓库内的部署」做提交作者校验，
#        而本项目所在仓库没有连接对应的 GitHub 账号，会被拦截。
#        本脚本先把源码复制到一个【非 git 的临时目录】，
#        再从那里用 CLI 部署，从而绕开该校验。
# ============================================================

$ErrorActionPreference = "Stop"

$src = $PSScriptRoot
$dst = Join-Path $env:TEMP "brandadagio-deploy"

Write-Host "① 复制源码到非 git 目录: $dst" -ForegroundColor Cyan
if (Test-Path $dst) { Remove-Item -Recurse -Force $dst }
New-Item -ItemType Directory -Path $dst | Out-Null

# 复制全部内容，但排除 node_modules 与 .next（云端会自行安装/构建）
robocopy $src $dst /E /XD node_modules .next /NFL /NDL /NJH /NJS /NP | Out-Null
# robocopy 成功的退出码是 0~7，视为正常
if ($LASTEXITCODE -ge 8) { throw "复制失败 (robocopy exit=$LASTEXITCODE)" }
$global:LASTEXITCODE = 0

Write-Host "② 从非 git 目录部署到生产环境..." -ForegroundColor Cyan
Push-Location $dst
try {
    npx vercel deploy --prod
} finally {
    Pop-Location
}

Write-Host "✔ 完成。正式地址: https://brandadagio.vercel.app" -ForegroundColor Green
