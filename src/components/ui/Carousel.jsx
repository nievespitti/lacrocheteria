import { useRef } from 'react'
import './Carousel.css'

export default function Carousel({ children, prevLabel = 'Anterior', nextLabel = 'Siguiente' }) {
  const trackRef = useRef(null)

  const scrollBy = (dir) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <div className="carousel">
      <button className="carousel__arrow carousel__arrow--left" onClick={() => scrollBy(-1)} aria-label={prevLabel}>
        ‹
      </button>
      <div className="carousel__track" ref={trackRef}>
        {children}
      </div>
      <button className="carousel__arrow carousel__arrow--right" onClick={() => scrollBy(1)} aria-label={nextLabel}>
        ›
      </button>
    </div>
  )
}
