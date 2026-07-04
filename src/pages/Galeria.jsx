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
  Ropa: [
    { id: 2, placeholder: true },
    { id: 6, placeholder: true },
    { id: 10, placeholder: true },
  ],
  Accesorios: [
    { id: 'bolso-002', imagen: '/galeria/accesorios/bolso_002.png' },
    { id: 'bolso-002-video', imagen: '/galeria/accesorios/bolso_002.mp4' },
    { id: 'bolso-003', imagen: '/galeria/accesorios/bolso_003.png' },
    { id: 'bolso-004', imagen: '/galeria/accesorios/bolso_004.png' },
    { id: 'bolso-005', imagen: '/galeria/accesorios/bolso_005.png' },
    { id: 'bolso-006', imagen: '/galeria/accesorios/bolso_006.png' },
    { id: 'bolso-007', imagen: '/galeria/accesorios/bolso_007.png' },
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
