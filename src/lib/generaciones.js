import { supabase } from './supabase'

// Solo Nieves puede leer esta tabla (política RLS por email en
// supabase/migracion_generaciones.sql): para cualquier otra cuenta la consulta
// vuelve vacía. `dias` = null trae todo el histórico.
export async function listarGeneraciones(dias) {
  let consulta = supabase
    .from('generaciones')
    .select('id, created_at, prompt, tipo, valoracion, comentario, user_id, anon_id, ip_hash, es_correccion')
    .order('created_at', { ascending: false })
    .limit(2000)

  if (dias) {
    const desde = new Date(Date.now() - dias * 24 * 60 * 60 * 1000).toISOString()
    consulta = consulta.gte('created_at', desde)
  }
  return consulta
}
