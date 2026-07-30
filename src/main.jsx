import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'

// Las páginas públicas se prerenderizan en build time (scripts/prerender.mjs)
// para que crawlers/redes sociales vean título, descripción, OG y JSON-LD
// reales. react-helmet-async no reconoce esas etiquetas como propias al
// montar (no las marca ni las reutiliza), así que las quitamos justo antes
// de que React arranque: Seo.jsx las vuelve a crear al momento, sin dejar
// duplicados de título/descripción/canonical/OG/Twitter/JSON-LD.
document.head
  .querySelectorAll('title, meta[name="description"], meta[name="robots"], link[rel="canonical"], meta[property^="og:"], meta[name^="twitter:"], script[type="application/ld+json"]')
  .forEach((el) => el.remove())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
