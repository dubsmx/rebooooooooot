# publish-copy-fixed.ps1 — copia limpia + GitHub + listo para Vercel
$ErrorActionPreference = "Stop"

function WriteUtf8NoBom([string]$Path,[string]$Content){
  $enc = New-Object System.Text.UTF8Encoding($false)
  $full = Join-Path $PWD $Path
  $dir  = Split-Path -Parent $full
  if (-not [string]::IsNullOrWhiteSpace($dir) -and -not (Test-Path $dir)) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
  }
  [System.IO.File]::WriteAllText($full,$Content,$enc)
}

Write-Host "Trabajando en: $(Get-Location)" -ForegroundColor Cyan

# 1) .gitignore
$gitignore = @"
# Dependencies / builds
node_modules/
.next/
out/
dist/
coverage/
.vscode/
.vercel/

# Env / secrets
.env
.env.*
!.env.example

# OS
.DS_Store
Thumbs.db

# Logs
npm-debug.log*
yarn-debug.log*
pnpm-debug.log*
"@
WriteUtf8NoBom ".gitignore" $gitignore

# 2) .env.example
$envExample = @"
# Copia esto a .env.local (dev) y configúralo también en Vercel (Project Settings > Environment Variables)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx

# Opcionales (precios de Stripe)
NEXT_PUBLIC_PRICE_OASIS=price_xxx
NEXT_PUBLIC_PRICE_RELSB=price_xxx
NEXT_PUBLIC_PRICE_TAYLOR=price_xxx
"@
WriteUtf8NoBom ".env.example" $envExample

# 3) README
$readme = @"
# Reboot (copia)

Next.js + Tailwind (tema negro sólido). Botones: blanco (primario) y borde blanco (secundario).
Checkout embebido de Stripe en \`/checkout\` y confirmación \`/success\`.

## Desarrollo
npm i
npm run dev

## Variables de entorno
Copia \`.env.example\` a \`.env.local\` (local). En producción, configura las mismas en Vercel.
"@
WriteUtf8NoBom "README.md" $readme

# 4) Limpia build local
if (Test-Path ".next") { Remove-Item ".next" -Recurse -Force }

# 5) Re-inicializa git (historial nuevo)
if (Test-Path ".git") {
  Write-Host "Encontrado .git previo. Creando copia limpia..." -ForegroundColor Yellow
  Remove-Item ".git" -Recurse -Force
}

# Compatibilidad con git antiguo/nuevo
try {
  git init -b main | Out-Null
} catch {
  git init | Out-Null
  git branch -M main | Out-Null
}
git add -A
git commit -m "chore: initial copy of Reboot (black theme UI + embedded checkout)" | Out-Null

# 6) Publica en GitHub
$gh = Get-Command gh -ErrorAction SilentlyContinue
if ($gh) {
  try {
    $user = (gh api user --jq ".login") 2>$null
  } catch { $user = "" }
  $repoName = Read-Host "Nombre del repo NUEVO en GitHub (ej. reboot-copy)"
  if (-not $repoName) { throw "Debes indicar un nombre de repo" }
  $visibility = Read-Host "Visibilidad (public/private) [default: private]"
  if ([string]::IsNullOrWhiteSpace($visibility)) { $visibility = "private" }

  gh repo create "$repoName" --$visibility --source "." --remote "origin" --push
  if ($user) {
    Write-Host "✅ Repo creado y publicado: https://github.com/$user/$repoName" -ForegroundColor Green
  } else {
    Write-Host "✅ Repo creado y publicado (revisa tu cuenta en GitHub)" -ForegroundColor Green
  }
} else {
  Write-Host "No se encontró GitHub CLI (gh)." -ForegroundColor Yellow
  Write-Host "Crea un repo vacío en https://github.com/new y pega la URL cuando te la pida." -ForegroundColor Yellow
  $remoteUrl = Read-Host "Pega la URL del repo (https o ssh)"
  if (-not $remoteUrl) { throw "Debes pegar la URL del repo" }
  git remote add origin $remoteUrl
  git push -u origin main
  Write-Host "✅ Repo publicado en: $remoteUrl" -ForegroundColor Green
}

Write-Host "`nListo. Importa el repo en Vercel y configura variables de entorno." -ForegroundColor Cyan
