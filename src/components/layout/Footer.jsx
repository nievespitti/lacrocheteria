import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import './Footer.css'

export default function Footer() {
  const { t } = useLanguage()

  const navLinks = [
    { to: '/', label: t('header.inicio') },
    { to: '/aprender', label: t('header.aprende') },
    { to: '/galeria', label: t('header.galeria') },
    { to: '/asistente', label: t('header.asistente') },
    { to: '/disenador', label: t('header.disenador') },
    { to: '/sobre-nosotras', label: t('header.sobreNosotras') },
    { to: '/contacto', label: t('header.contacto') },
  ]

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">La CrocheterIA</span>
          <p className="footer__tagline">
            {t('footer.tagline').split('\n').map((line, i) => (
              <span key={i}>{i > 0 && <br />}{line}</span>
            ))}
          </p>
        </div>

        <nav className="footer__nav">
          <span className="footer__section-title">{t('footer.paginas')}</span>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to}>{link.label}</Link>
          ))}
        </nav>

        <div className="footer__contact">
          <span className="footer__section-title">{t('footer.contacto')}</span>
          <a href="mailto:info@lacrocheteria.com">info@lacrocheteria.com</a>
        </div>
      </div>

      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} {t('footer.copyright')}</p>
      </div>
    </footer>
  )
}
