import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import Seo from '../components/Seo'
import './Auth.css'

export default function Login() {
  const { signIn } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const traducirError = (msg) => {
    if (msg.includes('Invalid login credentials')) return t('auth.errInvalidCredentials')
    if (msg.includes('Email not confirmed')) return t('auth.errEmailNoConfirmado')
    if (msg.includes('Too many requests')) return t('auth.errTooManyRequests')
    return msg
  }

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
      <Seo titulo={t('seo.login.titulo')} descripcion={t('seo.login.descripcion')} noindex />
      <div className="auth-card">
        <div className="auth-card__header">
          <div className="auth-card__icon">🧶</div>
          <h1 className="auth-card__title">{t('auth.loginTitulo')}</h1>
          <p className="auth-card__subtitle">{t('auth.loginSubtitulo')}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}

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
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? t('auth.loginBtnCargando') : t('auth.loginBtn')}
          </button>
        </form>

        <p className="auth-footer">
          {t('auth.noTienesCuenta')}{' '}
          <Link to="/registro">{t('auth.registrateGratis')}</Link>
        </p>
      </div>
    </div>
  )
}
