import { useState } from 'react'
import Button from '../components/ui/Button'
import './Contacto.css'

const WEB3FORMS_KEY = 'fc74df8c-3095-4fb2-8332-6ec7581acbe8'

export default function Contacto() {
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
          <h1>Contacto</h1>
          <p>¿Tienes una pregunta, propuesta o simplemente quieres saludar? Escríbenos.</p>
        </div>
      </div>

      <section className="section">
        <div className="container contacto-layout">
          {/* INFO */}
          <div className="contacto-info">
            <h2>Hablemos</h2>
            <p>
              Respondemos a todos los mensajes en menos de 48 horas. Si prefieres el correo
              directo, también puedes escribirnos a:
            </p>

            <div className="contacto-dato">
              <span className="contacto-dato__icon">✉️</span>
              <div>
                <strong>Email</strong>
                <a href="mailto:info@lacrocheteria.com">info@lacrocheteria.com</a>
              </div>
            </div>

            <div className="contacto-dato">
              <span className="contacto-dato__icon">🕐</span>
              <div>
                <strong>Tiempo de respuesta</strong>
                <span>Menos de 48 horas</span>
              </div>
            </div>

            <div className="contacto-dato">
              <span className="contacto-dato__icon">🌍</span>
              <div>
                <strong>Idioma</strong>
                <span>Español (también hablamos English)</span>
              </div>
            </div>
          </div>

          {/* FORMULARIO */}
          <form className="contacto-form" onSubmit={handleSubmit} noValidate>
            {estado === 'ok' ? (
              <div className="form-success">
                <span className="form-success__emoji">🎉</span>
                <h3>¡Mensaje enviado!</h3>
                <p>Gracias por escribirnos. Te responderemos en breve.</p>
                <Button type="button" variant="secondary" onClick={() => setEstado('idle')}>
                  Enviar otro mensaje
                </Button>
              </div>
            ) : (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nombre">Tu nombre *</label>
                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      value={form.nombre}
                      onChange={handleChange}
                      placeholder="María García"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Tu email *</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="maria@ejemplo.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="asunto">Asunto *</label>
                  <input
                    id="asunto"
                    name="asunto"
                    type="text"
                    value={form.asunto}
                    onChange={handleChange}
                    placeholder="¿En qué podemos ayudarte?"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="mensaje">Mensaje *</label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    rows="6"
                    value={form.mensaje}
                    onChange={handleChange}
                    placeholder="Cuéntanos lo que necesitas..."
                    required
                  />
                </div>

                {estado === 'error' && (
                  <p className="form-error">
                    Algo salió mal. Por favor, inténtalo de nuevo o escríbenos directamente a{' '}
                    <a href="mailto:info@lacrocheteria.com">info@lacrocheteria.com</a>
                  </p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  disabled={estado === 'enviando'}
                >
                  {estado === 'enviando' ? 'Enviando…' : 'Enviar mensaje'}
                </Button>
              </>
            )}
          </form>
        </div>
      </section>
    </div>
  )
}
