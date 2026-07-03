import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { listarProyectos, borrarProyecto } from '../lib/proyectos'
import { PatronResultado } from './AsistenteIA'
import './MisProyectos.css'

function formatearFecha(iso) {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

function TarjetaPatron({ proyecto, onBorrar }) {
  const [abierto, setAbierto] = useState(false)
  return (
    <div className="proyecto-card">
      <div className="proyecto-card__header">
        <div>
          <h3 className="proyecto-card__title">{proyecto.titulo}</h3>
          <p className="proyecto-card__meta">Nivel {proyecto.contenido.nivel} · {formatearFecha(proyecto.created_at)}</p>
        </div>
        <div className="proyecto-card__actions">
          <button className="proyecto-btn" onClick={() => setAbierto(v => !v)}>
            {abierto ? '▲ Ocultar' : '▼ Ver patrón'}
          </button>
          <button className="proyecto-btn proyecto-btn--danger" onClick={() => onBorrar(proyecto.id)}>
            ✕ Eliminar
          </button>
        </div>
      </div>
      {abierto && (
        <div className="proyecto-card__body">
          <PatronResultado texto={proyecto.contenido.patron} />
        </div>
      )}
    </div>
  )
}

function MiniaturaDiseno({ grid, rows, cols }) {
  return (
    <svg
      viewBox={`0 0 ${cols} ${rows}`}
      preserveAspectRatio="none"
      className="proyecto-thumb"
      style={{ aspectRatio: `${cols} / ${rows}` }}
      aria-hidden="true"
    >
      <rect width={cols} height={rows} fill="var(--color-linen)" />
      {grid.map((row, r) =>
        row.map((c, col) =>
          c.stitch ? <rect key={`${r}-${col}`} x={col} y={r} width={1} height={1} fill={c.color} /> : null
        )
      )}
    </svg>
  )
}

function TarjetaDiseno({ proyecto, onBorrar }) {
  const navigate = useNavigate()
  const { rows, cols, grid } = proyecto.contenido
  const puntos = grid.flat().filter(c => c.stitch !== null).length

  return (
    <div className="proyecto-card">
      <div className="proyecto-card__header">
        <div className="proyecto-card__info">
          <MiniaturaDiseno grid={grid} rows={rows} cols={cols} />
          <div>
            <h3 className="proyecto-card__title">{proyecto.titulo}</h3>
            <p className="proyecto-card__meta">{rows} × {cols} · {puntos} puntos · {formatearFecha(proyecto.created_at)}</p>
          </div>
        </div>
        <div className="proyecto-card__actions">
          <button
            className="proyecto-btn"
            onClick={() => navigate('/disenador', { state: { proyecto: { rows, cols, grid } } })}
          >
            ✦ Abrir en el Diseñador
          </button>
          <button className="proyecto-btn proyecto-btn--danger" onClick={() => onBorrar(proyecto.id)}>
            ✕ Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MisProyectos() {
  const { user, loading: authLoading } = useAuth()
  const [proyectos, setProyectos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!user) {
      setCargando(false)
      return
    }
    listarProyectos(user.id).then(({ data }) => {
      setProyectos(data || [])
      setCargando(false)
    }).catch(err => {
      console.error('Error al listar proyectos:', err)
      setCargando(false)
    })
  }, [user])

  async function handleBorrar(id) {
    if (!window.confirm('¿Eliminar este proyecto guardado?')) return
    try {
      await borrarProyecto(id)
      setProyectos(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error('Error al borrar proyecto:', err)
      alert('No se pudo eliminar el proyecto. Inténtalo de nuevo.')
    }
  }

  const patrones = proyectos.filter(p => p.tipo === 'patron')
  const disenos = proyectos.filter(p => p.tipo === 'diseno')

  return (
    <div className="mis-proyectos-page">
      <div className="page-hero page-hero--terracota">
        <div className="container">
          <h1>Mis Proyectos</h1>
          <p>Tus patrones generados y diseños guardados, siempre a mano.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {!authLoading && !user && (
            <p className="mis-proyectos-empty">
              <Link to="/login">Inicia sesión</Link> para ver tus proyectos guardados.
            </p>
          )}

          {user && !cargando && proyectos.length === 0 && (
            <p className="mis-proyectos-empty">
              Aún no has guardado ningún proyecto. Guarda un patrón desde el{' '}
              <Link to="/asistente">Asistente IA</Link> o un diseño desde el{' '}
              <Link to="/disenador">Diseñador</Link>.
            </p>
          )}

          {user && patrones.length > 0 && (
            <>
              <h2 className="mis-proyectos-seccion">✦ Patrones</h2>
              <div className="proyecto-list">
                {patrones.map(p => <TarjetaPatron key={p.id} proyecto={p} onBorrar={handleBorrar} />)}
              </div>
            </>
          )}

          {user && disenos.length > 0 && (
            <>
              <h2 className="mis-proyectos-seccion">◈ Diseños</h2>
              <div className="proyecto-list">
                {disenos.map(p => <TarjetaDiseno key={p.id} proyecto={p} onBorrar={handleBorrar} />)}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
