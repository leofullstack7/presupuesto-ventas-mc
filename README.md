# Presupuesto de ventas — Manizales Comparte

Aplicación web para gestionar el presupuesto de ventas Jul–Dic 2026, registrar ventas reales y tablero de control comercial.

**Producción:** [Vercel](https://vercel.com) (frontend) + [Supabase](https://supabase.com) (persistencia compartida)

## Stack

- React 18 + Vite 6 + Recharts
- Supabase (`app_state` JSON) + localStorage
- Deploy: Vercel (equipo Manizales Comparte)

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # pegar URL y anon key de Supabase
npm run dev
```

## Supabase (una vez)

1. Crear proyecto en Supabase (nombre sugerido: `presupuesto-ventas-mc`)
2. SQL Editor → ejecutar `supabase/schema.sql`
3. Copiar `Project URL` y `anon public key` a `.env.local` y Vercel

## Build

```bash
npm run build   # → dist/
```

## Funciones

- Presupuesto editable por línea/mes
- Ventas reales y tablero de control
- Vista móvil dedicada (≤768px)
- Exportar / importar respaldo JSON
- Persistencia: localStorage + Supabase

## Repo

https://github.com/leofullstack7/presupuesto-ventas-mc
