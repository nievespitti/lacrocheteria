import './Card.css'

export default function Card({ image, title, subtitle, description, badge, placeholder, placeholderText, children }) {
  const esVideo = typeof image === 'string' && image.toLowerCase().endsWith('.mp4')

  return (
    <article className="card">
      {placeholder ? (
        <div className="card__image-wrap card__image-wrap--placeholder">
          <span className="card__placeholder-text">{placeholderText}</span>
          {badge && <span className="card__badge">{badge}</span>}
        </div>
      ) : image && (
        <div className={`card__image-wrap${esVideo ? ' card__image-wrap--video' : ''}`}>
          {esVideo ? (
            <video src={image} className="card__image card__image--video" autoPlay muted loop playsInline />
          ) : (
            <img src={image} alt={title || ''} className="card__image" loading="lazy" />
          )}
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
