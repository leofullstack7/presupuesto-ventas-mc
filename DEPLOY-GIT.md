# Despliegue con Git (DreamHost VPS)

Flujo objetivo: **push a `main` → servidor actualiza solo**.

No se usa SCP desde la máquina local. El desarrollador solo hace `git push`.

---

## Arquitectura recomendada

```
GitHub (repo presupuesto-ventas-mc)
        │
        │  git push main
        ▼
┌─────────────────────────────────────────────────────────┐
│  VPS DreamHost — usuario dedicado: presupuesto_mzl      │
│                                                         │
│  ~/repos/presupuesto.git     ← bare repo                │
│       │ post-receive hook                               │
│       ▼                                                 │
│  ~/presupuesto.manizalescomparte.com/   ← web root      │
│       ├── index.html          (desde dist/)             │
│       ├── assets/                                       │
│       ├── api/state.php                                 │
│       ├── data/               (JSON persistido, no git) │
│       └── .htaccess                                     │
└─────────────────────────────────────────────────────────┘
```

**Alternativa:** GitHub Actions ejecuta `deploy.sh` por SSH tras cada push (útil si el hook bare repo da problemas).

---

## Paso 0 — Crear infraestructura en DreamHost (panel)

Hacer **una sola vez** en el panel DreamHost:

### A) Usuario VPS dedicado

1. Panel → **Users** → Add User  
2. Ejemplo: usuario `presupuesto_mzl`, shell `/bin/bash`  
3. Anotar: host SSH (ej. `vps16389.dreamhostps.com`)

### B) Dominio / subdominio

1. Panel → **Domains** → Add domain  
2. Ejemplo: `presupuesto.manizalescomparte.com`  
3. **Fully hosted** bajo el usuario `presupuesto_mzl`  
4. Web directory: `/home/presupuesto_mzl/presupuesto.manizalescomparte.com`

### C) Base de datos MySQL (para fase 2)

1. Panel → **MySQL Databases**  
2. Crear BD: ej. `presupuesto_mc`  
3. Usuario: ej. `presupuesto_user` con permisos solo sobre esa BD  
4. Host: `mysql.manizalescomparte.com`  

> **Nota:** La app **hoy** no usa MySQL; guarda estado en `data/presupuesto-state.json`.  
> La BD queda lista para cuando se migre `api/state.php` a MySQL.

---

## Paso 1 — Repo Git (local + GitHub)

```powershell
cd "C:\Users\dawil\OneDrive\Documents\Agosto\presupuesto-ventas-mc"

git init
git add .
git commit -m "Initial: presupuesto ventas MC — Vite, mobile, API JSON"

# Crear repo vacío en GitHub (ej. manizales-comparte/presupuesto-ventas-mc)
git remote add origin git@github.com:ORG/presupuesto-ventas-mc.git
git branch -M main
git push -u origin main
```

---

## Paso 2 — Setup inicial en el VPS (SSH, una vez)

Conectarse:

```bash
ssh presupuesto_mzl@vps16389.dreamhostps.com
```

### 2.1 Node.js (para build en servidor)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22
node -v
npm -v
```

### 2.2 Directorios

```bash
DOMAIN=presupuesto.manizalescomparte.com
mkdir -p ~/$DOMAIN/data ~/repos
chmod 775 ~/$DOMAIN/data
```

### 2.3 Bare repository + hook

```bash
cd ~/repos
git init --bare presupuesto.git

cat > presupuesto.git/hooks/post-receive << 'HOOK'
#!/bin/bash
set -e
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

REPO=/home/presupuesto_mzl/repos/presupuesto.git
WORK=/home/presupuesto_mzl/presupuesto-src
WEB=/home/presupuesto_mzl/presupuesto.manizalescomparte.com

mkdir -p "$WORK" "$WEB/data"

git --work-tree="$WORK" --git-dir="$REPO" checkout -f main

cd "$WORK"
npm ci
npm run build

# Publicar build + API (preservar data/)
rsync -a --delete \
  --exclude 'data/' \
  "$WORK/dist/" "$WEB/"

rsync -a "$WORK/api/" "$WEB/api/"
cp "$WORK/.htaccess" "$WEB/.htaccess"

chmod 755 "$WEB/api"
chmod 644 "$WEB/api/"*.php "$WEB/.htaccess" "$WEB/index.html"
chmod 775 "$WEB/data"

echo "Deploy OK: $(date)"
HOOK

chmod +x presupuesto.git/hooks/post-receive
```

> Ajusta rutas si el usuario o dominio son distintos.

### 2.4 Remote en GitHub → VPS (opción push directo al VPS)

En tu máquina local, segundo remote:

```bash
git remote add vps presupuesto_mzl@vps16389.dreamhostps.com:repos/presupuesto.git
git push vps main
```

O configurar **GitHub Actions** (paso 3) para que el VPS reciba el push vía SSH desde CI.

---

## Paso 3 — GitHub Actions (deploy automático al push)

Crear `.github/workflows/deploy.yml` en el repo (ya incluido en el proyecto).

Secrets en GitHub → Settings → Secrets:

| Secret | Valor |
|--------|--------|
| `VPS_HOST` | `vps16389.dreamhostps.com` |
| `VPS_USER` | `presupuesto_mzl` |
| `VPS_SSH_KEY` | clave privada SSH del deploy |
| `VPS_WEB_PATH` | `/home/presupuesto_mzl/presupuesto.manizalescomparte.com` |

Flujo: push a `main` → Action SSH al VPS → ejecuta `~/presupuesto-src/scripts/deploy.sh`  
(o el hook si prefieres push al bare repo).

---

## Paso 4 — Clave SSH de deploy

En el VPS:

```bash
ssh-keygen -t ed25519 -C "github-deploy-presupuesto" -f ~/.ssh/github_deploy -N ""
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
# Copiar ~/.ssh/github_deploy (privada) → secret VPS_SSH_KEY en GitHub
```

---

## Paso 5 — Verificación

1. Cambio trivial en el repo → `git push origin main`
2. Esperar workflow / hook
3. Abrir `https://presupuesto.manizalescomparte.com`
4. Editar una cantidad → debe guardar y persistir al recargar
5. Logs: `tail -f ~/logs/presupuesto.manizalescomparte.com/https/error.log`

---

## Qué NO va en Git

- `node_modules/`
- `dist/`
- `data/presupuesto-state.json` (datos de producción)
- `api/config.php` (cuando exista, con credenciales MySQL)

---

## Migración futura a MySQL

Cuando exista schema:

1. `api/config.php` en servidor (no en git)  
2. Reemplazar lectura/escritura JSON en `state.php` por PDO  
3. Mantener mismo contrato API: `GET/POST /api/state.php` con `{ state: "..." }`  
   para no romper el frontend, o actualizar `src/utils/storage.js`

Ver estructura del JSON en `CONTEXTO-CLAUDE.md` sección 6.
