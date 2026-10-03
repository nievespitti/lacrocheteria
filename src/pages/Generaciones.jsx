import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { listarGeneraciones } from '../lib/generaciones'
import Seo from '../components/Seo'
import './Generaciones.css'

const EMAIL_ADMIN = 'nievesgarciapitti@gmail.com'
const PERIODOS = [7, 30, 'todo']
const UMBRAL_ABUSO = 4 // más de 4 patrones sin cuenta desde la misma IP cifrada

function porcentaje(parte, total) {
  return total ? Math.round((parte / total) * 100) : 0
}

function formatearFecha(iso, lang) {
  return new Date(iso).toLocaleString(lang === 'en' ? 'en-GB' : 'es-ES', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })
}

function calcularResumen(items) {
  const valorados = items.filter(g => g.valoracion)
  const positivas = valorados.filter(g => g.valoracion === 'positiva').length

  // IPs cifradas con muchas generaciones sin cuenta (solo para detectar abuso)
  const porIp = {}
  for (const g of items) {
    if (!g.user_id && g.ip_hash) porIp[g.ip_hash] = (porIp[g.ip_hash] || 0) + 1
  }
  const sospechosas = Object.entries(porIp)
    .filter(([, n]) => n > UMBRAL_ABUSO)
    .sort((a, b) => b[1] - a[1])

  return {
    total: items.length,
    correcciones: items.filter(g => g.es_correccion).length,
    valorados: valorados.length,
    positivas,
    sinCuenta: items.filter(g => !g.user_id).length,
    conFoto: items.filter(g => g.tipo === 'imagen').length,
    sospechosas,
  }
}

function Etiqueta({ tipo, children }) {
  return <span className={`gen-etiqueta gen-etiqueta--${tipo}`}>{children}</span>
}

export default function Generaciones() {
  const { user, loading: authLoading } = useAuth()
  const { t, lang } = useLanguage()
  const [periodo, setPeriodo] = useState(30)
  const [items, setItems] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(false)

  const esAdmin = user?.email === EMAIL_ADMIN

  useEffect(() => {
    if (!esAdmin) {
      setCargando(false)
      return
    }
    setCargando(true)
    setError(false)
    listarGeneraciones(periodo === 'todo' ? null : periodo)
      .then(({ data, error: errorConsulta }) => {
        if (errorConsulta) throw errorConsulta
        setItems(data || [])
      })
      .catch(err => {
        console.error('Error al listar generaciones:', err)
        setError(true)
      })
      .finally(() => setCargando(false))
  }, [esAdmin, periodo])

  const r = calcularResumen(items)

  return (
    <div className="generaciones-page">
      <Seo titulo={t('seo.generaciones.titulo')} descripcion={t('seo.generaciones.descripcion')} noindex />
      <div className="page-hero page-hero--terracota">
        <div className="container">
          <h1>{t('generaciones.heroTitulo')}</h1>
          <p>{t('generaciones.heroSubtitulo')}</p>
          {esAdmin && (
            <Link to="/admin/correcciones" className="gen-enlace-admin">{t('generaciones.verCorrecciones')}</Link>
          )}
        </div>
      </div>

      <section className="section">
        <div className="container">
          {!authLoading && !esAdmin && (
            <p className="mis-proyectos-empty">{t('generaciones.noAutorizado')}</p>
          )}

          {esAdmin && (
            <>
              <div className="gen-periodo" role="group" aria-label={t('generaciones.periodoLabel')}>
                {PERIODOS.map(p => (
                  <button
                    key={p}
                    type="button"
                    className={`gen-periodo__btn${periodo === p ? ' gen-periodo__btn--activo' : ''}`}
                    aria-pressed={periodo === p}
                    onClick={() => setPeriodo(p)}
                  >
                    {t(`generaciones.periodos.${p}`)}
                  </button>
                ))}
              </div>

              {error && <p className="form-error">{t('generaciones.error')}</p>}

              {!cargando && !error && r.total === 0 && (
                <p className="mis-proyectos-empty">{t('generaciones.vacio')}</p>
              )}

              {!cargando && !error && r.total > 0 && (
                <>
                  <div className="gen-stats">
                    <div className="gen-stat">
                      <span className="gen-stat__valor">{r.total}</span>
                      <span className="gen-stat__label">{t('generaciones.statGenerados')}</span>
                      <span className="gen-stat__nota">{r.correcciones} {t('generaciones.statCorrecciones')}</span>
                    </div>
                    <div className="gen-stat">
                      <span className="gen-stat__valor">{porcentaje(r.valorados, r.total)}%</span>
                      <span className="gen-stat__label">{t('generaciones.statValorados')}</span>
                      <span className="gen-stat__nota">{r.valorados} / {r.total}</span>
                    </div>
                    <div className="gen-stat gen-stat--destacado">
                      <span className="gen-stat__valor">{r.valorados ? `${porcentaje(r.positivas, r.valorados)}%` : '—'}</span>
                      <span className="gen-stat__label">{t('generaciones.statConvencen')}</span>
                      <span className="gen-stat__nota">{r.positivas} / {r.valorados} {t('generaciones.statSobreValorados')}</span>
                    </div>
                    <div className="gen-stat">
                      <span className="gen-stat__valor">{porcentaje(r.sinCuenta, r.total)}%</span>
                      <span className="gen-stat__label">{t('generaciones.statSinCuenta')}</span>
                      <span className="gen-stat__nota">{t('generaciones.statConFoto')}: {r.conFoto}</span>
                    </div>
                  </div>

                  <h2 className="gen-titulo">{t('generaciones.ultimosTitulo')}</h2>
                  <ul className="gen-lista">
                    {items.slice(0, 50).map(g => (
                      <li key={g.id} className="gen-item">
                        <div className="gen-item__cabecera">
                          <span className="gen-item__fecha">{formatearFecha(g.created_at, lang)}</span>
                          <span className="gen-item__etiquetas">
                            {g.valoracion === 'positiva' && <Etiqueta tipo="si">{t('generaciones.etiquetaSi')}</Etiqueta>}
                            {g.valoracion === 'negativa' && <Etiqueta tipo="no">{t('generaciones.etiquetaNo')}</Etiqueta>}
                            {!g.valoracion && <Etiqueta tipo="neutra">{t('generaciones.etiquetaSinValorar')}</Etiqueta>}
                            {g.es_correccion && <Etiqueta tipo="neutra">{t('generaciones.etiquetaCorreccion')}</Etiqueta>}
                            {g.tipo === 'imagen' && <Etiqueta tipo="neutra">{t('generaciones.etiquetaFoto')}</Etiqueta>}
                            <Etiqueta tipo="neutra">{g.user_id ? t('generaciones.etiquetaCuenta') : t('generaciones.etiquetaAnonima')}</Etiqueta>
                          </span>
                        </div>
                        <p className="gen-item__prompt">{g.prompt || t('generaciones.sinPrompt')}</p>
                        {g.comentario && <p className="gen-item__comentario">“{g.comentario}”</p>}
                      </li>
                    ))}
                  </ul>
                  {items.length > 50 && <p className="gen-nota">{t('generaciones.mostrandoUltimos')}</p>}

                  <h2 className="gen-titulo">{t('generaciones.abusoTitulo')}</h2>
                  <p className="gen-nota">{t('generaciones.abusoTexto')}</p>
                  {r.sospechosas.length === 0 ? (
                    <p className="gen-nota">{t('generaciones.abusoNinguno')}</p>
                  ) : (
                    <ul className="gen-abuso">
                      {r.sospechosas.map(([hash, n]) => (
                        <li key={hash}><code>{hash.slice(0, 10)}…</code> — {n} {t('generaciones.abusoPatrones')}</li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
