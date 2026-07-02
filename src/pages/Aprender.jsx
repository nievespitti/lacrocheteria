import { Link } from 'react-router-dom'
import { niveles } from '../data/niveles'
import './Aprender.css'

export default function Aprender() {
  return (
    <>
      <section className="page-hero page-hero--sage">
        <div className="container">
          <span className="aprender-hero__badge">✦ Academia de Ganchillo</span>
          <h1>Aprende crochet</h1>
          <p>De principiante a experta, paso a paso, con tutoriales en profundidad, vídeos de referencia y proyectos guiados.</p>
        </div>
      </section>

      <section className="section section--light">
        <div className="container">
          <div className="section__header">
            <h2>Elige tu nivel</h2>
            <p>Cada nivel está diseñado para construir sobre el anterior. Si eres nueva, empieza por el Básico.</p>
          </div>
          <div className="niveles-grid">
            {niveles.map(nivel => (
              <article key={nivel.id} className={`nivel-card nivel-card--${nivel.acento}`}>
                <span className="nivel-card__icono">{nivel.icono}</span>
                <h2 className="nivel-card__nombre">{nivel.nombre}</h2>
                <p className="nivel-card__descripcion">{nivel.descripcion}</p>
                <p className="nivel-card__count">
                  {nivel.lecciones.length} lecciones
                </p>
                {nivel.disponible ? (
                  <Link
                    to={`/aprender/${nivel.id}/${nivel.lecciones[0].id}`}
                    className="nivel-card__btn nivel-card__btn--activo"
                  >
                    Comenzar →
                  </Link>
                ) : (
                  <span className="nivel-card__btn nivel-card__btn--pronto">
                    Próximamente
                  </span>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--accent">
        <div className="container cta-block">
          <h2>¿Tienes dudas sobre algún punto?</h2>
          <p>Nuestro asistente de IA está aquí para ayudarte en cada paso.</p>
          <Link to="/disenador" className="btn btn--ghost">Ir al Asistente IA</Link>
        </div>
      </section>
    </>
  )
}
