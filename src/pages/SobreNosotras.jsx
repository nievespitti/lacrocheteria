import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import './SobreNosotras.css'

const valores = [
  {
    icon: '🤲',
    titulo: 'Artesanía con alma',
    texto: 'Cada punto es intencional. Valoramos el proceso tanto como el resultado final.',
  },
  {
    icon: '💡',
    titulo: 'Innovación suave',
    texto: 'La IA no reemplaza la creatividad humana, la amplifica y la inspira.',
  },
  {
    icon: '🌱',
    titulo: 'Comunidad primero',
    texto: 'Creemos en compartir el conocimiento y crecer juntas, sin competencia.',
  },
  {
    icon: '♻️',
    titulo: 'Consumo consciente',
    texto: 'Promovemos materiales naturales y la moda lenta frente al fast fashion.',
  },
]

export default function SobreNosotras() {
  return (
    <div className="sobre-page">
      <div className="page-hero page-hero--sage">
        <div className="container">
          <h1>Sobre Nosotras</h1>
          <p>La historia detrás de La CrocheterIA.</p>
        </div>
      </div>

      {/* HISTORIA */}
      <section className="section">
        <div className="container sobre-intro">
          <div className="sobre-intro__text">
            <h2>Ganchillo e inteligencia artificial, juntos</h2>
            <p>
              La CrocheterIA nació de una pregunta sencilla: ¿y si la tecnología más avanzada
              del momento pudiera ponerse al servicio de uno de los oficios más antiguos del mundo?
            </p>
            <p>
              Somos apasionadas del crochet que encontramos en la inteligencia artificial una
              herramienta para potenciar la creatividad, facilitar el aprendizaje y conectar a
              artesanas de todo el mundo.
            </p>
            <p>
              Aquí no vendemos patrones fríos: compartimos proyectos con contexto, con historia,
              con el tipo de explicación que solo da alguien que ha pasado horas deshaciendo y
              rehaciendo el mismo punto hasta que queda perfecto.
            </p>
            <Button as={Link} to="/contacto" variant="primary">Escríbenos</Button>
          </div>
          <div className="sobre-intro__image">
            <img
              src="https://picsum.photos/seed/crafts-workshop/600/700"
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
            <h2>Lo que nos guía</h2>
            <p>Los valores que están detrás de cada patrón, tutorial y herramienta que creamos.</p>
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
