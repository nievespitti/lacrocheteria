-- ====================================================
-- MIGRACIÓN: generaciones + uso anónimo del Asistente IA
-- ====================================================
-- Añade (no modifica nada existente):
--   1. uso_anonimo          → reserva de las 2 generaciones gratis por visitante sin cuenta
--   2. registrar_uso_anonimo / liberar_uso_anonimo → reserva atómica y liberación si falla Claude
--   3. generaciones         → una fila por patrón generado, con su valoración (pulgar + comentario)
--   4. valorar_generacion   → guarda la valoración de una fila concreta
--
-- Cómo aplicarla:
-- 1. Supabase → SQL Editor
-- 2. Pega todo este archivo y pulsa "Run"
-- Se puede ejecutar más de una vez sin romper nada.
-- ====================================================


-- ----------------------------------------------------
-- 1. USO ANÓNIMO
-- ----------------------------------------------------
-- Una fila por generación reservada por un visitante sin cuenta. RLS activado
-- y SIN políticas: nadie la lee ni la escribe directamente; solo las funciones
-- security definer de abajo.

create table if not exists public.uso_anonimo (
  id uuid primary key default gen_random_uuid(),
  anon_id uuid not null,
  created_at timestamptz not null default now()
);

create index if not exists uso_anonimo_anon_id_idx on public.uso_anonimo(anon_id);
create index if not exists uso_anonimo_created_at_idx on public.uso_anonimo(created_at);

alter table public.uso_anonimo enable row level security;


-- registrar_uso_anonimo: cuenta + reserva en una sola transacción, con un
-- advisory lock global para que peticiones en paralelo no se salten ni el
-- límite por visitante ni el tope diario global.
-- Devuelve {"id": uuid, "usados": n} si hay hueco, o {"motivo": "limite_visitante" | "tope_diario"}.
create or replace function public.registrar_uso_anonimo(
  p_anon_id uuid,
  p_limite_visitante integer default 2,
  p_tope_diario integer default 60
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_usados integer;
  v_hoy integer;
  v_id uuid;
begin
  if p_anon_id is null then
    raise exception 'Falta anon_id';
  end if;

  perform pg_advisory_xact_lock(hashtext('uso_anonimo'));

  select count(*) into v_usados
  from public.uso_anonimo
  where anon_id = p_anon_id;

  if v_usados >= p_limite_visitante then
    return jsonb_build_object('motivo', 'limite_visitante');
  end if;

  select count(*) into v_hoy
  from public.uso_anonimo
  where created_at >= now() - interval '24 hours';

  if v_hoy >= p_tope_diario then
    return jsonb_build_object('motivo', 'tope_diario');
  end if;

  insert into public.uso_anonimo (anon_id) values (p_anon_id)
  returning id into v_id;

  return jsonb_build_object('id', v_id, 'usados', v_usados + 1);
end;
$$;

-- Libera una reserva si la llamada a Claude falla (para no gastar uno de los
-- 2 usos en un intento que no entregó patrón). El id solo lo conoce el servidor.
create or replace function public.liberar_uso_anonimo(p_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.uso_anonimo
  where id = p_id and created_at >= now() - interval '10 minutes';
$$;

revoke all on function public.registrar_uso_anonimo(uuid, integer, integer) from public;
revoke all on function public.liberar_uso_anonimo(uuid) from public;
grant execute on function public.registrar_uso_anonimo(uuid, integer, integer) to anon, authenticated;
grant execute on function public.liberar_uso_anonimo(uuid) to anon, authenticated;


-- ----------------------------------------------------
-- 2. GENERACIONES (valoración de patrones)
-- ----------------------------------------------------
-- La inserta api/patron.js cada vez que entrega un patrón (también las
-- correcciones, marcadas con es_correccion). La valoración llega después,
-- desde el navegador, vía valorar_generacion().
-- ip_hash = sha256(sal + IP): solo para detectar abuso, nunca para bloquear.

create table if not exists public.generaciones (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  prompt text check (char_length(prompt) <= 2000),
  tipo text not null check (tipo in ('texto', 'imagen')),
  valoracion text check (valoracion in ('positiva', 'negativa')),
  comentario text check (char_length(comentario) <= 1000),
  user_id uuid references auth.users(id) on delete set null,
  anon_id uuid,
  ip_hash text check (char_length(ip_hash) <= 64),
  es_correccion boolean not null default false
);

create index if not exists generaciones_created_at_idx on public.generaciones(created_at);

alter table public.generaciones enable row level security;

-- Cualquiera inserta SU propia fila: con sesión, user_id debe ser el suyo;
-- sin sesión, user_id va vacío. La valoración no se puede rellenar al insertar.
drop policy if exists "Insertar mi generacion" on public.generaciones;
create policy "Insertar mi generacion"
  on public.generaciones for insert
  to anon, authenticated
  with check (
    (user_id is null or user_id = auth.uid())
    and valoracion is null
    and comentario is null
  );

-- Solo Nieves lee todo (mismo patrón que correcciones_patrones).
drop policy if exists "Solo Nieves ve las generaciones" on public.generaciones;
create policy "Solo Nieves ve las generaciones"
  on public.generaciones for select
  to authenticated
  using (auth.jwt() ->> 'email' = 'nievesgarciapitti@gmail.com');

grant insert on public.generaciones to anon, authenticated;
grant select on public.generaciones to authenticated;


-- valorar_generacion: no hay política de UPDATE; la única forma de cambiar una
-- fila es esta función, que solo toca valoracion/comentario de esa fila y solo
-- durante 24 h. El id (uuid aleatorio) solo lo recibe quien generó el patrón.
create or replace function public.valorar_generacion(
  p_id uuid,
  p_valoracion text,
  p_comentario text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_valoracion not in ('positiva', 'negativa') then
    raise exception 'Valoración no válida';
  end if;

  update public.generaciones
  set valoracion = p_valoracion,
      comentario = nullif(left(trim(coalesce(p_comentario, '')), 1000), '')
  where id = p_id
    and created_at >= now() - interval '24 hours';
end;
$$;

revoke all on function public.valorar_generacion(uuid, text, text) from public;
grant execute on function public.valorar_generacion(uuid, text, text) to anon, authenticated;
