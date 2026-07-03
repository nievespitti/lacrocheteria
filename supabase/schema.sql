-- ====================================================
-- PROYECTOS GUARDADOS — La CrocheterIA
-- ====================================================
-- Guarda los patrones generados por el Asistente IA y los diseños
-- creados en el Diseñador, asociados al usuario que los creó.
--
-- Cómo aplicar este esquema:
-- 1. Entra en tu proyecto de Supabase (https://supabase.com/dashboard)
-- 2. Ve a "SQL Editor" en el menú lateral
-- 3. Pega todo este archivo y pulsa "Run"
-- ====================================================

create table if not exists public.proyectos_guardados (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tipo text not null check (tipo in ('patron', 'diseno')),
  titulo text not null,
  contenido jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists proyectos_guardados_user_id_idx
  on public.proyectos_guardados(user_id);

-- Row Level Security: cada usuaria solo ve y modifica sus propios proyectos
alter table public.proyectos_guardados enable row level security;

create policy "Ver mis proyectos"
  on public.proyectos_guardados for select
  using (auth.uid() = user_id);

create policy "Crear mis proyectos"
  on public.proyectos_guardados for insert
  with check (auth.uid() = user_id);

create policy "Borrar mis proyectos"
  on public.proyectos_guardados for delete
  using (auth.uid() = user_id);

-- No se incluye policy de "update": los proyectos guardados son de solo
-- lectura una vez creados (se borran y se vuelven a guardar si cambian).

-- Las políticas RLS solo restringen filas; el rol "authenticated" también
-- necesita permiso de acceso a la tabla en sí (GRANT), o Postgres rechaza
-- la petición antes siquiera de evaluar las políticas.
grant select, insert, delete on public.proyectos_guardados to authenticated;
