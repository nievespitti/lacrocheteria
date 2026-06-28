import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import './Home.css'

const servicios = [
  {
    icon: '✦',
    titulo: 'Patrones Exclusivos',
    descripcion: 'Patrones propios creados con cariño, desde nivel principiante hasta avanzado, con instrucciones claras y fotos paso a paso.',
    acento: 'terracota',
  },
  {
    icon: '◈',
    titulo: 'Asistente con IA',
    descripcion: 'Una herramienta inteligente que te ayuda a adaptar patrones, calcular puntos y resolver cualquier duda de crochet.',
    acento: 'sage',
  },
  {
    icon: '❋',
    titulo: 'Comunidad',
    descripcion: 'Un espacio para compartir tus creaciones, pedir consejo y encontrar la inspiración que necesitas para tu próximo proyecto.',
    acento: 'linen',
  },
]

const galeriaPreview = [
  {
    id: 1,
    titulo: 'Conejo Amigurumi',
    categoria: 'Amigurumis',
    imagen: 'https://picsum.photos/seed/plush-toy/600/600',
  },
  {
    id: 2,
    titulo: 'Top Calado',
    categoria: 'Ropa',
    imagen: 'https://picsum.photos/seed/summer-fashion/600/600',
  },
  {
    id: 3,
    titulo: 'Bolso de Rafia',
    categoria: 'Accesorios',
    imagen: 'https://picsum.photos/seed/straw-bag/600/600',
  },
  {
    id: 4,
    titulo: 'Cojín Boho',
    categoria: 'Decoración',
    imagen: 'https://picsum.photos/seed/boho-pillow/600/600',
  },
]

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container hero__inner">
          <img src="/logo00.png" alt="La CrocheterIA" className="hero__logo" />
          <span className="hero__badge">✨ Ganchillo + Inteligencia Artificial</span>
          <h1 className="hero__title">
            Crochet moderno<br />con alma artesanal
          </h1>
          <p className="hero__subtitle">
            Patrones exclusivos, tutoriales en profundidad y un asistente de IA para
            acompañarte en cada punto. Bienvenida a tu nuevo rincón de ganchillo.
          </p>
          <div className="hero__actions">
            <Button as={Link} to="/galeria" variant="primary">Ver galería</Button>
            <Button as={Link} to="/contacto" variant="secondary">Escríbenos</Button>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="section section--light">
        <div className="container">
          <div className="section__header">
            <h2>¿Qué encontrarás aquí?</h2>
            <p>Todo lo que necesitas para disfrutar del crochet, desde el primer punto hasta el último.</p>
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
            <h2>Últimas creaciones</h2>
            <p>Un vistazo a lo que estamos tejiendo últimamente.</p>
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
            <Button as={Link} to="/galeria" variant="secondary">Ver toda la galería</Button>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="section section--accent">
        <div className="container cta-block">
          <h2>¿Tienes alguna pregunta?</h2>
          <p>Estamos aquí para ayudarte. Cuéntanos qué proyecto tienes en mente.</p>
          <Button as={Link} to="/contacto" variant="ghost">Contactar ahora</Button>
        </div>
      </section>
    </>
  )
}
