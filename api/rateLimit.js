// Límite de peticiones en memoria, por instancia de la función serverless.
// No es fiable al 100% si Vercel reparte tráfico entre varias instancias en
// paralelo, pero es gratis (sin base de datos) y basta para frenar bucles
// accidentales o abuso básico en un endpoint público como /api/chat.
const peticiones = new Map()
const LIMITE_MAPA = 1000

export function limiteExcedido(clave, maxPeticiones, ventanaMs) {
  const ahora = Date.now()
  const historico = (peticiones.get(clave) || []).filter((t) => ahora - t < ventanaMs)

  if (historico.length >= maxPeticiones) {
    peticiones.set(clave, historico)
    return true
  }

  if (peticiones.size >= LIMITE_MAPA && !peticiones.has(clave)) {
    const primeraClave = peticiones.keys().next().value
    peticiones.delete(primeraClave)
  }

  historico.push(ahora)
  peticiones.set(clave, historico)
  return false
}

export function obtenerIP(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) return forwarded.split(',')[0].trim()
  return req.socket?.remoteAddress || 'desconocida'
}

// Comprueba que la petición venga del propio sitio (no de una web externa
// intentando disparar peticiones de coste desde el navegador de un visitante).
// Si el navegador no manda Origin ni Referer (algunos clientes legítimos no lo
// hacen) se deja pasar: lo que bloquea es un origen que SÍ se identifica pero
// no coincide con el dominio propio, no la ausencia de identificación.
export function origenValido(req) {
  const origen = req.headers.origin || req.headers.referer
  if (!origen) return true
  try {
    return new URL(origen).host === req.headers.host
  } catch {
    return false
  }
}
