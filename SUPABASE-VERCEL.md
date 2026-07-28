# Supabase + Vercel — pasos pendientes

## GitHub ✅

Repo: https://github.com/leofullstack7/presupuesto-ventas-mc  
Rama: `main`

## Vercel ⚠️ (equipo incorrecto)

Desplegado en el equipo **concejo** (cuenta CLI actual), no en Manizales Comparte:

- **Producción:** https://presupuesto-ventas-mc.vercel.app
- **Panel:** https://vercel.com/concejo/presupuesto-ventas-mc

### Mover a Manizales Comparte

1. Cerrar sesión CLI: `npx vercel logout`
2. Iniciar sesión con la cuenta del equipo **Manizales Comparte**: `npx vercel login`
3. Verificar equipos: `npx vercel teams ls`
4. En el dashboard Vercel (Manizales Comparte):
   - **Add New → Project**
   - Importar `leofullstack7/presupuesto-ventas-mc` desde GitHub
   - Framework: Vite (auto)
   - Agregar variables de entorno (ver abajo)
5. Opcional: eliminar proyecto en `concejo` si ya no se usa

### Auto-deploy desde GitHub

En Vercel → Settings → Git → conectar GitHub (`leofullstack7`).  
Falló automáticamente porque la cuenta CLI no tenía GitHub vinculado.

---

## Supabase (pendiente — requiere tu cuenta)

1. Crear proyecto en https://supabase.com (nombre: `presupuesto-ventas-mc`)
2. **SQL Editor** → pegar y ejecutar `supabase/schema.sql`
3. **Settings → API** → copiar:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`
4. En **Vercel → Project → Settings → Environment Variables**, agregar ambas para **Production** (y Preview si quieres)
5. Redeploy: Deployments → Redeploy

Sin esas variables la app funciona solo con **localStorage** (no comparte entre dispositivos).

### Local

```powershell
cp .env.example .env.local
# pegar URL y anon key
npm run dev
```
