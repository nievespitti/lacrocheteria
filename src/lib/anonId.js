// Identificador anónimo del visitante (uuid aleatorio en localStorage). Se envía
// a /api/patron para contar las 2 generaciones gratis sin cuenta. El límite lo
// aplica el servidor (tabla uso_anonimo); esto solo identifica al navegador.
const CLAVE = 'crocheteria_anon_id'

// crypto.randomUUID solo existe en https/localhost; al probar desde el móvil
// por la IP local (http) se genera a mano con getRandomValues.
function nuevoUUID() {
  if (crypto.randomUUID) return crypto.randomUUID()
  const b = crypto.getRandomValues(new Uint8Array(16))
  b[6] = (b[6] & 0x0f) | 0x40
  b[8] = (b[8] & 0x3f) | 0x80
  const h = [...b].map((x) => x.toString(16).padStart(2, '0')).join('')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

export function obtenerAnonId() {
  try {
    let id = localStorage.getItem(CLAVE)
    if (!id) {
      id = nuevoUUID()
      localStorage.setItem(CLAVE, id)
    }
    return id
  } catch {
    // Sin localStorage (modo privado estricto): id de un solo uso.
    return nuevoUUID()
  }
}
