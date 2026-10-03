import { createHash, randomUUID } from 'node:crypto'

// Lógica compartida por api/patron.js y su réplica en vite.config.js para:
// - las 2 generaciones gratis por visitante sin cuenta (tabla uso_anonimo),
// - el registro de cada patrón generado (tabla generaciones),
// - reconocer cuándo Anthropic falla por saldo/límite de gasto.
// Ver supabase/migracion_generaciones.sql.

export const LIMITE_ANONIMO = 2
const TOPE_ANONIMO_POR_DEFECTO = 60
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function anonIdValido(anonId) {
  return typeof anonId === 'string' && UUID_RE.test(anonId)
}

// Tope global de generaciones anónimas en 24h. Se ajusta con la env var
// ANON_DAILY_CAP sin tocar código (0 = desactivar el uso sin cuenta).
export function topeDiarioAnonimo(env) {
  const n = Number.parseInt(env.ANON_DAILY_CAP, 10)
  return Number.isInteger(n) && n >= 0 ? n : TOPE_ANONIMO_POR_DEFECTO
}

// La IP nunca se guarda en claro: sha256 con una sal secreta (env var ANON_SALT).
// Solo sirve para detectar abuso revisando la tabla, no para bloquear.
export function hashIP(ip, env) {
  if (!env.ANON_SALT) return null
  return createHash('sha256').update(`${env.ANON_SALT}:${ip}`).digest('hex')
}

// Devuelve { reserva, error }. reserva = { id, usados } si hay hueco, o
// { motivo: 'limite_visitante' | 'tope_diario' } si no.
export async function reservarUsoAnonimo(supabase, anonId, env) {
  const { data, error } = await supabase.rpc('registrar_uso_anonimo', {
    p_anon_id: anonId,
    p_limite_visitante: LIMITE_ANONIMO,
    p_tope_diario: topeDiarioAnonimo(env),
  })
  return { reserva: data, error }
}

export function liberarUsoAnonimo(supabase, id) {
  return supabase
    .rpc('liberar_uso_anonimo', { p_id: id })
    .then(({ error }) => { if (error) console.error('No se pudo liberar el uso anónimo reservado:', error) })
}

// Inserta la fila en generaciones y devuelve su id (o null si falla: el patrón
// se entrega igual, solo que sin poder valorarse). El id se crea aquí porque
// RLS no deja leer la tabla de vuelta a quien inserta.
export async function registrarGeneracion(supabase, { prompt, tipo, userId, anonId, ipHash, esCorreccion }) {
  const id = randomUUID()
  const { error } = await supabase.from('generaciones').insert({
    id,
    prompt: prompt ? prompt.slice(0, 2000) : null,
    tipo,
    user_id: userId || null,
    anon_id: anonIdValido(anonId) ? anonId : null,
    ip_hash: ipHash,
    es_correccion: esCorreccion,
  })
  if (error) {
    console.error('No se pudo registrar la generación:', error)
    return null
  }
  return id
}

// Errores de Anthropic por saldo agotado o límite de gasto/uso: al usuario se
// le muestra un mensaje amable ("el generador está descansando") en vez del error.
export function esErrorDeSaldo(err) {
  if ([402, 403, 429].includes(err.status)) return true
  return err.status === 400 && /credit balance|billing|spend|usage limit/i.test(err.message || '')
}
