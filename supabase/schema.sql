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

-- ====================================================
-- CORRECCIONES DE PATRONES — La CrocheterIA
-- ====================================================
-- Registro (solo añadir) de las correcciones que las usuarias hacen sobre
-- patrones generados por el Asistente IA (botón "Este patrón no está bien"
-- en AsistenteIA.jsx). Sirve para revisar qué falla en la práctica y mejorar
-- api/crochetConocimiento.js con el tiempo. No guarda las fotos de referencia,
-- solo si el proyecto tenía alguna.
-- ====================================================

create table if not exists public.correcciones_patrones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  idioma text not null,
  descripcion text,
  nivel text,
  materiales text,
  tenia_foto boolean not null default false,
  patron_anterior text not null,
  correccion text not null,
  patron_corregido text not null,
  created_at timestamptz not null default now()
);

alter table public.correcciones_patrones enable row level security;

create policy "Crear mi correccion"
  on public.correcciones_patrones for insert
  with check (auth.uid() = user_id);

-- Solo Nieves (dueña del proyecto) puede leer/borrar el registro completo —
-- no hay tabla de roles en este proyecto, así que se gatea por email directamente.
create policy "Solo Nieves ve las correcciones"
  on public.correcciones_patrones for select
  using (auth.jwt() ->> 'email' = 'nievesgarciapitti@gmail.com');

create policy "Solo Nieves borra correcciones"
  on public.correcciones_patrones for delete
  using (auth.jwt() ->> 'email' = 'nievesgarciapitti@gmail.com');

grant select, insert, delete on public.correcciones_patrones to authenticated;

-- ====================================================
-- USO DEL ASISTENTE IA — límite diario de generaciones
-- ====================================================
-- Cada llamada a /api/patron que llega a generar un patrón (o una
-- corrección) inserta una fila aquí. Antes de generar, el servidor cuenta
-- las filas de las últimas 24h para la usuaria y corta si supera el límite.
-- Sirve para acotar el coste de la API de Anthropic (Sonnet) si alguien
-- abusa o hay un bucle accidental en el cliente.
-- ====================================================

create table if not exists public.uso_patron (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists uso_patron_user_created_idx
  on public.uso_patron(user_id, created_at);

alter table public.uso_patron enable row level security;

create policy "Registrar mi uso"
  on public.uso_patron for insert
  with check (auth.uid() = user_id);

create policy "Ver mi propio uso"
  on public.uso_patron for select
  using (auth.uid() = user_id);

grant select, insert on public.uso_patron to authenticated;
