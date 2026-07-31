import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

export const DOMINIO = 'https://lacrocheteria.com'
const IMAGEN_OG_DEFECTO = `${DOMINIO}/logo3d_final.jpg`

export default function Seo({ titulo, descripcion, noindex = false, imagen = IMAGEN_OG_DEFECTO, jsonLd }) {
  const { pathname } = useLocation()
  const url = `${DOMINIO}${pathname}`
  const bloquesJsonLd = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <Helmet>
      <title>{titulo}</title>
      <meta name="description" content={descripcion} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="La CrocheterIA" />
      <meta property="og:title" content={titulo} />
      <meta property="og:description" content={descripcion} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imagen} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={titulo} />
      <meta name="twitter:description" content={descripcion} />
      <meta name="twitter:image" content={imagen} />

      {bloquesJsonLd.map((bloque, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(bloque)}</script>
      ))}
    </Helmet>
  )
}
