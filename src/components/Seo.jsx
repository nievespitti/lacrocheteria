import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

const DOMINIO = 'https://lacrocheteria.com'

export default function Seo({ titulo, descripcion, noindex = false }) {
  const { pathname } = useLocation()
  const url = `${DOMINIO}${pathname}`

  return (
    <Helmet>
      <title>{titulo}</title>
      <meta name="description" content={descripcion} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  )
}
