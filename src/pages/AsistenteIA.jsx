import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { guardarProyecto } from '../lib/proyectos'
import { supabase } from '../lib/supabase'
import './AsistenteIA.css'


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

export function PatronResultado({ texto }) {
  if (!texto) return null
  const lineas = texto.split('\n')
  return (
    <div className="patron__body">
      {lineas.map((linea, i) => <LineaPatron key={i} linea={linea} />)}
    </div>
  )
}

export default function AsistenteIA() {
  const { user } = useAuth()
  const { t, lang } = useLanguage()
  const niveles = t('asistente.niveles')
  const [descripcion, setDescripcion] = useState('')
  const [nivelIndex, setNivelIndex] = useState(0)
  const [materiales, setMateriales] = useState('')
  const [imagen, setImagen] = useState(null)
  const [fotoError, setFotoError] = useState('')
  const [estado, setEstado] = useState('idle') // idle | generando | ok | error
  const [patron, setPatron] = useState('')
  const [copiado, setCopiado] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [guardado, setGuardado] = useState(false)
  const [errorGuardar, setErrorGuardar] = useState(false)
  const [mostrarCorreccion, setMostrarCorreccion] = useState(false)
  const [correccion, setCorreccion] = useState('')
  const [corrigiendo, setCorrigiendo] = useState(false)
  const [errorCorregir, setErrorCorregir] = useState(false)
  const fotoInputRef = useRef(null)
  const nivel = niveles[nivelIndex]

  function cargarImagen(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 3 * 1024 * 1024) {
      setFotoError(t('asistente.fotoDemasiadoGrande'))
      e.target.value = ''
      return
    }
    setFotoError('')
    const reader = new FileReader()
    reader.onload = (ev) => setImagen(ev.target.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!user || (!descripcion.trim() && !imagen)) return
    setEstado('generando')
    setPatron('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Sesión no válida. Vuelve a iniciar sesión.')

      const res = await fetch('/api/patron', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ descripcion, nivel, materiales, idioma: lang, imagen }),
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

  async function corregir() {
    if (!correccion.trim() || corrigiendo) return
    setCorrigiendo(true)
    setErrorCorregir(false)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Sesión no válida. Vuelve a iniciar sesión.')

      const res = await fetch('/api/patron', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ descripcion, nivel, materiales, idioma: lang, imagen, patronAnterior: patron, correccion }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)

      setPatron(data.patron)
      setMostrarCorreccion(false)
      setCorreccion('')
      setGuardado(false)
    } catch (err) {
      console.error('Error al corregir patrón:', err)
      setErrorCorregir(true)
    } finally {
      setCorrigiendo(false)
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
    setImagen(null)
    setFotoError('')
    setGuardado(false)
    setMostrarCorreccion(false)
    setCorreccion('')
    setErrorCorregir(false)
  }

  async function guardar() {
    if (!user || guardando) return
    setGuardando(true)
    setErrorGuardar(false)
    try {
      const titulo = patron.match(/^##\s+(.+)/m)?.[1] || t('asistente.sinTitulo')
      const { error } = await guardarProyecto({
        userId: user.id,
        tipo: 'patron',
        titulo,
        contenido: { descripcion, nivel, materiales, patron },
      })
      if (error) throw error
      setGuardado(true)
    } catch (err) {
      console.error('Error al guardar patrón:', err)
      setErrorGuardar(true)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="asistente-page">

      <section className="asistente-hero">
        <div className="asistente-hero__inner">
          <span className="asistente-hero__eyebrow">{t('asistente.eyebrow')}</span>
          <h1 className="asistente-hero__title">{t('asistente.titulo')}</h1>
          <p className="asistente-hero__sub">
            {t('asistente.subtitulo')}
          </p>
        </div>
      </section>

      <section className="asistente-main">
        <div className="asistente-main__inner">

          <div className="asistente-aviso">
            <span className="asistente-aviso__icon">❋</span>
            <p>{t('asistente.avisoAprendizaje')}</p>
          </div>

          {!user && (
            <div className="asistente-login-required">
              <span className="asistente-login-required__icon">◈</span>
              <h2>{t('asistente.loginRequeridoTitulo')}</h2>
              <p>{t('asistente.loginRequeridoTexto')}</p>
              <Link to="/login" className="form-submit">{t('asistente.iniciarSesionBtn')}</Link>
            </div>
          )}

          {user && estado !== 'ok' && (
            <form className="asistente-form" onSubmit={handleSubmit}>
              <div className="form-field">
                <label className="form-label" htmlFor="descripcion">
                  {t('asistente.descripcionLabel')} {imagen && <span className="form-label__opt">{t('asistente.descripcionOpcionalConFoto')}</span>}
                </label>
                <textarea
                  id="descripcion"
                  className="form-textarea"
                  placeholder={t('asistente.descripcionPlaceholder')}
                  value={descripcion}
                  onChange={e => setDescripcion(e.target.value)}
                  rows={4}
                  required={!imagen}
                />
              </div>

              <div className="form-field">
                <label className="form-label">{t('asistente.nivelLabel')}</label>
                <div className="nivel-pills">
                  {niveles.map((n, i) => (
                    <button
                      key={n}
                      type="button"
                      className={`nivel-pill${nivelIndex === i ? ' nivel-pill--active' : ''}`}
                      onClick={() => setNivelIndex(i)}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="materiales">
                  {t('asistente.materialesLabel')} <span className="form-label__opt">{t('asistente.materialesOpcional')}</span>
                </label>
                <textarea
                  id="materiales"
                  className="form-textarea form-textarea--sm"
                  placeholder={t('asistente.materialesPlaceholder')}
                  value={materiales}
                  onChange={e => setMateriales(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  {t('asistente.fotoLabel')} <span className="form-label__opt">{t('asistente.fotoOpcional')}</span>
                </label>
                {imagen ? (
                  <div className="foto-preview">
                    <img src={imagen} alt="" className="foto-preview__img" />
                    <button type="button" className="foto-preview__remove" onClick={() => { setImagen(null); setFotoError('') }}>
                      {t('asistente.quitarFoto')}
                    </button>
                  </div>
                ) : (
                  <button type="button" className="foto-upload-btn" onClick={() => fotoInputRef.current.click()}>
                    {t('asistente.subirFoto')}
                  </button>
                )}
                <input
                  ref={fotoInputRef}
                  type="file"
                  accept="image/*"
                  className="file-hidden"
                  aria-label={t('asistente.fotoLabel')}
                  onChange={cargarImagen}
                />
                {fotoError && (
                  <p className="form-error">{fotoError}</p>
                )}
              </div>

              {estado === 'error' && (
                <p className="form-error">
                  {t('asistente.errorGenerico')}
                </p>
              )}

              <button
                type="submit"
                className="form-submit"
                disabled={estado === 'generando' || (!descripcion.trim() && !imagen)}
              >
                {estado === 'generando' ? (
                  <span className="form-submit__loading">
                    <span className="spinner" />
                    {t('asistente.generando')}
                  </span>
                ) : (
                  t('asistente.generarBtn')
                )}
              </button>
            </form>
          )}

          {estado === 'ok' && (
            <div className="patron">
              <div className="patron__actions">
                <button className="patron__btn patron__btn--download" onClick={descargar}>
                  {t('asistente.descargarBtn')}
                </button>
                <button className="patron__btn patron__btn--copy" onClick={copiar}>
                  {copiado ? t('asistente.copiado') : t('asistente.copiarBtn')}
                </button>
                {user ? (
                  <button
                    className="patron__btn patron__btn--save"
                    onClick={guardar}
                    disabled={guardando || guardado}
                  >
                    {guardado ? t('asistente.guardado') : guardando ? t('asistente.guardando') : t('asistente.guardarBtn')}
                  </button>
                ) : (
                  <Link to="/login" className="patron__btn patron__btn--save">
                    {t('asistente.iniciaSesionGuardar')}
                  </Link>
                )}
                <button className="patron__btn patron__btn--new" onClick={nueva}>
                  {t('asistente.nuevoBtn')}
                </button>
              </div>
              {errorGuardar && (
                <p className="form-error">
                  {t('asistente.errorGuardar')}
                </p>
              )}
              <PatronResultado texto={patron} />

              <div className="patron__feedback">
                {!mostrarCorreccion ? (
                  <button
                    type="button"
                    className="patron__btn patron__btn--corregir"
                    onClick={() => setMostrarCorreccion(true)}
                  >
                    {t('asistente.noEsCorrectoBtn')}
                  </button>
                ) : (
                  <div className="form-field">
                    <label className="form-label" htmlFor="correccion">
                      {t('asistente.correccionLabel')}
                    </label>
                    <textarea
                      id="correccion"
                      className="form-textarea form-textarea--sm"
                      placeholder={t('asistente.correccionPlaceholder')}
                      value={correccion}
                      onChange={e => setCorreccion(e.target.value)}
                      rows={3}
                    />
                    {errorCorregir && (
                      <p className="form-error">{t('asistente.errorCorregir')}</p>
                    )}
                    <button
                      type="button"
                      className="form-submit"
                      onClick={corregir}
                      disabled={!correccion.trim() || corrigiendo}
                    >
                      {corrigiendo ? (
                        <span className="form-submit__loading">
                          <span className="spinner" />
                          {t('asistente.corrigiendo')}
                        </span>
                      ) : (
                        t('asistente.corregirBtn')
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </section>

      {estado === 'idle' && (
        <section className="asistente-info">
          <div className="asistente-info__inner">
            <h2 className="asistente-info__title">{t('asistente.infoTitulo')}</h2>
            <div className="info-grid">
              <div className="info-card">
                <span className="info-card__icon">✦</span>
                <h3>{t('asistente.info1Titulo')}</h3>
                <p>{t('asistente.info1Texto')}</p>
              </div>
              <div className="info-card">
                <span className="info-card__icon">◈</span>
                <h3>{t('asistente.info2Titulo')}</h3>
                <p>{t('asistente.info2Texto')}</p>
              </div>
              <div className="info-card">
                <span className="info-card__icon">❋</span>
                <h3>{t('asistente.info3Titulo')}</h3>
                <p>{t('asistente.info3Texto')}</p>
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
