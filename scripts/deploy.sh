#!/bin/bash
# Ejecutar en el VPS tras git pull (manual o desde GitHub Actions)
set -euo pipefail

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

WEB="${VPS_WEB_PATH:-$HOME/presupuesto.manizalescomparte.com}"

echo "==> Deploy presupuesto-ventas-mc"
echo "    Repo: $REPO_ROOT"
echo "    Web:  $WEB"

cd "$REPO_ROOT"

npm ci
npm run build

mkdir -p "$WEB/data" "$WEB/api"

rsync -a --delete \
  --exclude 'data/' \
  "$REPO_ROOT/dist/" "$WEB/"

rsync -a "$REPO_ROOT/api/" "$WEB/api/"
cp "$REPO_ROOT/.htaccess" "$WEB/.htaccess"

chmod 755 "$WEB/api"
chmod 644 "$WEB/api/"*.php "$WEB/.htaccess" "$WEB/index.html" 2>/dev/null || true
chmod 775 "$WEB/data"

echo "==> Deploy OK $(date -Iseconds)"
