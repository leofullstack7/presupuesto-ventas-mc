-- Ejecutar en Supabase → SQL Editor (proyecto presupuesto-ventas-mc)

create table if not exists public.app_state (
  id text primary key,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.app_state enable row level security;

-- App interna de una sola organización: anon puede leer/escribir la fila default.
-- TODO: restringir con auth cuando haya login de usuarios.
create policy "anon read app_state"
  on public.app_state for select
  to anon
  using (true);

create policy "anon write app_state"
  on public.app_state for insert
  to anon
  with check (true);

create policy "anon update app_state"
  on public.app_state for update
  to anon
  using (true)
  with check (true);

insert into public.app_state (id, state)
values ('default', '{}'::jsonb)
on conflict (id) do nothing;
