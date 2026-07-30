import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import { useLanguage } from '../context/LanguageContext'
import './SobreNosotras.css'

export default function SobreNosotras() {
  const { t } = useLanguage()

  const valores = [
    { icon: '✦', titulo: t('sobre.valor1Titulo'), texto: t('sobre.valor1Texto') },
    { icon: '◈', titulo: t('sobre.valor2Titulo'), texto: t('sobre.valor2Texto') },
    { icon: '❋', titulo: t('sobre.valor3Titulo'), texto: t('sobre.valor3Texto') },
    { icon: '✦', titulo: t('sobre.valor4Titulo'), texto: t('sobre.valor4Texto') },
  ]

  return (
    <div className="sobre-page">
      <div className="page-hero page-hero--sage">
        <div className="container">
          <h1>{t('sobre.heroTitulo')}</h1>
          <p>{t('sobre.heroSubtitulo')}</p>
        </div>
      </div>

      {/* HISTORIA */}
      <section className="section">
        <div className="container sobre-intro">
          <div className="sobre-intro__text">
            <h2>{t('sobre.introTitulo')}</h2>
            <p>{t('sobre.introP1')}</p>
            <p>{t('sobre.introP2')}</p>
            <p>{t('sobre.introP3')}</p>
            <Button as={Link} to="/contacto" variant="primary">{t('sobre.escribenos')}</Button>
          </div>
          <div className="sobre-intro__image">
            <img
              src="/galeria/ropa/ropa_04.png"
              alt="Taller de crochet"
              className="sobre-foto"
            />
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section className="section section--light">
        <div className="container">
          <div className="section__header">
            <h2>{t('sobre.valoresTitulo')}</h2>
            <p>{t('sobre.valoresSubtitulo')}</p>
          </div>
          <div className="valores-grid">
            {valores.map(v => (
              <div key={v.titulo} className="valor-item">
                <span className="valor-item__icon">{v.icon}</span>
                <h3>{v.titulo}</h3>
                <p>{v.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
