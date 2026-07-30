import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Seo, { DOMINIO } from '../components/Seo'
import { useLanguage } from '../context/LanguageContext'
import './Home.css'

export default function Home() {
  const { t } = useLanguage()

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'La CrocheterIA',
      url: DOMINIO,
      logo: `${DOMINIO}/logo3d_final.png`,
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

  const galeriaPreview = [
    { id: 1, titulo: t('home.proyecto1'), categoria: t('categorias.Amigurumis'), placeholder: true },
    { id: 2, titulo: t('home.proyecto2'), categoria: t('categorias.Ropa'), imagen: '/galeria/ropa/ropa_04.png' },
    { id: 3, titulo: t('home.proyecto3'), categoria: t('categorias.Accesorios'), imagen: '/galeria/accesorios/bolso_002.png' },
    { id: 4, titulo: t('home.proyecto4'), categoria: t('categorias.Decoración'), placeholder: true },
  ]

  return (
    <>
      <Seo titulo={t('seo.home.titulo')} descripcion={t('seo.home.descripcion')} jsonLd={jsonLd} />
      {/* HERO */}
      <section className="hero">
        <div className="container hero__inner">
          <img src="/logo3d_final.png" alt="La CrocheterIA" className="hero__logo" />
          <span className="hero__badge">{t('home.heroBadge')}</span>
          <h1 className="hero__title">
            {t('home.heroTitleLine1')}<br />{t('home.heroTitleLine2')}
          </h1>
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
                placeholder={p.placeholder}
                placeholderText={t('comun.enProceso')}
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
