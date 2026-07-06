import { createClient } from '@supabase/supabase-js'
import { reglasConstruccion, tecnicasAvanzadas, bloqueReferencia, promptCorreccion } from './crochetConocimiento.js'

function parseImagen(imagen) {
  if (typeof imagen !== 'string') return null
  const match = imagen.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/)
  if (!match) return null
  return { type: 'image', source: { type: 'base64', media_type: match[1], data: match[2] } }
}

async function getUsuarioAutenticado(req) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) return null

  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data?.user) return null
  return data.user
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const usuario = await getUsuarioAutenticado(req)
  if (!usuario) {
    return res.status(401).json({ error: 'Debes iniciar sesión para generar patrones' })
  }

  const { descripcion, nivel, materiales, idioma, imagen, patronAnterior, correccion } = req.body

  const imageBlock = parseImagen(imagen)

  if (!descripcion && !imageBlock) {
    return res.status(400).json({ error: 'Falta la descripción o una foto de referencia' })
  }

  const proyecto = descripcion || (idioma === 'en'
    ? 'the crochet piece shown in the attached reference photo'
    : 'la pieza de crochet que se muestra en la foto de referencia adjunta')

  const prompt = idioma === 'en' ? `You are a crochet expert. Generate a complete pattern in English for:

PROJECT: ${proyecto}
LEVEL: ${nivel || 'Beginner'}
AVAILABLE MATERIALS: ${materiales || 'the usual materials for this type of project'}
${imageBlock ? 'A reference image is attached: base the shape, colors and details of the final design on it.' : ''}
${reglasConstruccion(idioma)}${tecnicasAvanzadas(idioma)}${bloqueReferencia(descripcion, materiales, idioma)}
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
${imageBlock ? 'Se adjunta una imagen de referencia: básate en ella para la forma, los colores y los detalles del diseño final.' : ''}
${reglasConstruccion(idioma)}${tecnicasAvanzadas(idioma)}${bloqueReferencia(descripcion, materiales, idioma)}
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

  const mensajeInicial = { role: 'user', content: imageBlock ? [imageBlock, { type: 'text', text: prompt }] : prompt }
  const messages = patronAnterior && correccion
    ? [mensajeInicial, { role: 'assistant', content: patronAnterior }, { role: 'user', content: promptCorreccion(correccion, idioma) }]
    : [mensajeInicial]

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 8192,
        messages,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Anthropic error:', data)
      return res.status(response.status).json({ error: data.error?.message || 'Error de API' })
    }

    const texto = data.content?.[0]?.text
    if (!texto) return res.status(500).json({ error: 'Respuesta vacía' })

    res.status(200).json({ patron: texto })
  } catch (err) {
    console.error('Handler error:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}
