import { useState } from 'react'
import Card from '../components/ui/Card'
import './Galeria.css'

const proyectos = [
  { id: 1,  titulo: 'Conejo Amigurumi',    categoria: 'Amigurumis', descripcion: 'Tierno conejo de 15 cm, perfecto para regalar.',              imagen: 'https://picsum.photos/seed/plush-toy/600/600' },
  { id: 2,  titulo: 'Top Calado Verano',   categoria: 'Ropa',       descripcion: 'Top fresco con punto calado, ideal para el buen tiempo.',      imagen: 'https://picsum.photos/seed/summer-fashion/600/600' },
  { id: 3,  titulo: 'Bolso de Rafia',      categoria: 'Accesorios', descripcion: 'Bolso de verano tejido en hilo de rafia natural.',              imagen: 'https://picsum.photos/seed/straw-bag/600/600' },
  { id: 4,  titulo: 'Cojín Boho',          categoria: 'Decoración', descripcion: 'Cojín con motivo mandalas en tonos tierra.',                    imagen: 'https://picsum.photos/seed/boho-pillow/600/600' },
  { id: 5,  titulo: 'Osito Panda',         categoria: 'Amigurumis', descripcion: 'Amigurumi de oso panda con detalles en negro y blanco.',        imagen: 'https://picsum.photos/seed/panda-bear/600/600' },
  { id: 6,  titulo: 'Cárdigan Boho',       categoria: 'Ropa',       descripcion: 'Cárdigan largo con flecos y patrón calado.',                    imagen: 'https://picsum.photos/seed/boho-cardigan/600/600' },
  { id: 7,  titulo: 'Pendientes Flor',     categoria: 'Accesorios', descripcion: 'Pendientes ligeros con motivo floral y perlas naturales.',      imagen: 'https://picsum.photos/seed/flower-earrings/600/600' },
  { id: 8,  titulo: 'Guirnalda de Flores', categoria: 'Decoración', descripcion: 'Guirnalda de flores de algodón para decorar cualquier rincón.', imagen: 'https://picsum.photos/seed/flower-garland/600/600' },
  { id: 9,  titulo: 'Pulpo Colorido',      categoria: 'Amigurumis', descripcion: 'Pulpo con tentáculos trenzados, disponible en 8 colores.',      imagen: 'https://picsum.photos/seed/colorful-octopus/600/600' },
  { id: 10, titulo: 'Bikini Triangular',   categoria: 'Ropa',       descripcion: 'Bikini triangular con motivo floral en hilo de algodón.',       imagen: 'https://picsum.photos/seed/bikini-crochet/600/600' },
  { id: 11, titulo: 'Mochila Bohemia',     categoria: 'Accesorios', descripcion: 'Mochila pequeña con cordones de cuero y flecos.',               imagen: 'https://picsum.photos/seed/boho-backpack/600/600' },
  { id: 12, titulo: 'Cesta de Algodón',    categoria: 'Decoración', descripcion: 'Cesta tejida en cuerda de algodón reciclado.',                  imagen: 'https://picsum.photos/seed/cotton-basket/600/600' },
]

const categorias = ['Todos', 'Amigurumis', 'Ropa', 'Accesorios', 'Decoración']

export default function Galeria() {
  const [filtro, setFiltro] = useState('Todos')

  const proyectosFiltrados = filtro === 'Todos'
    ? proyectos
    : proyectos.filter(p => p.categoria === filtro)

  return (
    <div className="galeria-page">
      <div className="page-hero page-hero--sage">
        <div className="container">
          <h1>Galería de Creaciones</h1>
          <p>Cada pieza es única, tejida a mano con amor e inspiración.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="galeria-filtros" role="group" aria-label="Filtrar por categoría">
            {categorias.map(cat => (
              <button
                key={cat}
                className={`filtro-btn${filtro === cat ? ' filtro-btn--active' : ''}`}
                onClick={() => setFiltro(cat)}
                aria-pressed={filtro === cat}
              >
                {cat}
              </button>
            ))}
          </div>

          <p className="galeria-count">
            {proyectosFiltrados.length} {proyectosFiltrados.length === 1 ? 'proyecto' : 'proyectos'}
          </p>

          <div className="galeria-grid">
            {proyectosFiltrados.map(p => (
              <Card
                key={p.id}
                image={p.imagen}
                title={p.titulo}
                badge={p.categoria}
                description={p.descripcion}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
