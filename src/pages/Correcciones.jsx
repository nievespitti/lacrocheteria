import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { listarCorrecciones, borrarCorreccion } from '../lib/correcciones'
import { PatronResultado } from './AsistenteIA'
import './Correcciones.css'

const EMAIL_ADMIN = 'nievesgarciapitti@gmail.com'

function formatearFecha(iso, lang) {
  return new Date(iso).toLocaleDateString(lang === 'en' ? 'en-GB' : 'es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

function TarjetaCorreccion({ item, onBorrar, t, lang }) {
  const [abierto, setAbierto] = useState(false)
  return (
    <div className="proyecto-card">
      <div className="proyecto-card__header">
        <div>
          <h3 className="proyecto-card__title">{item.descripcion || t('correcciones.descripcionLabel')}</h3>
          <p className="proyecto-card__meta">
            {t('correcciones.nivelLabel')} {item.nivel} · {formatearFecha(item.created_at, lang)}
            {item.tenia_foto && <> · {t('correcciones.conFoto')}</>}
          </p>
        </div>
        <div className="proyecto-card__actions">
          <button className="proyecto-btn" onClick={() => setAbierto(v => !v)}>
            {abierto ? t('correcciones.ocultar') : t('correcciones.verDetalle')}
          </button>
          <button className="proyecto-btn proyecto-btn--danger" onClick={() => onBorrar(item.id)}>
            {t('correcciones.eliminar')}
          </button>
        </div>
      </div>

      {item.materiales && (
        <p className="correccion-materiales">{t('correcciones.materialesLabel')}: {item.materiales}</p>
      )}

      <div className="correccion-texto">
        <span className="correccion-texto__label">{t('correcciones.correccionLabel')}</span>
        <p>{item.correccion}</p>
      </div>

      {abierto && (
        <div className="proyecto-card__body correccion-detalle">
          <div>
            <h4 className="correccion-detalle__titulo">{t('correcciones.patronAnteriorTitulo')}</h4>
            <PatronResultado texto={item.patron_anterior} />
          </div>
          <div>
            <h4 className="correccion-detalle__titulo">{t('correcciones.patronCorregidoTitulo')}</h4>
            <PatronResultado texto={item.patron_corregido} />
          </div>
        </div>
      )}
    </div>
  )
}

export default function Correcciones() {
  const { user, loading: authLoading } = useAuth()
  const { t, lang } = useLanguage()
  const [items, setItems] = useState([])
  const [cargando, setCargando] = useState(true)

  const esAdmin = user?.email === EMAIL_ADMIN

  useEffect(() => {
    if (!esAdmin) {
      setCargando(false)
      return
    }
    listarCorrecciones().then(({ data }) => {
      setItems(data || [])
      setCargando(false)
    }).catch(err => {
      console.error('Error al listar correcciones:', err)
      setCargando(false)
    })
  }, [esAdmin])

  async function handleBorrar(id) {
    if (!window.confirm(t('correcciones.confirmEliminar'))) return
    try {
      await borrarCorreccion(id)
      setItems(prev => prev.filter(i => i.id !== id))
    } catch (err) {
      console.error('Error al borrar corrección:', err)
    }
  }

  return (
    <div className="correcciones-page">
      <div className="page-hero page-hero--terracota">
        <div className="container">
          <h1>{t('correcciones.heroTitulo')}</h1>
          <p>{t('correcciones.heroSubtitulo')}</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {!authLoading && !esAdmin && (
            <p className="mis-proyectos-empty">{t('correcciones.noAutorizado')}</p>
          )}

          {esAdmin && !cargando && items.length === 0 && (
            <p className="mis-proyectos-empty">{t('correcciones.vacio')}</p>
          )}

          {esAdmin && items.length > 0 && (
            <div className="proyecto-list">
              {items.map(item => (
                <TarjetaCorreccion key={item.id} item={item} onBorrar={handleBorrar} t={t} lang={lang} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
