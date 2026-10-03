import { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { guardarProyecto } from '../lib/proyectos'
import { supabase } from '../lib/supabase'
import { obtenerAnonId } from '../lib/anonId'
import Seo from '../components/Seo'
import './AsistenteIA.css'

// Códigos de error de /api/patron que bloquean el formulario e invitan a crear cuenta.
const CODIGOS_BLOQUEO = ['limite_anonimo', 'tope_anonimo', 'login_requerido']

// Mensaje a mostrar según el código de error (nunca el error técnico).
function claveError(codigo, porDefecto) {
  if (codigo === 'generador_descansando') return 'asistente.errorDescansando'
  if (codigo === 'limite_diario') return 'asistente.errorLimiteDiario'
  return porDefecto
}

// Llama a /api/patron con la sesión si la hay y, siempre, el identificador
// anónimo (el servidor solo lo usa si no hay sesión).
async function llamarApiPatron(body) {
  const { data: { session } } = await supabase.auth.getSession()
  const headers = { 'Content-Type': 'application/json' }
  if (session) headers.Authorization = `Bearer ${session.access_token}`

  const res = await fetch('/api/patron', {
    method: 'POST',
    headers,
    body: JSON.stringify({ ...body, anonId: obtenerAnonId() }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || `HTTP ${res.status}`)
    err.codigo = data.codigo
    throw err
  }
  return data
}

function IconoPulgar({ abajo }) {
  return (
    <svg
      className={`valoracion__icono${abajo ? ' valoracion__icono--abajo' : ''}`}
      viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    >
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  )
}

// Pulgar arriba/abajo + comentario opcional. Guarda en la fila de
// `generaciones` que creó el servidor, vía la función valorar_generacion.
function ValoracionPatron({ generacionId }) {
  const { t } = useLanguage()
  const [valoracion, setValoracion] = useState(null)
  const [comentario, setComentario] = useState('')
  const [comentarioEnviado, setComentarioEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(false)

  async function guardarValoracion(nuevaValoracion, texto) {
    setEnviando(true)
    setError(false)
    const { error: rpcError } = await supabase.rpc('valorar_generacion', {
      p_id: generacionId,
      p_valoracion: nuevaValoracion,
      p_comentario: texto || null,
    })
    setEnviando(false)
    if (rpcError) {
      console.error('Error al valorar el patrón:', rpcError)
      setError(true)
      return false
    }
    return true
  }

  async function votar(nuevaValoracion) {
    const anterior = valoracion
    setValoracion(nuevaValoracion)
    setComentarioEnviado(false)
    if (!(await guardarValoracion(nuevaValoracion, comentario.trim()))) setValoracion(anterior)
  }

  async function enviarComentario() {
    if (await guardarValoracion(valoracion, comentario.trim())) setComentarioEnviado(true)
  }

  return (
    <div className="valoracion">
      <p className="valoracion__pregunta">{t('asistente.valoracionPregunta')}</p>
      <div className="valoracion__botones">
        <button
          type="button"
          className={`valoracion__btn${valoracion === 'positiva' ? ' valoracion__btn--activo' : ''}`}
          aria-pressed={valoracion === 'positiva'}
          onClick={() => votar('positiva')}
          disabled={enviando}
        >
          <IconoPulgar /> {t('asistente.valoracionSi')}
        </button>
        <button
          type="button"
          className={`valoracion__btn${valoracion === 'negativa' ? ' valoracion__btn--activo' : ''}`}
          aria-pressed={valoracion === 'negativa'}
          onClick={() => votar('negativa')}
          disabled={enviando}
        >
          <IconoPulgar abajo /> {t('asistente.valoracionNo')}
        </button>
      </div>

      {valoracion && !comentarioEnviado && (
        <div className="form-field valoracion__comentario">
          <label className="form-label" htmlFor="valoracion-comentario">
            {t('asistente.valoracionComentarioLabel')} <span className="form-label__opt">{t('asistente.materialesOpcional')}</span>
          </label>
          <textarea
            id="valoracion-comentario"
            className="form-textarea form-textarea--sm"
            placeholder={t('asistente.valoracionComentarioPlaceholder')}
            value={comentario}
            onChange={e => setComentario(e.target.value)}
            maxLength={1000}
            rows={2}
          />
          <button
            type="button"
            className="patron__btn patron__btn--new"
            onClick={enviarComentario}
            disabled={!comentario.trim() || enviando}
          >
            {t('asistente.valoracionEnviarComentario')}
          </button>
        </div>
      )}

      {valoracion && (
        <p className="valoracion__gracias">
          {comentarioEnviado ? t('asistente.valoracionComentarioGracias') : t('asistente.valoracionGracias')}
        </p>
      )}
      {error && <p className="form-error">{t('asistente.valoracionError')}</p>}
    </div>
  )
}


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

const MAX_FOTOS = 3

export default function AsistenteIA() {
  const { user } = useAuth()
  const { t, lang } = useLanguage()
  const location = useLocation()
  const niveles = t('asistente.niveles')
  // Texto que llega precargado desde el generador de la Home.
  const [descripcion, setDescripcion] = useState(location.state?.descripcion || '')
  const [nivelIndex, setNivelIndex] = useState(0)
  const [materiales, setMateriales] = useState('')
  const [imagenes, setImagenes] = useState([])
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
  const [errorCorregir, setErrorCorregir] = useState('') // '' o código de error
  const [errorCodigo, setErrorCodigo] = useState('')
  const [generacionId, setGeneracionId] = useState(null)
  const [restantes, setRestantes] = useState(null) // generaciones gratis que le quedan sin cuenta
  const [bloqueo, setBloqueo] = useState(null) // uno de CODIGOS_BLOQUEO
  const fotoInputRef = useRef(null)
  const nivel = niveles[nivelIndex]
  // Al iniciar sesión desaparece el bloqueo de visitante.
  const bloqueoActivo = !user && bloqueo

  function cargarImagen(e) {
    const file = e.target.files[0]
    if (!file) return
    if (imagenes.length >= MAX_FOTOS) {
      setFotoError(t('asistente.fotoLimiteAlcanzado'))
      e.target.value = ''
      return
    }
    if (file.size > 3 * 1024 * 1024) {
      setFotoError(t('asistente.fotoDemasiadoGrande'))
      e.target.value = ''
      return
    }
    setFotoError('')
    const reader = new FileReader()
    reader.onload = (ev) => setImagenes((prev) => [...prev, ev.target.result])
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function quitarImagen(index) {
    setImagenes((prev) => prev.filter((_, i) => i !== index))
    setFotoError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!descripcion.trim() && imagenes.length === 0) return
    setEstado('generando')
    setPatron('')
    setErrorCodigo('')

    try {
      const data = await llamarApiPatron({ descripcion, nivel, materiales, idioma: lang, imagenes })
      setPatron(data.patron)
      setGeneracionId(data.generacionId || null)
      if (typeof data.restantes === 'number') setRestantes(data.restantes)
      setEstado('ok')
    } catch (err) {
      console.error('Error asistente:', err)
      if (CODIGOS_BLOQUEO.includes(err.codigo)) {
        setBloqueo(err.codigo)
        setEstado('idle')
        return
      }
      setErrorCodigo(err.codigo || '')
      setEstado('error')
    }
  }

  async function corregir() {
    if (!correccion.trim() || corrigiendo) return
    setCorrigiendo(true)
    setErrorCorregir('')

    try {
      const data = await llamarApiPatron({ descripcion, nivel, materiales, idioma: lang, imagenes, patronAnterior: patron, correccion })
      setPatron(data.patron)
      setGeneracionId(data.generacionId || null)
      setMostrarCorreccion(false)
      setCorreccion('')
      setGuardado(false)
    } catch (err) {
      console.error('Error al corregir patrón:', err)
      setErrorCorregir(err.codigo || 'error')
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
    setImagenes([])
    setFotoError('')
    setGuardado(false)
    setMostrarCorreccion(false)
    setCorreccion('')
    setErrorCorregir('')
    setErrorCodigo('')
    setGeneracionId(null)
    // Sin cuenta y sin generaciones gratis: directamente la invitación a registrarse.
    if (!user && restantes === 0) setBloqueo('limite_anonimo')
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
      <Seo titulo={t('seo.asistente.titulo')} descripcion={t('seo.asistente.descripcion')} />

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

          {bloqueoActivo && (
            <div className="asistente-login-required">
              <span className="asistente-login-required__icon">◈</span>
              <h2>
                {bloqueo === 'limite_anonimo' ? t('asistente.limiteAnonimoTitulo')
                  : bloqueo === 'tope_anonimo' ? t('asistente.topeAnonimoTitulo')
                  : t('asistente.loginRequeridoTitulo')}
              </h2>
              <p>
                {bloqueo === 'limite_anonimo' ? t('asistente.limiteAnonimoTexto')
                  : bloqueo === 'tope_anonimo' ? t('asistente.topeAnonimoTexto')
                  : t('asistente.loginRequeridoTexto')}
              </p>
              <div className="asistente-login-required__acciones">
                <Link to="/registro" className="form-submit">{t('asistente.crearCuentaBtn')}</Link>
                <Link to="/login" className="asistente-login-required__link">{t('asistente.iniciarSesionBtn')}</Link>
              </div>
            </div>
          )}

          {!user && !bloqueoActivo && estado !== 'ok' && (
            <p className="asistente-gratis">
              <span className="asistente-gratis__icon">✦</span>
              {restantes === 1 ? t('asistente.quedaUnoGratis') : t('asistente.avisoGratis')}
            </p>
          )}

          {!bloqueoActivo && estado !== 'ok' && (
            <form className="asistente-form" onSubmit={handleSubmit}>
              <div className="form-field">
                <label className="form-label" htmlFor="descripcion">
                  {t('asistente.descripcionLabel')} {imagenes.length > 0 && <span className="form-label__opt">{t('asistente.descripcionOpcionalConFoto')}</span>}
                </label>
                <textarea
                  id="descripcion"
                  className="form-textarea"
                  placeholder={t('asistente.descripcionPlaceholder')}
                  value={descripcion}
                  onChange={e => setDescripcion(e.target.value)}
                  rows={4}
                  required={imagenes.length === 0}
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
                  {t('asistente.fotoLabel')} <span className="form-label__opt">{t('asistente.fotoOpcionalMultiple')}</span>
                </label>
                {imagenes.length > 0 && (
                  <div className="foto-preview-galeria">
                    {imagenes.map((img, i) => (
                      <div className="foto-preview" key={i}>
                        <img src={img} alt="" className="foto-preview__img" />
                        <button type="button" className="foto-preview__remove" onClick={() => quitarImagen(i)}>
                          {t('asistente.quitarFoto')}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {imagenes.length < MAX_FOTOS && (
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
                  {t(claveError(errorCodigo, 'asistente.errorGenerico'))}
                </p>
              )}

              <button
                type="submit"
                className="form-submit"
                disabled={estado === 'generando' || (!descripcion.trim() && imagenes.length === 0)}
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

              {!user && restantes !== null && (
                <p className="asistente-gratis asistente-gratis--resultado">
                  <span className="asistente-gratis__icon">✦</span>
                  {restantes === 1 ? t('asistente.quedaUnoGratis') : t('asistente.sinGratisRestantes')}{' '}
                  {restantes === 0 && <Link to="/registro">{t('asistente.crearCuentaBtn')}</Link>}
                </p>
              )}

              <div className="patron__feedback">
                {generacionId && <ValoracionPatron key={generacionId} generacionId={generacionId} />}

                {!user ? (
                  <Link to="/registro" className="patron__btn patron__btn--corregir">
                    {t('asistente.corregirRequiereCuenta')}
                  </Link>
                ) : !mostrarCorreccion ? (
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
                      <p className="form-error">{t(claveError(errorCorregir, 'asistente.errorCorregir'))}</p>
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

              {/* Repetido al final: tras leer el patrón la usuaria está abajo del todo. */}
              <div className="patron__final">
                <button className="patron__btn patron__btn--new" onClick={() => { nueva(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                  {t('asistente.nuevoBtn')}
                </button>
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
