import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import './Auth.css'

export default function Registro() {
  const { signUp } = useAuth()
  const { t } = useLanguage()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const traducirError = (msg) => {
    if (msg.includes('already registered')) return t('auth.errYaRegistrado')
    if (msg.includes('Password should be')) return t('auth.errPasswordCorta')
    if (msg.includes('Unable to validate')) return t('auth.errEmailInvalido')
    return msg
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!nombre.trim()) return setError(t('auth.errNombre'))
    if (password !== confirm) return setError(t('auth.errPasswordsNoCoinciden'))
    if (password.length < 6) return setError(t('auth.errPasswordCorta'))

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
            <h1 className="auth-card__title">{t('auth.emailConfirmTitulo')}</h1>
            <p className="auth-card__subtitle">
              {t('auth.emailConfirmTexto1')} <strong>{email}</strong>.
              {' '}{t('auth.emailConfirmTexto2')}
            </p>
          </div>
          <p className="auth-footer">
            <Link to="/login">{t('auth.volverLogin')}</Link>
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
          <h1 className="auth-card__title">{t('auth.registroTitulo')}</h1>
          <p className="auth-card__subtitle">{t('auth.registroSubtitulo')}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}

          <div className="auth-field">
            <label htmlFor="nombre">{t('auth.nombreLabel')}</label>
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
            <label htmlFor="email">{t('auth.emailLabel')}</label>
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
            <label htmlFor="password">{t('auth.passwordLabel')}</label>
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
            <label htmlFor="confirm">{t('auth.confirmarPasswordLabel')}</label>
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
            {loading ? t('auth.registroBtnCargando') : t('auth.registroBtn')}
          </button>
        </form>

        <p className="auth-footer">
          {t('auth.yaTienesCuenta')}{' '}
          <Link to="/login">{t('auth.iniciaSesion')}</Link>
        </p>
      </div>
    </div>
  )
}
