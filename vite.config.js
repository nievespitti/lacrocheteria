import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

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
                const { descripcion, nivel, materiales } = JSON.parse(
                  Buffer.concat(chunks).toString()
                )

                const prompt = `Eres experta en crochet. Genera un patrón completo en español para:

PROYECTO: ${descripcion}
NIVEL: ${nivel || 'Principiante'}
MATERIALES DISPONIBLES: ${materiales || 'los habituales para este tipo de proyecto'}

Responde SOLO con el patrón, con este formato exacto (sin introducción ni despedida):

## [Nombre del proyecto]

**Dificultad:** ${nivel || 'Principiante'}
**Tiempo estimado:** [tiempo aproximado]
**Medida aproximada:** [medida final]

## Materiales

- [lista de materiales exactos]

## Abreviaturas

- [abreviatura]: [nombre completo]

## Instrucciones

**Vuelta 1:** [instrucciones con conteo exacto de puntos]
**Vuelta 2:** [instrucciones]

## Acabado

[instrucciones de montaje, cosido y detalles finales]

## Consejos

[2-3 consejos adaptados al nivel ${nivel || 'Principiante'}]`

                const apiKey = env.ANTHROPIC_API_KEY

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
                    messages: [{ role: 'user', content: prompt }],
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
    ],
    server: {
      https: false,
      port: 5173,
    },
  }
})
