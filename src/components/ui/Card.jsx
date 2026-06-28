import './Card.css'

export default function Card({ image, title, subtitle, description, badge, children }) {
  return (
    <article className="card">
      {image && (
        <div className="card__image-wrap">
          <img src={image} alt={title || ''} className="card__image" loading="lazy" />
          {badge && <span className="card__badge">{badge}</span>}
        </div>
      )}
      <div className="card__body">
        {subtitle && <span className="card__subtitle">{subtitle}</span>}
        {title && <h3 className="card__title">{title}</h3>}
        {description && <p className="card__description">{description}</p>}
        {children}
      </div>
    </article>
  )
}
