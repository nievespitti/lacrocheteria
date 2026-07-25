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
