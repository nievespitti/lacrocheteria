import { useEffect, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import './ContadorWidget.css'

function leerGuardado(clave) {
  const valor = localStorage.getItem(clave)
  return valor ? parseInt(valor, 10) || 0 : 0
}

function Contador({ label, valor, onCambiar, onReiniciar, reiniciarLabel }) {
  return (
    <div className="contador-widget__contador">
      <span className="contador-widget__label">{label}</span>
      <div className="contador-widget__controles">
        <button
          type="button"
          className="contador-widget__paso"
          onClick={() => onCambiar(Math.max(0, valor - 1))}
          aria-label="-1"
        >
          −
        </button>
        <span className="contador-widget__numero">{valor}</span>
        <button
          type="button"
          className="contador-widget__paso"
          onClick={() => onCambiar(valor + 1)}
          aria-label="+1"
        >
          +
        </button>
      </div>
      <button type="button" className="contador-widget__reset" onClick={onReiniciar}>
        {reiniciarLabel}
      </button>
    </div>
  )
}

export default function ContadorWidget() {
  const { t } = useLanguage()
  const [abierto, setAbierto] = useState(false)
  const [vuelta, setVuelta] = useState(() => leerGuardado('contador-vuelta'))
  const [repeticion, setRepeticion] = useState(() => leerGuardado('contador-repeticion'))

  useEffect(() => { localStorage.setItem('contador-vuelta', vuelta) }, [vuelta])
  useEffect(() => { localStorage.setItem('contador-repeticion', repeticion) }, [repeticion])

  function reiniciarTodo() {
    setVuelta(0)
    setRepeticion(0)
  }

  return (
    <div className="contador-widget">
      {abierto && (
        <div className="contador-widget__panel">
          <div className="contador-widget__header">
            <span>{t('contador.titulo')}</span>
            <button
              className="contador-widget__close"
              onClick={() => setAbierto(false)}
              aria-label={t('contador.cerrar')}
            >
              ✕
            </button>
          </div>

          <div className="contador-widget__body">
            <Contador
              label={t('contador.vueltaLabel')}
              valor={vuelta}
              onCambiar={setVuelta}
              onReiniciar={() => setVuelta(0)}
              reiniciarLabel={t('contador.reiniciar')}
            />
            <Contador
              label={t('contador.repeticionLabel')}
              valor={repeticion}
              onCambiar={setRepeticion}
              onReiniciar={() => setRepeticion(0)}
              reiniciarLabel={t('contador.reiniciar')}
            />
          </div>

          <button type="button" className="contador-widget__reset-todo" onClick={reiniciarTodo}>
            {t('contador.reiniciarTodo')}
          </button>
        </div>
      )}

      <div className="contador-widget__bubble-wrap">
        {!abierto && (
          <span className="contador-widget__hint">{t('contador.burbujaLabel')}</span>
        )}
        <button
          className="contador-widget__bubble"
          onClick={() => setAbierto((v) => !v)}
          aria-label={t('contador.burbujaLabel')}
        >
          {abierto ? '✕' : vuelta}
        </button>
      </div>
    </div>
  )
}
