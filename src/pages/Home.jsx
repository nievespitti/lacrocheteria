import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Seo, { DOMINIO } from '../components/Seo'
import { useLanguage } from '../context/LanguageContext'
import { galeriaProyectos } from '../i18n/translations'
import './Home.css'

// Acceso directo al Asistente (/asistente): no genera aquí, solo lleva el
// texto precargado al formulario del Asistente, que es quien genera.
function GeneradorRapido() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [descripcion, setDescripcion] = useState('')

  function enviar(e) {
    e.preventDefault()
    if (!descripcion.trim()) return
    navigate('/asistente', { state: { descripcion: descripcion.trim() } })
  }

  return (
    <section className="generador-rapido">
      <div className="container generador-rapido__inner">
        <span className="generador-rapido__eyebrow">{t('home.generadorEyebrow')}</span>
        {/* Único h1 de la Home, con palabra clave ("patrones de crochet") para SEO. */}
        <h1 className="generador-rapido__titulo">{t('home.generadorTitulo')}</h1>
        <p className="generador-rapido__pregunta">{t('home.generadorPregunta')}</p>
        <form className="generador-rapido__form" onSubmit={enviar}>
          <textarea
            className="generador-rapido__campo"
            placeholder={t('home.generadorPlaceholder')}
            aria-label={t('home.generadorPlaceholder')}
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            maxLength={2000}
            rows={3}
          />
          <div className="generador-rapido__ejemplos">
            <span className="generador-rapido__ejemplos-label">{t('home.generadorEjemplosLabel')}</span>
            {t('home.generadorEjemplos').map(ejemplo => (
              <button
                key={ejemplo.label}
                type="button"
                className="generador-rapido__ejemplo"
                onClick={() => setDescripcion(ejemplo.texto)}
              >
                {ejemplo.label}
              </button>
            ))}
          </div>
          <div className="generador-rapido__acciones">
            <button type="submit" className="generador-rapido__btn" disabled={!descripcion.trim()}>
              {t('home.generadorBtn')}
            </button>
            <span className="generador-rapido__nota">{t('home.generadorNota')}</span>
          </div>
        </form>
      </div>
    </section>
  )
}

export default function Home() {
  const { t, lang } = useLanguage()

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'La CrocheterIA',
      url: DOMINIO,
      logo: `${DOMINIO}/logo3d_final.jpg`,
      description: t('seo.home.descripcion'),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'La CrocheterIA',
      url: DOMINIO,
    },
  ]

  const servicios = [
    { icon: '✦', titulo: t('home.servicio1Titulo'), descripcion: t('home.servicio1Desc'), acento: 'terracota' },
    { icon: '◈', titulo: t('home.servicio2Titulo'), descripcion: t('home.servicio2Desc'), acento: 'sage' },
    { icon: '❋', titulo: t('home.servicio3Titulo'), descripcion: t('home.servicio3Desc'), acento: 'linen' },
  ]

  // Solo piezas con foto real (los títulos salen de galeriaProyectos, igual que en /galeria).
  const galeriaPreview = [
    { id: 'ropa-004', categoria: t('categorias.Ropa'), imagen: '/galeria/ropa/ropa_04.png' },
    { id: 'bolso-002', categoria: t('categorias.Accesorios'), imagen: '/galeria/accesorios/bolso_002.png' },
    { id: 'ropa-001', categoria: t('categorias.Ropa'), imagen: '/galeria/ropa/ropa_01.png' },
    { id: 'bolso-005', categoria: t('categorias.Accesorios'), imagen: '/galeria/accesorios/bolso_005.png' },
  ].map(p => ({ ...p, titulo: (galeriaProyectos[lang][p.id] || galeriaProyectos.es[p.id]).titulo }))

  return (
    <>
      <Seo titulo={t('seo.home.titulo')} descripcion={t('seo.home.descripcion')} jsonLd={jsonLd} />
      {/* GENERADOR (lo primero que ve el visitante) */}
      <GeneradorRapido />

      {/* HERO */}
      <section className="hero">
        <div className="container hero__inner">
          <img src="/logo3d_final.jpg" alt="La CrocheterIA" className="hero__logo" width="960" height="627" />
          <span className="hero__badge">{t('home.heroBadge')}</span>
          <h2 className="hero__title">
            {t('home.heroTitleLine1')}<br />{t('home.heroTitleLine2')}
          </h2>
          <p className="hero__subtitle">
            {t('home.heroSubtitle')}
          </p>
          <div className="hero__actions">
            <Button as={Link} to="/galeria" variant="primary">{t('home.verGaleria')}</Button>
            <Button as={Link} to="/contacto" variant="secondary">{t('home.escribenos')}</Button>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="section section--light">
        <div className="container">
          <div className="section__header">
            <h2>{t('home.serviciosTitulo')}</h2>
            <p>{t('home.serviciosSubtitulo')}</p>
          </div>
          <div className="servicios-grid">
            {servicios.map(s => (
              <div key={s.titulo} className={`servicio-card servicio-card--${s.acento}`}>
                <span className="servicio-card__icon">{s.icon}</span>
                <h3>{s.titulo}</h3>
                <p>{s.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALERÍA PREVIEW */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <h2>{t('home.galeriaTitulo')}</h2>
            <p>{t('home.galeriaSubtitulo')}</p>
          </div>
          <div className="gallery-preview-grid">
            {galeriaPreview.map(p => (
              <Card
                key={p.id}
                image={p.imagen}
                title={p.titulo}
                badge={p.categoria}
              />
            ))}
          </div>
          <div className="section__cta">
            <Button as={Link} to="/galeria" variant="secondary">{t('home.verTodaGaleria')}</Button>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="section section--accent">
        <div className="container cta-block">
          <h2>{t('home.ctaTitulo')}</h2>
          <p>{t('home.ctaTexto')}</p>
          <Button as={Link} to="/contacto" variant="ghost">{t('home.ctaBoton')}</Button>
        </div>
      </section>
    </>
  )
}
