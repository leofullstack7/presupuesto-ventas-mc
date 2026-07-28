# Despliegue en DreamHost

> **Preferido:** despliegue con Git → ver **`DEPLOY-GIT.md`**  
> Este archivo describe despliegue manual (SCP). Solo usar como respaldo.

Sigue el mismo patrón que `CONTEXT.md` (proyecto Manizales Es El Aula).

## Requisitos

- VPS DreamHost con PHP 8.x y Apache (`mod_rewrite`)
- Dominio o subdominio apuntando al directorio del proyecto

## 1. Build local

```powershell
cd "C:\Users\dawil\OneDrive\Documents\Agosto\presupuesto-ventas-mc"
npm install
npm run build
```

El build escribe en `dist/` (`index.html`, `assets/*`).

## 2. Subir al servidor

Ajusta usuario, host y ruta según tu dominio. Ejemplo:

```powershell
$REMOTE = "USUARIO@vpsXXXXX.dreamhostps.com"
$PATH = "/home/USUARIO/presupuesto.manizalescomparte.com"

scp -r "dist" "api" ".htaccess" "${REMOTE}:${PATH}/"
```

En el servidor debe quedar:

```
/home/USUARIO/presupuesto.manizalescomparte.com/
├── .htaccess
├── index.html          ← desde dist/
├── assets/             ← desde dist/assets/
├── api/
│   └── state.php
└── data/               ← se crea automáticamente al guardar
```

## 3. Permisos (SSH)

```bash
chmod 755 api data
chmod 644 api/state.php .htaccess index.html
chmod 644 assets/*
```

La carpeta `data/` debe ser escribible por PHP:

```bash
chmod 775 data
```

## 4. Verificar

1. Abrir la URL del dominio — debe cargar la app
2. Editar una cantidad — debe mostrar "Guardado"
3. Recargar — debe persistir (localStorage + servidor)
4. Probar en móvil — navegación inferior y tarjetas

## 5. Logs de error

```bash
tail -f /home/USUARIO/logs/DOMINIO/https/error.log
```

## Notas

- No subas `node_modules/` ni el `.jsx` original al servidor
- Si cambias la ruta base, mantén `base: "./"` en `vite.config.js`
- La API no requiere MySQL; usa JSON en `data/presupuesto-state.json`
