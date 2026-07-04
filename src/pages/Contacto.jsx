import { useState } from 'react'
import Button from '../components/ui/Button'
import { useLanguage } from '../context/LanguageContext'
import './Contacto.css'

const WEB3FORMS_KEY = 'fc74df8c-3095-4fb2-8332-6ec7581acbe8'

export default function Contacto() {
  const { t } = useLanguage()
  const [form, setForm] = useState({ nombre: '', email: '', asunto: '', mensaje: '' })
  const [estado, setEstado] = useState('idle') // idle | enviando | ok | error

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setEstado('enviando')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: form.nombre,
          email: form.email,
          subject: form.asunto,
          message: form.mensaje,
        }),
      })
      const data = await res.json()
      setEstado(data.success ? 'ok' : 'error')
      if (data.success) setForm({ nombre: '', email: '', asunto: '', mensaje: '' })
    } catch {
      setEstado('error')
    }
  }

  return (
    <div className="contacto-page">
      <div className="page-hero page-hero--terracota">
        <div className="container">
          <h1>{t('contacto.heroTitulo')}</h1>
          <p>{t('contacto.heroSubtitulo')}</p>
        </div>
      </div>

      <section className="section">
        <div className="container contacto-layout">
          {/* INFO */}
          <div className="contacto-info">
            <h2>{t('contacto.hablemos')}</h2>
            <p>{t('contacto.intro')}</p>

            <div className="contacto-dato">
              <span className="contacto-dato__icon">✉️</span>
              <div>
                <strong>{t('contacto.emailLabel')}</strong>
                <a href="mailto:info@lacrocheteria.com">info@lacrocheteria.com</a>
              </div>
            </div>

            <div className="contacto-dato">
              <span className="contacto-dato__icon">🕐</span>
              <div>
                <strong>{t('contacto.tiempoLabel')}</strong>
                <span>{t('contacto.tiempoValor')}</span>
              </div>
            </div>

            <div className="contacto-dato">
              <span className="contacto-dato__icon">🌍</span>
              <div>
                <strong>{t('contacto.idiomaLabel')}</strong>
                <span>{t('contacto.idiomaValor')}</span>
              </div>
            </div>
          </div>

          {/* FORMULARIO */}
          <form className="contacto-form" onSubmit={handleSubmit} noValidate>
            {estado === 'ok' ? (
              <div className="form-success">
                <span className="form-success__emoji">🎉</span>
                <h3>{t('contacto.exitoTitulo')}</h3>
                <p>{t('contacto.exitoTexto')}</p>
                <Button type="button" variant="secondary" onClick={() => setEstado('idle')}>
                  {t('contacto.enviarOtro')}
                </Button>
              </div>
            ) : (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nombre">{t('contacto.nombreLabel')}</label>
                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      value={form.nombre}
                      onChange={handleChange}
                      placeholder={t('contacto.nombrePlaceholder')}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">{t('contacto.emailFieldLabel')}</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder={t('contacto.emailPlaceholder')}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="asunto">{t('contacto.asuntoLabel')}</label>
                  <input
                    id="asunto"
                    name="asunto"
                    type="text"
                    value={form.asunto}
                    onChange={handleChange}
                    placeholder={t('contacto.asuntoPlaceholder')}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="mensaje">{t('contacto.mensajeLabel')}</label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    rows="6"
                    value={form.mensaje}
                    onChange={handleChange}
                    placeholder={t('contacto.mensajePlaceholder')}
                    required
                  />
                </div>

                {estado === 'error' && (
                  <p className="form-error">
                    {t('contacto.errorMsg')}{' '}
                    <a href="mailto:info@lacrocheteria.com">info@lacrocheteria.com</a>
                  </p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  disabled={estado === 'enviando'}
                >
                  {estado === 'enviando' ? t('contacto.enviando') : t('contacto.enviarMensaje')}
                </Button>
              </>
            )}
          </form>
        </div>
      </section>
    </div>
  )
}
