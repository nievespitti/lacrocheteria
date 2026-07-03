import { useRef } from 'react'
import './Carousel.css'

export default function Carousel({ children }) {
  const trackRef = useRef(null)

  const scrollBy = (dir) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <div className="carousel">
      <button className="carousel__arrow carousel__arrow--left" onClick={() => scrollBy(-1)} aria-label="Anterior">
        ‹
      </button>
      <div className="carousel__track" ref={trackRef}>
        {children}
      </div>
      <button className="carousel__arrow carousel__arrow--right" onClick={() => scrollBy(1)} aria-label="Siguiente">
        ›
      </button>
    </div>
  )
}
