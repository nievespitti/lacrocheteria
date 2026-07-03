import { supabase } from './supabase'

export async function guardarProyecto({ userId, tipo, titulo, contenido }) {
  return supabase
    .from('proyectos_guardados')
    .insert({ user_id: userId, tipo, titulo, contenido })
}

export async function listarProyectos(userId) {
  return supabase
    .from('proyectos_guardados')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
}

export async function borrarProyecto(id) {
  return supabase
    .from('proyectos_guardados')
    .delete()
    .eq('id', id)
}
