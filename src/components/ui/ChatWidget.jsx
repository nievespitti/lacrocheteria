import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import './ChatWidget.css'

export default function ChatWidget() {
  const { t, lang } = useLanguage()
  const [abierto, setAbierto] = useState(false)
  const [mensajes, setMensajes] = useState([])
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(false)
  const finRef = useRef(null)

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes, enviando])

  async function enviar(e) {
    e.preventDefault()
    const contenido = texto.trim()
    if (!contenido || enviando) return

    const historial = [...mensajes, { role: 'user', content: contenido }]
    setMensajes(historial)
    setTexto('')
    setEnviando(true)
    setError(false)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensajes: historial, idioma: lang }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)

      setMensajes([...historial, { role: 'assistant', content: data.respuesta }])
    } catch (err) {
      console.error('Error chat widget:', err)
      setError(true)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="chat-widget">
      {abierto && (
        <div className="chat-widget__panel">
          <div className="chat-widget__header">
            <span>{t('chat.titulo')}</span>
            <button
              className="chat-widget__close"
              onClick={() => setAbierto(false)}
              aria-label={t('chat.cerrar')}
            >
              ✕
            </button>
          </div>

          <div className="chat-widget__body">
            <div className="chat-widget__msg chat-widget__msg--bot">
              {t('chat.bienvenida')}
            </div>
            {mensajes.map((m, i) => (
              <div key={i} className={`chat-widget__msg chat-widget__msg--${m.role === 'user' ? 'user' : 'bot'}`}>
                {m.content}
              </div>
            ))}
            {enviando && (
              <div className="chat-widget__msg chat-widget__msg--bot chat-widget__msg--pensando">
                {t('chat.pensando')}
              </div>
            )}
            {error && (
              <div className="chat-widget__msg chat-widget__msg--error">
                {t('chat.error')}
              </div>
            )}
            <div ref={finRef} />
          </div>

          <form className="chat-widget__form" onSubmit={enviar}>
            <input
              type="text"
              className="chat-widget__input"
              placeholder={t('chat.placeholder')}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              disabled={enviando}
            />
            <button type="submit" className="chat-widget__send" disabled={enviando || !texto.trim()}>
              {t('chat.enviar')}
            </button>
          </form>
        </div>
      )}

      <button
        className="chat-widget__bubble"
        onClick={() => setAbierto((v) => !v)}
        aria-label={t('chat.burbujaLabel')}
      >
        {abierto ? '✕' : <img src="/favicon-32.png" alt="" className="chat-widget__bubble-icon" />}
      </button>
    </div>
  )
}
