import { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import './Header.css'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, loading, signOut } = useAuth()
  const { lang, setLang, t } = useLanguage()
  const navigate = useNavigate()

  const links = [
    { to: '/', label: t('header.inicio') },
    { to: '/aprender', label: t('header.aprende') },
    { to: '/galeria', label: t('header.galeria') },
    { to: '/asistente', label: t('header.asistente') },
    { to: '/disenador', label: t('header.disenador') },
    { to: '/sobre-nosotras', label: t('header.sobreNosotras') },
    { to: '/contacto', label: t('header.contacto') },
  ]
  const esAdmin = user?.email === 'nievesgarciapitti@gmail.com'
  const navLinks = [
    ...links,
    ...(user ? [{ to: '/mis-proyectos', label: t('header.misProyectos') }] : []),
    ...(esAdmin ? [{ to: '/admin/correcciones', label: t('header.correcciones') }] : []),
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // En la cabecera solo cabe el primer nombre; el completo va en el title.
  const nombreCompleto = user ? (user.user_metadata?.nombre || user.email.split('@')[0]) : ''
  const nombreCorto = nombreCompleto.trim().split(/\s+/)[0]

  const closeMenu = () => setMenuOpen(false)

  const handleSignOut = async () => {
    await signOut()
    closeMenu()
    navigate('/')
  }

  return (
    <header className={`header${scrolled ? ' header--scrolled' : ''}`}>
      <div className="header__inner">
        <Link to="/" className="header__logo" onClick={closeMenu}>
          <img src="/logo00.webp" alt="La CrocheterIA" className="header__logo-img" width="178" height="136" />
        </Link>

        <nav className={`header__nav${menuOpen ? ' header__nav--open' : ''}`}>
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `header__link${isActive ? ' header__link--active' : ''}`
              }
              onClick={closeMenu}
            >
              <span className="header__link-label">{link.label}</span>
            </NavLink>
          ))}

          <div className="header__lang">
            <button
              className={`header__lang-btn${lang === 'es' ? ' header__lang-btn--active' : ''}`}
              onClick={() => setLang('es')}
            >
              ES
            </button>
            <button
              className={`header__lang-btn${lang === 'en' ? ' header__lang-btn--active' : ''}`}
              onClick={() => setLang('en')}
            >
              EN
            </button>
          </div>

          {!loading && (
            user ? (
              <div className="header__auth">
                <span className="header__username" title={nombreCompleto}>
                  {nombreCorto}
                </span>
                <button onClick={handleSignOut} className="header__logout">
                  {t('header.salir')}
                </button>
              </div>
            ) : (
              <Link to="/login" className="header__login-btn" onClick={closeMenu}>
                {t('header.entrar')}
              </Link>
            )
          )}
        </nav>

        <button
          className={`header__hamburger${menuOpen ? ' header__hamburger--open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? t('header.cerrarMenu') : t('header.abrirMenu')}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
