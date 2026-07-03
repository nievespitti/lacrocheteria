export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const { descripcion, nivel, materiales } = req.body

  if (!descripcion) {
    return res.status(400).json({ error: 'Falta la descripción' })
  }

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
[continúa vuelta por vuelta]

## Acabado

[instrucciones de montaje, cosido y detalles finales]

## Consejos

[2-3 consejos útiles adaptados al nivel ${nivel || 'Principiante'}]`

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
        messages: [{ role: 'user', content: prompt }],
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
