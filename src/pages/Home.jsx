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
          <div className="hero__content">
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
          <div className="hero__visual" aria-hidden="true">
            <HeroIllustration />
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

function HeroIllustration() {
  return (
    <svg className="hero__svg" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      {/* Fondo suave */}
      <circle cx="200" cy="200" r="155" fill="#C4764A" opacity="0.06" />

      {/* Ovillo de lana — capas */}
      <circle cx="200" cy="210" r="115" fill="#C4764A" opacity="0.09" />
      <circle cx="200" cy="210" r="90" fill="none" stroke="#C4764A" strokeWidth="2.5" opacity="0.2" />
      <ellipse cx="200" cy="210" rx="90" ry="32" fill="none" stroke="#C4764A" strokeWidth="2" opacity="0.35" />
      <ellipse cx="200" cy="210" rx="90" ry="32" fill="none" stroke="#C4764A" strokeWidth="2" opacity="0.35"
        transform="rotate(55 200 210)" />
      <ellipse cx="200" cy="210" rx="90" ry="32" fill="none" stroke="#C4764A" strokeWidth="2" opacity="0.35"
        transform="rotate(110 200 210)" />
      <circle cx="200" cy="210" r="90" fill="none" stroke="#C4764A" strokeWidth="4" />

      {/* Hilo suelto */}
      <path d="M200 120 Q230 80 280 90" fill="none" stroke="#C4764A" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />

      {/* Ganchillo */}
      <line x1="295" y1="65" x2="180" y2="210" stroke="#6B7F5E" strokeWidth="7" strokeLinecap="round" />
      <path d="M180 210 C168 222, 163 235, 175 244 C187 253, 199 240, 188 228"
        fill="none" stroke="#6B7F5E" strokeWidth="6" strokeLinecap="round" />

      {/* Puntos decorativos */}
      <circle cx="110" cy="130" r="6" fill="#E8D5C4" opacity="0.9" />
      <circle cx="300" cy="310" r="8" fill="#6B7F5E" opacity="0.4" />
      <circle cx="75" cy="290" r="4" fill="#C4764A" opacity="0.4" />
      <circle cx="330" cy="155" r="4" fill="#E8D5C4" opacity="0.8" />
      <circle cx="150" cy="340" r="5" fill="#6B7F5E" opacity="0.35" />

      {/* Motivo floral simple */}
      <circle cx="308" cy="88" r="5" fill="#E8D5C4" opacity="0.7" />
      <circle cx="315" cy="82" r="3" fill="#C4764A" opacity="0.5" />
    </svg>
  )
}
