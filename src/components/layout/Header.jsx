import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import './Header.css'

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/galeria', label: 'Galería' },
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
          <LogoIcon />
          <span className="header__logo-text">La CrocheterIA</span>
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

function LogoIcon() {
  return (
    <svg className="header__logo-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="24" cy="16" r="9" stroke="#E98074" strokeWidth="2.5" fill="none" />
      <path d="M15 16 Q19 11 24 16 Q29 21 24 26" stroke="#E98074" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <line x1="10" y1="34" x2="17" y2="16" stroke="#007A7A" strokeWidth="3" strokeLinecap="round" />
      <path d="M17 16 C17 13 13 11 11 12" stroke="#007A7A" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  )
}
