import { supabase } from './supabase'

// Solo Nieves puede leer/borrar esta tabla (política RLS por email en
// supabase/schema.sql) — no hace falta filtrar por user_id aquí, RLS ya
// deja la consulta vacía para cualquier otra cuenta.
export async function listarCorrecciones() {
  return supabase
    .from('correcciones_patrones')
    .select('*')
    .order('created_at', { ascending: false })
}

export async function borrarCorreccion(id) {
  return supabase
    .from('correcciones_patrones')
    .delete()
    .eq('id', id)
}
