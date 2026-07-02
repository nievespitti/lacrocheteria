import { useParams, Link, Navigate } from 'react-router-dom'
import { niveles } from '../data/niveles'
import './Leccion.css'

export default function Leccion() {
  const { nivelId, leccionId } = useParams()

  const nivel = niveles.find(n => n.id === nivelId)
  if (!nivel) return <Navigate to="/aprender" replace />

  const leccionIndex = nivel.lecciones.findIndex(l => l.id === leccionId)
  if (leccionIndex === -1) return <Navigate to="/aprender" replace />

  const leccion = nivel.lecciones[leccionIndex]
  const prevLeccion = nivel.lecciones[leccionIndex - 1] ?? null
  const nextLeccion = nivel.lecciones[leccionIndex + 1] ?? null
  const parrafos = leccion.texto.split('\n\n')

  return (
    <div className="leccion-layout">
      {/* SIDEBAR */}
      <aside className="leccion-sidebar">
        <Link to="/aprender" className="leccion-sidebar__back">
          ← Todos los niveles
        </Link>
        <h3 className={`leccion-sidebar__nivel leccion-sidebar__nivel--${nivel.acento}`}>
          {nivel.icono} {nivel.nombre}
        </h3>
        <nav className="leccion-sidebar__nav">
          {nivel.lecciones.map(l => (
            <Link
              key={l.id}
              to={`/aprender/${nivel.id}/${l.id}`}
              className={`leccion-sidebar__item${l.id === leccionId ? ' leccion-sidebar__item--active' : ''}`}
            >
              <span className="leccion-sidebar__num">{l.orden}</span>
              <span className="leccion-sidebar__titulo">{l.titulo}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="leccion-main">
        <div className="leccion-content">
          <span className="leccion__etiqueta">
            {nivel.nombre} · Lección {leccion.orden} de {nivel.lecciones.length}
          </span>
          <h1 className="leccion__titulo">{leccion.titulo}</h1>

          {/* IMAGEN */}
          <div className="leccion__imagen-wrapper">
            <div className="leccion__imagen-placeholder">
              <span>📷</span>
              <p>{leccion.imagen_url.split('/').pop()}</p>
            </div>
          </div>

          {/* TEXTO */}
          <div className="leccion__texto">
            {parrafos.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* TABLA (solo si la lección tiene datos de tabla) */}
          {leccion.tabla && (
            <div className="leccion__tabla-wrapper">
              <table className="leccion__tabla">
                <thead>
                  <tr>
                    {leccion.tabla.cabeceras.map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leccion.tabla.filas.map((fila, i) => (
                    <tr key={i}>
                      {fila.map((celda, j) => (
                        <td key={j}>{celda}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* VÍDEO DE REFERENCIA */}
          {leccion.video_url && (
            <div className="leccion__video-ref">
              <h4>Vídeo de referencia</h4>
              <p>Complementa esta lección con un tutorial en vídeo:</p>
              <a
                href={leccion.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="leccion__video-link"
              >
                Ver en YouTube →
              </a>
            </div>
          )}

          {/* NAVEGACIÓN ENTRE LECCIONES */}
          <nav className="leccion__paginacion">
            {prevLeccion ? (
              <Link
                to={`/aprender/${nivel.id}/${prevLeccion.id}`}
                className="leccion__pag-btn leccion__pag-btn--prev"
              >
                <span className="leccion__pag-dir">← Anterior</span>
                <span className="leccion__pag-titulo">{prevLeccion.titulo}</span>
              </Link>
            ) : (
              <div />
            )}
            {nextLeccion ? (
              <Link
                to={`/aprender/${nivel.id}/${nextLeccion.id}`}
                className="leccion__pag-btn leccion__pag-btn--next"
              >
                <span className="leccion__pag-dir">Siguiente →</span>
                <span className="leccion__pag-titulo">{nextLeccion.titulo}</span>
              </Link>
            ) : (
              <Link to="/aprender" className="leccion__pag-btn leccion__pag-btn--next">
                <span className="leccion__pag-dir">¡Nivel completado!</span>
                <span className="leccion__pag-titulo">Volver a los niveles →</span>
              </Link>
            )}
          </nav>
        </div>
      </main>
    </div>
  )
}
