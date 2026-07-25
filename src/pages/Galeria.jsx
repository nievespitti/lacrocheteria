import { useState } from 'react'
import Card from '../components/ui/Card'
import Carousel from '../components/ui/Carousel'
import { useLanguage } from '../context/LanguageContext'
import { galeriaProyectos } from '../i18n/translations'
import './Galeria.css'

const proyectosPorCategoria = {
  Amigurumis: [
    { id: 1, placeholder: true },
    { id: 5, placeholder: true },
    { id: 9, placeholder: true },
  ],
  // Para añadir una prenda nueva: 1) pon la foto en public/galeria/ropa/ropa_0N.png,
  // 2) añade una línea aquí, 3) añade el título/descripción en galeriaProyectos (src/i18n/translations.js, es y en).
  Ropa: [
    { id: 'ropa-001', imagen: '/galeria/ropa/ropa_01.png' },
    { id: 'ropa-002', imagen: '/galeria/ropa/ropa_02.png' },
    { id: 'ropa-003', imagen: '/galeria/ropa/ropa_03.png' },
    { id: 'ropa-004', imagen: '/galeria/ropa/ropa_04.png' },
    { id: 'ropa-005', imagen: '/galeria/ropa/ropa_05.png' },
    { id: 'ropa-006', imagen: '/galeria/ropa/ropa_06.png' },
    { id: 'ropa-007', imagen: '/galeria/ropa/ropa_07.png' },
  ],
  // Para añadir un bolso nuevo: 1) pon la foto en public/galeria/accesorios/bolso_0NN.png,
  // 2) añade una línea aquí, 3) añade el título/descripción en galeriaProyectos (src/i18n/translations.js, es y en).
  Accesorios: [
    { id: 'bolso-002', imagen: '/galeria/accesorios/bolso_002.png' },
    { id: 'bolso-002-video', imagen: '/galeria/accesorios/bolso_002.mp4' },
    { id: 'bolso-003', imagen: '/galeria/accesorios/bolso_003.png' },
    { id: 'bolso-004', imagen: '/galeria/accesorios/bolso_004.png' },
    { id: 'bolso-005', imagen: '/galeria/accesorios/bolso_005.png' },
    { id: 'bolso-006', imagen: '/galeria/accesorios/bolso_006.png' },
    { id: 'bolso-007', imagen: '/galeria/accesorios/bolso_007.png' },
    { id: 'bolso-008', imagen: '/galeria/accesorios/bolso_008.png' },
  ],
  Decoración: [
    { id: 4, placeholder: true },
    { id: 8, placeholder: true },
    { id: 12, placeholder: true },
  ],
}

function CarruselCategoria({ categoria, categoriaLabel }) {
  const { t, lang } = useLanguage()
  const proyectos = proyectosPorCategoria[categoria]
  return (
    <div className="galeria-categoria">
      <h2 className="galeria-categoria__titulo">{categoriaLabel}</h2>
      <Carousel prevLabel={t('galeria.anterior')} nextLabel={t('galeria.siguiente')}>
        {proyectos.map(p => {
          const texto = galeriaProyectos[lang][p.id] || galeriaProyectos.es[p.id]
          return (
            <Card
              key={p.id}
              image={p.imagen}
              title={texto.titulo}
              badge={categoriaLabel}
              description={texto.descripcion}
              placeholder={p.placeholder}
              placeholderText={t('comun.enProceso')}
            />
          )
        })}
      </Carousel>
    </div>
  )
}

export default function Galeria() {
  const { t } = useLanguage()
  const [filtro, setFiltro] = useState('Todos')
  const categoriasKeys = Object.keys(proyectosPorCategoria)

  return (
    <div className="galeria-page">
      <div className="page-hero page-hero--sage">
        <div className="container">
          <h1>{t('galeria.heroTitulo')}</h1>
          <p>{t('galeria.heroSubtitulo')}</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="galeria-filtros" role="group" aria-label={t('galeria.filtrarPor')}>
            <button
              className={`filtro-btn${filtro === 'Todos' ? ' filtro-btn--active' : ''}`}
              onClick={() => setFiltro('Todos')}
              aria-pressed={filtro === 'Todos'}
            >
              {t('galeria.filtroTodos')}
            </button>
            {categoriasKeys.map(cat => (
              <button
                key={cat}
                className={`filtro-btn${filtro === cat ? ' filtro-btn--active' : ''}`}
                onClick={() => setFiltro(cat)}
                aria-pressed={filtro === cat}
              >
                {t(`categorias.${cat}`)}
              </button>
            ))}
          </div>

          {filtro === 'Todos'
            ? categoriasKeys.map(cat => <CarruselCategoria key={cat} categoria={cat} categoriaLabel={t(`categorias.${cat}`)} />)
            : <CarruselCategoria categoria={filtro} categoriaLabel={t(`categorias.${filtro}`)} />
          }
        </div>
      </section>
    </div>
  )
}
