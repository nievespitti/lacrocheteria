import { useState } from 'react'
import Card from '../components/ui/Card'
import Carousel from '../components/ui/Carousel'
import './Galeria.css'

const proyectosPorCategoria = {
  Amigurumis: [
    { id: 1, titulo: 'Conejo Amigurumi', descripcion: 'Tierno conejo de 15 cm, perfecto para regalar.', imagen: 'https://picsum.photos/seed/plush-toy/600/600' },
    { id: 5, titulo: 'Osito Panda', descripcion: 'Amigurumi de oso panda con detalles en negro y blanco.', imagen: 'https://picsum.photos/seed/panda-bear/600/600' },
    { id: 9, titulo: 'Pulpo Colorido', descripcion: 'Pulpo con tentáculos trenzados, disponible en 8 colores.', imagen: 'https://picsum.photos/seed/colorful-octopus/600/600' },
  ],
  Ropa: [
    { id: 2, titulo: 'Top Calado Verano', descripcion: 'Top fresco con punto calado, ideal para el buen tiempo.', imagen: 'https://picsum.photos/seed/summer-fashion/600/600' },
    { id: 6, titulo: 'Cárdigan Boho', descripcion: 'Cárdigan largo con flecos y patrón calado.', imagen: 'https://picsum.photos/seed/boho-cardigan/600/600' },
    { id: 10, titulo: 'Bikini Triangular', descripcion: 'Bikini triangular con motivo floral en hilo de algodón.', imagen: 'https://picsum.photos/seed/bikini-crochet/600/600' },
  ],
  Accesorios: [
    { id: 'bolso-002', titulo: 'Bolso Granny Square', descripcion: 'Bolso tejido con cuadrados de colores al estilo granny square.', imagen: '/galeria/accesorios/bolso_002.png' },
    { id: 'bolso-002-video', titulo: 'Bolso Granny Square (vídeo)', descripcion: 'Vista en movimiento del bolso granny square.', imagen: '/galeria/accesorios/bolso_002.mp4' },
    { id: 'bolso-003', titulo: 'Bolso Verde Bosque', descripcion: 'Bolso tote de asas largas en verde bosque.', imagen: '/galeria/accesorios/bolso_003.png' },
    { id: 'bolso-004', titulo: 'Bolso Boho con Borlas', descripcion: 'Bolso a rayas de colores con borlas y pompones.', imagen: '/galeria/accesorios/bolso_004.png' },
    { id: 'bolso-005', titulo: 'Bolso Triangular Menta', descripcion: 'Bolso triangular en verde menta con asa de piel.', imagen: '/galeria/accesorios/bolso_005.png' },
    { id: 'bolso-006', titulo: 'Bolso Bicolor', descripcion: 'Bolso en rojo y verde con asas a juego.', imagen: '/galeria/accesorios/bolso_006.png' },
  ],
  Decoración: [
    { id: 4, titulo: 'Cojín Boho', descripcion: 'Cojín con motivo mandalas en tonos tierra.', imagen: 'https://picsum.photos/seed/boho-pillow/600/600' },
    { id: 8, titulo: 'Guirnalda de Flores', descripcion: 'Guirnalda de flores de algodón para decorar cualquier rincón.', imagen: 'https://picsum.photos/seed/flower-garland/600/600' },
    { id: 12, titulo: 'Cesta de Algodón', descripcion: 'Cesta tejida en cuerda de algodón reciclado.', imagen: 'https://picsum.photos/seed/cotton-basket/600/600' },
  ],
}

const categorias = ['Todos', 'Amigurumis', 'Ropa', 'Accesorios', 'Decoración']

function CarruselCategoria({ categoria }) {
  const proyectos = proyectosPorCategoria[categoria]
  return (
    <div className="galeria-categoria">
      <h2 className="galeria-categoria__titulo">{categoria}</h2>
      <Carousel>
        {proyectos.map(p => (
          <Card key={p.id} image={p.imagen} title={p.titulo} badge={categoria} description={p.descripcion} />
        ))}
      </Carousel>
    </div>
  )
}

export default function Galeria() {
  const [filtro, setFiltro] = useState('Todos')

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

          {filtro === 'Todos'
            ? Object.keys(proyectosPorCategoria).map(cat => <CarruselCategoria key={cat} categoria={cat} />)
            : <CarruselCategoria categoria={filtro} />
          }
        </div>
      </section>
    </div>
  )
}
