import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import './Header.css'

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/aprender', label: 'Aprende' },
  { to: '/galeria', label: 'Galería' },
  { to: '/disenador', label: '✦ Diseñador' },
  { to: '/sobre-nosotras', label: 'Sobre Nosotras' },
  { to: '/contacto', label: 'Contacto' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className={`header${scrolled ? ' header--scrolled' : ''}`}>
      <div className="header__inner">
        <Link to="/" className="header__logo" onClick={closeMenu}>
          <img src="/logo00.png" alt="La CrocheterIA" className="header__logo-img" />
        </Link>

        <nav className={`header__nav${menuOpen ? ' header__nav--open' : ''}`}>
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `header__link${isActive ? ' header__link--active' : ''}`
              }
              onClick={closeMenu}
            >
              {link.label}
            </NavLink>
          ))}
          <a
            href="https://notebooklm.google.com/notebook/6deea074-1085-4244-9369-25dc95addbef"
            target="_blank"
            rel="noopener noreferrer"
            className="header__biblia-btn"
            onClick={closeMenu}
          >
            📖 Biblia del Crochet
          </a>
        </nav>

        <button
          className={`header__hamburger${menuOpen ? ' header__hamburger--open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
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
