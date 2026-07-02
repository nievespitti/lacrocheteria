import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      setError(traducirError(error.message))
      setLoading(false)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <div className="auth-card__icon">🧶</div>
          <h1 className="auth-card__title">Bienvenida de nuevo</h1>
          <p className="auth-card__subtitle">Accede a tu cuenta de La CrocheterIA</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}

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
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="auth-footer">
          ¿Aún no tienes cuenta?{' '}
          <Link to="/registro">Regístrate gratis</Link>
        </p>
      </div>
    </div>
  )
}

function traducirError(msg) {
  if (msg.includes('Invalid login credentials')) return 'Correo o contraseña incorrectos.'
  if (msg.includes('Email not confirmed')) return 'Confirma tu correo antes de iniciar sesión.'
  if (msg.includes('Too many requests')) return 'Demasiados intentos. Espera un momento.'
  return msg
}
