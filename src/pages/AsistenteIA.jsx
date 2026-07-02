import { useState } from 'react'
import './AsistenteIA.css'

const NIVELES = ['Principiante', 'Intermedia', 'Avanzada']


function LineaPatron({ linea }) {
  if (linea.startsWith('## ')) {
    return <h3 className="patron__h3">{linea.slice(3)}</h3>
  }
  if (linea.startsWith('### ')) {
    return <h4 className="patron__h4">{linea.slice(4)}</h4>
  }
  if (linea === '') {
    return <div className="patron__gap" />
  }

  const partes = linea.split(/(\*\*[^*]+\*\*)/)
  const contenido = partes.map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i}>{p.slice(2, -2)}</strong>
      : p
  )

  if (linea.startsWith('- ') || linea.match(/^\d+\./)) {
    return <li className="patron__li">{contenido}</li>
  }
  return <p className="patron__p">{contenido}</p>
}

function PatronResultado({ texto }) {
  if (!texto) return null
  const lineas = texto.split('\n')
  return (
    <div className="patron__body">
      {lineas.map((linea, i) => <LineaPatron key={i} linea={linea} />)}
    </div>
  )
}

export default function AsistenteIA() {
  const [descripcion, setDescripcion] = useState('')
  const [nivel, setNivel] = useState('Principiante')
  const [materiales, setMateriales] = useState('')
  const [estado, setEstado] = useState('idle') // idle | generando | ok | error
  const [patron, setPatron] = useState('')
  const [copiado, setCopiado] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!descripcion.trim()) return
    setEstado('generando')
    setPatron('')

    try {
      const res = await fetch('/api/patron', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcion, nivel, materiales }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)

      setPatron(data.patron)
      setEstado('ok')
    } catch (err) {
      console.error('Error asistente:', err)
      setEstado('error')
    }
  }

  function copiar() {
    navigator.clipboard.writeText(patron)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  function descargar() {
    const titulo = patron.match(/^##\s+(.+)/m)?.[1] || 'patron-crochet'
    const nombreArchivo = titulo.toLowerCase().replace(/[^a-z0-9áéíóúñ\s]/g, '').replace(/\s+/g, '-') + '.txt'
    const blob = new Blob([patron], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = nombreArchivo
    a.click()
    URL.revokeObjectURL(url)
  }

  function nueva() {
    setEstado('idle')
    setPatron('')
    setDescripcion('')
    setMateriales('')
  }

  return (
    <div className="asistente-page">

      <section className="asistente-hero">
        <div className="asistente-hero__inner">
          <span className="asistente-hero__eyebrow">✦ Inteligencia Artificial</span>
          <h1 className="asistente-hero__title">Asistente de Patrones</h1>
          <p className="asistente-hero__sub">
            Describe lo que quieres crear y la IA generará un patrón completo adaptado a tu nivel y materiales.
          </p>
        </div>
      </section>

      <section className="asistente-main">
        <div className="asistente-main__inner">

          {estado !== 'ok' && (
            <form className="asistente-form" onSubmit={handleSubmit}>
              <div className="form-field">
                <label className="form-label" htmlFor="descripcion">
                  ¿Qué quieres crear?
                </label>
                <textarea
                  id="descripcion"
                  className="form-textarea"
                  placeholder="Ej: Un amigurumi de conejo pequeño con orejas largas, estilo tierno, para regalar a una niña de 3 años."
                  value={descripcion}
                  onChange={e => setDescripcion(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label">Tu nivel</label>
                <div className="nivel-pills">
                  {NIVELES.map(n => (
                    <button
                      key={n}
                      type="button"
                      className={`nivel-pill${nivel === n ? ' nivel-pill--active' : ''}`}
                      onClick={() => setNivel(n)}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="materiales">
                  Materiales disponibles <span className="form-label__opt">(opcional)</span>
                </label>
                <textarea
                  id="materiales"
                  className="form-textarea form-textarea--sm"
                  placeholder="Ej: Lana de algodón amigurumi color crema y rosa, aguja de 2,5 mm, relleno de fibra, ojos de seguridad 6 mm."
                  value={materiales}
                  onChange={e => setMateriales(e.target.value)}
                  rows={2}
                />
              </div>

              {estado === 'error' && (
                <p className="form-error">
                  ◈ Algo salió mal. Comprueba que la clave de API esté configurada e inténtalo de nuevo.
                </p>
              )}

              <button
                type="submit"
                className="form-submit"
                disabled={estado === 'generando' || !descripcion.trim()}
              >
                {estado === 'generando' ? (
                  <span className="form-submit__loading">
                    <span className="spinner" />
                    Generando patrón…
                  </span>
                ) : (
                  '✦ Generar patrón'
                )}
              </button>
            </form>
          )}

          {estado === 'ok' && (
            <div className="patron">
              <div className="patron__actions">
                <button className="patron__btn patron__btn--download" onClick={descargar}>
                  ↓ Descargar .txt
                </button>
                <button className="patron__btn patron__btn--copy" onClick={copiar}>
                  {copiado ? '✓ Copiado' : '◈ Copiar'}
                </button>
                <button className="patron__btn patron__btn--new" onClick={nueva}>
                  ✦ Nuevo patrón
                </button>
              </div>
              <PatronResultado texto={patron} />
            </div>
          )}

        </div>
      </section>

      {estado === 'idle' && (
        <section className="asistente-info">
          <div className="asistente-info__inner">
            <h2 className="asistente-info__title">¿Qué puede hacer el asistente?</h2>
            <div className="info-grid">
              <div className="info-card">
                <span className="info-card__icon">✦</span>
                <h3>Cualquier proyecto</h3>
                <p>Amigurumis, bolsos, prendas, accesorios, hogar… describe lo que imaginas.</p>
              </div>
              <div className="info-card">
                <span className="info-card__icon">◈</span>
                <h3>Adaptado a ti</h3>
                <p>Las instrucciones se ajustan a tu nivel: más detalladas para principiantes, más técnicas para avanzadas.</p>
              </div>
              <div className="info-card">
                <span className="info-card__icon">❋</span>
                <h3>Con tus materiales</h3>
                <p>Indica la lana y aguja que tienes y el patrón se calculará para ellos.</p>
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
