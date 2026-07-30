import { createClient } from '@supabase/supabase-js'
import { reglasConstruccion, bloqueTecnicas, bloqueReferencia, promptCorreccion, verificarConteo, promptVerificacion } from './crochetConocimiento.js'

const LIMITE_PATRONES_DIA = 15

function parseImagenes(imagenes) {
  if (!Array.isArray(imagenes)) return []
  return imagenes
    .map((imagen) => {
      if (typeof imagen !== 'string') return null
      const match = imagen.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/)
      if (!match) return null
      return { type: 'image', source: { type: 'base64', media_type: match[1], data: match[2] } }
    })
    .filter(Boolean)
    .slice(0, 3)
}

async function getUsuarioAutenticado(req) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) return { usuario: null, token: null }

  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data?.user) return { usuario: null, token: null }
  return { usuario: data.user, token }
}

// Cliente de Supabase que actúa como la propia usuaria (reenviando su token),
// para que las políticas RLS basadas en auth.uid() se cumplan sin necesitar
// una service role key.
function clienteComoUsuario(token) {
  return createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })
}

async function llamarAnthropic(messages) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 8192, messages }),
  })
  const data = await response.json()
  if (!response.ok) {
    const err = new Error(data.error?.message || 'Error de API')
    err.status = response.status
    throw err
  }
  const texto = data.content?.[0]?.text
  if (!texto) throw new Error('Respuesta vacía')
  return texto
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const { usuario, token } = await getUsuarioAutenticado(req)
  if (!usuario) {
    return res.status(401).json({ error: 'Debes iniciar sesión para generar patrones' })
  }

  const { descripcion, nivel, materiales, idioma, imagenes, patronAnterior, correccion } = req.body

  const supabaseUsuario = clienteComoUsuario(token)

  const imageBlocks = parseImagenes(imagenes)

  if (!descripcion && imageBlocks.length === 0) {
    return res.status(400).json({ error: 'Falta la descripción o una foto de referencia' })
  }

  // Reserva atómica (ver registrar_uso_patron en supabase/schema.sql): cuenta
  // y hace el INSERT en la misma transacción serializada por usuaria, para
  // que peticiones en paralelo no puedan saltarse el límite diario.
  const { data: usoId, error: errorReserva } = await supabaseUsuario.rpc('registrar_uso_patron', {
    p_limite: LIMITE_PATRONES_DIA,
  })

  if (errorReserva) {
    console.error('No se pudo comprobar el límite de uso:', errorReserva)
    return res.status(500).json({ error: 'No se pudo comprobar el límite de uso' })
  }
  if (!usoId) {
    return res.status(429).json({
      error: idioma === 'en'
        ? `You've reached the daily limit of ${LIMITE_PATRONES_DIA} patterns. Please try again tomorrow.`
        : `Has alcanzado el límite diario de ${LIMITE_PATRONES_DIA} patrones. Vuelve a intentarlo mañana.`,
    })
  }

  const proyecto = descripcion || (idioma === 'en'
    ? 'the crochet piece shown in the attached reference photo'
    : 'la pieza de crochet que se muestra en la foto de referencia adjunta')

  const notaFoto = imageBlocks.length > 1
    ? (idioma === 'en'
      ? `${imageBlocks.length} reference images are attached (different angles/details of the same piece): base the shape, colors and details of the final design on the whole set, not on a single angle.`
      : `Se adjuntan ${imageBlocks.length} imágenes de referencia (distintos ángulos/detalles de la misma pieza): básate en el conjunto para la forma, los colores y los detalles del diseño final, no en un único ángulo.`)
    : imageBlocks.length === 1
      ? (idioma === 'en'
        ? 'A reference image is attached: base the shape, colors and details of the final design on it.'
        : 'Se adjunta una imagen de referencia: básate en ella para la forma, los colores y los detalles del diseño final.')
      : ''

  const prompt = idioma === 'en' ? `You are a crochet expert. Generate a complete pattern in English for:

PROJECT: ${proyecto}
LEVEL: ${nivel || 'Beginner'}
AVAILABLE MATERIALS: ${materiales || 'the usual materials for this type of project'}
${notaFoto}
${reglasConstruccion(idioma)}${bloqueTecnicas(descripcion, materiales, idioma)}${bloqueReferencia(descripcion, materiales, idioma)}
Reply ONLY with the pattern, using this exact format (no introduction or closing remarks):

## [Project name]

**Difficulty:** ${nivel || 'Beginner'}
**Estimated time:** [approximate time]
**Approximate size:** [final size]
**Construction method:** [continuous spiral / closed rounds / separate pieces — and a one-line reason why]

## Materials

- [list of exact materials]

## Abbreviations

- [abbreviation]: [full name]

## Stitches used

- [technique or stitch needed for this specific project, e.g. "invisible increase", "magic ring", "sc through both loops"]

## Instructions

**Round 1:** [instructions with exact stitch count]
**Round 2:** [instructions]
[continue round by round]

## Finishing

[assembly, sewing and finishing details]

## Tips

[2-3 useful tips adapted to the ${nivel || 'Beginner'} level]` : `Eres experta en crochet. Genera un patrón completo en español para:

PROYECTO: ${proyecto}
NIVEL: ${nivel || 'Principiante'}
MATERIALES DISPONIBLES: ${materiales || 'los habituales para este tipo de proyecto'}
${notaFoto}
${reglasConstruccion(idioma)}${bloqueTecnicas(descripcion, materiales, idioma)}${bloqueReferencia(descripcion, materiales, idioma)}
Responde SOLO con el patrón, con este formato exacto (sin introducción ni despedida):

## [Nombre del proyecto]

**Dificultad:** ${nivel || 'Principiante'}
**Tiempo estimado:** [tiempo aproximado]
**Medida aproximada:** [medida final]
**Método de construcción:** [espiral continua / vueltas cerradas / piezas separadas — y una línea explicando por qué]

## Materiales

- [lista de materiales exactos]

## Abreviaturas

- [abreviatura]: [nombre completo]

## Puntos a trabajar

- [técnica o punto necesario para este proyecto concreto, ej. "aumento invisible", "anillo mágico", "pb por los dos hilos"]

## Instrucciones

**Vuelta 1:** [instrucciones con conteo exacto de puntos]
**Vuelta 2:** [instrucciones]
[continúa vuelta por vuelta]

## Acabado

[instrucciones de montaje, cosido y detalles finales]

## Consejos

[2-3 consejos útiles adaptados al nivel ${nivel || 'Principiante'}]`

  const mensajeInicial = { role: 'user', content: imageBlocks.length > 0 ? [...imageBlocks, { type: 'text', text: prompt }] : prompt }
  const esCorreccion = Boolean(patronAnterior && correccion)
  const messages = esCorreccion
    ? [mensajeInicial, { role: 'assistant', content: patronAnterior }, { role: 'user', content: promptCorreccion(correccion, idioma) }]
    : [mensajeInicial]

  try {
    let texto = await llamarAnthropic(messages)

    // Autochequeo de conteo de puntos: si alguna vuelta no cuadra, un único
    // reintento pidiéndole a Claude que la revise antes de entregar el patrón.
    const sospechosas = verificarConteo(texto, idioma)
    if (sospechosas.length > 0) {
      try {
        texto = await llamarAnthropic([
          ...messages,
          { role: 'assistant', content: texto },
          { role: 'user', content: promptVerificacion(sospechosas, idioma) },
        ])
      } catch (err) {
        console.error('Reintento de verificación de conteo falló, se entrega el patrón original:', err)
      }
    }

    if (esCorreccion) {
      supabaseUsuario
        .from('correcciones_patrones')
        .insert({
          user_id: usuario.id,
          idioma,
          descripcion,
          nivel,
          materiales,
          tenia_foto: imageBlocks.length > 0,
          patron_anterior: patronAnterior,
          correccion,
          patron_corregido: texto,
        })
        .then(({ error }) => { if (error) console.error('No se pudo registrar la corrección:', error) })
    }

    res.status(200).json({ patron: texto })
  } catch (err) {
    // La generación falló: liberamos la reserva para no gastar un uso del
    // límite diario en un intento que no llegó a entregar patrón.
    supabaseUsuario
      .from('uso_patron')
      .delete()
      .eq('id', usoId)
      .then(({ error }) => { if (error) console.error('No se pudo liberar el uso reservado:', error) })

    console.error('Handler error:', err)
    res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' })
  }
}
