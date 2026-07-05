import { systemPrompt } from './chatSystemPrompt.js'

const MAX_MENSAJES = 20

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const { mensajes, idioma } = req.body

  if (!Array.isArray(mensajes) || mensajes.length === 0) {
    return res.status(400).json({ error: 'Falta la conversación' })
  }

  const historial = mensajes
    .slice(-MAX_MENSAJES)
    .filter((m) => m && typeof m.content === 'string' && (m.role === 'user' || m.role === 'assistant'))
    .map((m) => ({ role: m.role, content: m.content }))

  if (historial.length === 0) {
    return res.status(400).json({ error: 'Conversación inválida' })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
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

    if (!response.ok) {
      console.error('Anthropic error:', data)
      return res.status(response.status).json({ error: data.error?.message || 'Error de API' })
    }

    const texto = data.content?.[0]?.text
    if (!texto) return res.status(500).json({ error: 'Respuesta vacía' })

    res.status(200).json({ respuesta: texto })
  } catch (err) {
    console.error('Handler error:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}
