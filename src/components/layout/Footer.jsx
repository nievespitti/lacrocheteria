import { Link } from 'react-router-dom'
import './Footer.css'

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/galeria', label: 'Galería' },
  { to: '/sobre-nosotras', label: 'Sobre Nosotras' },
  { to: '/contacto', label: 'Contacto' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">La CrocheterIA</span>
          <p className="footer__tagline">
            Tu rincón de ganchillo moderno<br />con un toque de inteligencia.
          </p>
        </div>

        <nav className="footer__nav">
          <span className="footer__section-title">Páginas</span>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to}>{link.label}</Link>
          ))}
        </nav>

        <div className="footer__contact">
          <span className="footer__section-title">Contacto</span>
          <a href="mailto:info@lacrocheteria.com">info@lacrocheteria.com</a>
        </div>
      </div>

      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} La CrocheterIA &middot; Tejido con amor y mucho ganchillo.</p>
      </div>
    </footer>
  )
}
