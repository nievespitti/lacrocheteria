import { Link } from 'react-router-dom'
import { niveles } from '../data/niveles'
import { useLanguage } from '../context/LanguageContext'
import './Aprender.css'

export default function Aprender() {
  const { t, lang } = useLanguage()

  return (
    <>
      <section className="page-hero page-hero--sage">
        <div className="container">
          <span className="aprender-hero__badge">{t('aprender.badge')}</span>
          <h1>{t('aprender.heroTitulo')}</h1>
          <p>{t('aprender.heroSubtitulo')}</p>
        </div>
      </section>

      <section className="section section--light">
        <div className="container">
          <div className="section__header">
            <h2>{t('aprender.eligeNivelTitulo')}</h2>
            <p>{t('aprender.eligeNivelSubtitulo')}</p>
          </div>
          {lang !== 'es' && (
            <p className="aprender-aviso-idioma">◈ {t('aprender.avisoIdioma')}</p>
          )}
          <div className="niveles-grid">
            {niveles.map(nivel => (
              <article key={nivel.id} className={`nivel-card nivel-card--${nivel.acento}`}>
                <span className="nivel-card__icono">{nivel.icono}</span>
                <h2 className="nivel-card__nombre">{nivel.nombre}</h2>
                <p className="nivel-card__descripcion">{nivel.descripcion}</p>
                <p className="nivel-card__count">
                  {nivel.lecciones.length} {t('aprender.lecciones')}
                </p>
                {nivel.disponible ? (
                  <Link
                    to={`/aprender/${nivel.id}/${nivel.lecciones[0].id}`}
                    className="nivel-card__btn nivel-card__btn--activo"
                  >
                    {t('aprender.comenzar')}
                  </Link>
                ) : (
                  <span className="nivel-card__btn nivel-card__btn--pronto">
                    {t('aprender.proximamente')}
                  </span>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--accent">
        <div className="container cta-block">
          <h2>{t('aprender.ctaTitulo')}</h2>
          <p>{t('aprender.ctaTexto')}</p>
          <Link to="/disenador" className="btn btn--ghost">{t('aprender.ctaBoton')}</Link>
        </div>
      </section>
    </>
  )
}
