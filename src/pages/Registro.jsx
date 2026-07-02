import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export default function Registro() {
  const { signUp } = useAuth()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!nombre.trim()) return setError('Escribe tu nombre.')
    if (password !== confirm) return setError('Las contraseñas no coinciden.')
    if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.')

    setLoading(true)
    const { error } = await signUp(email, password, nombre.trim())

    if (error) {
      setError(traducirError(error.message))
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-card__header">
            <div className="auth-card__icon">✉️</div>
            <h1 className="auth-card__title">¡Casi listo!</h1>
            <p className="auth-card__subtitle">
              Te hemos enviado un correo a <strong>{email}</strong>.
              Haz clic en el enlace para confirmar tu cuenta.
            </p>
          </div>
          <p className="auth-footer">
            <Link to="/login">Volver al inicio de sesión</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <div className="auth-card__icon">🧶</div>
          <h1 className="auth-card__title">Crea tu cuenta</h1>
          <p className="auth-card__subtitle">Únete a La CrocheterIA gratis</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}

          <div className="auth-field">
            <label htmlFor="nombre">Tu nombre</label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
              placeholder="María García"
              autoComplete="name"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="tu@correo.com"
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="confirm">Repite la contraseña</label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}

function traducirError(msg) {
  if (msg.includes('already registered')) return 'Este correo ya tiene una cuenta. Prueba a iniciar sesión.'
  if (msg.includes('Password should be')) return 'La contraseña debe tener al menos 6 caracteres.'
  if (msg.includes('Unable to validate')) return 'Correo electrónico no válido.'
  return msg
}
