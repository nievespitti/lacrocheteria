import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { createClient } from '@supabase/supabase-js'
import { systemPrompt } from './api/chatSystemPrompt.js'
import { reglasConstruccion, tecnicasAvanzadas, bloqueReferencia, promptCorreccion } from './api/crochetConocimiento.js'

function parseImagen(imagen) {
  if (typeof imagen !== 'string') return null
  const match = imagen.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/)
  if (!match) return null
  return { type: 'image', source: { type: 'base64', media_type: match[1], data: match[2] } }
}

async function getUsuarioAutenticado(req, env) {
  const authHeader = req.headers['authorization'] || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) return null

  const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data?.user) return null
  return data.user
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'api-patron',
        configureServer(server) {
          server.middlewares.use('/api/patron', (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405
              return res.end(JSON.stringify({ error: 'Método no permitido' }))
            }

            const chunks = []
            req.on('data', chunk => chunks.push(chunk))
            req.on('end', async () => {
              try {
                const usuario = await getUsuarioAutenticado(req, env)
                if (!usuario) {
                  res.statusCode = 401
                  return res.end(JSON.stringify({ error: 'Debes iniciar sesión para generar patrones' }))
                }

                const { descripcion, nivel, materiales, idioma, imagen, patronAnterior, correccion } = JSON.parse(
                  Buffer.concat(chunks).toString()
                )

                const imageBlock = parseImagen(imagen)

                if (!descripcion && !imageBlock) {
                  res.statusCode = 400
                  return res.end(JSON.stringify({ error: 'Falta la descripción o una foto de referencia' }))
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

## Finishing

[assembly, sewing and finishing details]

## Tips

[2-3 tips adapted to the ${nivel || 'Beginner'} level]` : `Eres experta en crochet. Genera un patrón completo en español para:

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

## Acabado

[instrucciones de montaje, cosido y detalles finales]

## Consejos

[2-3 consejos adaptados al nivel ${nivel || 'Principiante'}]`

                const apiKey = env.ANTHROPIC_API_KEY

                const mensajeInicial = { role: 'user', content: imageBlock ? [imageBlock, { type: 'text', text: prompt }] : prompt }
                const messages = patronAnterior && correccion
                  ? [mensajeInicial, { role: 'assistant', content: patronAnterior }, { role: 'user', content: promptCorreccion(correccion, idioma) }]
                  : [mensajeInicial]

                const response = await fetch('https://api.anthropic.com/v1/messages', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                  },
                  body: JSON.stringify({
                    model: 'claude-sonnet-4-6',
                    max_tokens: 8192,
                    messages,
                  }),
                })

                const data = await response.json()
                const texto = data.content?.[0]?.text

                res.setHeader('Content-Type', 'application/json')
                if (!texto) {
                  res.statusCode = 500
                  return res.end(JSON.stringify({ error: data.error?.message || 'Respuesta vacía de la IA' }))
                }
                res.end(JSON.stringify({ patron: texto }))
              } catch (err) {
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: err.message }))
              }
            })
          })
        },
      },
      {
        name: 'api-chat',
        configureServer(server) {
          server.middlewares.use('/api/chat', (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405
              return res.end(JSON.stringify({ error: 'Método no permitido' }))
            }

            const chunks = []
            req.on('data', chunk => chunks.push(chunk))
            req.on('end', async () => {
              res.setHeader('Content-Type', 'application/json')
              try {
                const { mensajes, idioma } = JSON.parse(Buffer.concat(chunks).toString())

                if (!Array.isArray(mensajes) || mensajes.length === 0) {
                  res.statusCode = 400
                  return res.end(JSON.stringify({ error: 'Falta la conversación' }))
                }

                const historial = mensajes
                  .slice(-20)
                  .filter(m => m && typeof m.content === 'string' && (m.role === 'user' || m.role === 'assistant'))
                  .map(m => ({ role: m.role, content: m.content }))

                if (historial.length === 0) {
                  res.statusCode = 400
                  return res.end(JSON.stringify({ error: 'Conversación inválida' }))
                }

                const response = await fetch('https://api.anthropic.com/v1/messages', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': env.ANTHROPIC_API_KEY,
                    'anthropic-version': '2023-06-01',
                  },
                  body: JSON.stringify({
                    model: 'claude-haiku-4-5',
                    max_tokens: 1024,
                    system: systemPrompt(idioma),
                    messages: historial,
                  }),
                })

                const data = await response.json()
                const texto = data.content?.[0]?.text

                if (!response.ok || !texto) {
                  res.statusCode = response.ok ? 500 : response.status
                  return res.end(JSON.stringify({ error: data.error?.message || 'Respuesta vacía' }))
                }

                res.end(JSON.stringify({ respuesta: texto }))
              } catch (err) {
                res.statusCode = 500
                res.end(JSON.stringify({ error: err.message }))
              }
            })
          })
        },
      },
    ],
    server: {
      https: false,
      port: 5173,
    },
  }
})
