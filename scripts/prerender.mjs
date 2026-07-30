// Prerender de las páginas públicas tras `vite build` (hook `postbuild`).
//
// Por qué: la web es una SPA 100% client-side. Los bots que no ejecutan JS
// (Bing, y sobre todo los "unfurlers" de redes sociales: WhatsApp, Facebook,
// Twitter/X, LinkedIn) solo veían el index.html vacío, con el mismo
// título/descripción genéricos en cualquier link compartido. Este script
// abre cada página pública con un navegador headless sobre el build ya
// generado, espera a que React (y el Seo.jsx de cada página) termine de
// renderizar, y guarda ese HTML final en dist/<ruta>/index.html. Vercel
// sirve archivos estáticos exactos ANTES que el rewrite de vercel.json, así
// que cada ruta prerenderizada se sirve tal cual, con contenido real.
//
// La ruta "/" prerenderizada sobreescribe dist/index.html. Como ese archivo
// también es el destino del rewrite SPA para rutas que NO prerenderizamos
// (login, registro, mis-proyectos, admin — privadas o sin sentido indexar),
// guardamos antes una copia del shell genérico en dist/app-shell.html y
// vercel.json apunta el rewrite ahí en vez de a index.html.
//
// Importante: NO capturamos el documento completo (`page.content()`) tal
// cual. react-helmet-async, al montar sobre una página que YA tiene sus
// propias etiquetas (título, meta description, canonical, OG, JSON-LD) —
// exactamente lo que pasa cuando una visita real carga una página ya
// prerenderizada — no las reconoce como "suyas" y las duplica en vez de
// reemplazarlas (comprobado: sin este cuidado, cada visita real acababa con
// dos <title>, dos <meta description>, etc.). Para evitarlo, cada ruta se
// construye SIEMPRE desde el mismo shell limpio (app-shell.html) + solo las
// etiquetas de Seo.jsx y el HTML ya renderizado de #root, nunca a partir de
// un documento previamente mutado.
//
// No es SSR/hidratación de verdad: el cliente sigue montando con
// createRoot (no hydrateRoot), así que una vez carga el JS, React vuelve a
// renderizar por su cuenta reemplazando el HTML prerenderizado. Como el
// resultado es el mismo, no debería notarse — es una mejora para
// crawlers/bots y para el primer pintado, no un cambio de arquitectura.

import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import { mkdir, writeFile, copyFile, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { niveles } from '../src/data/niveles.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const RAIZ = path.join(__dirname, '..')
const DIST = path.join(RAIZ, 'dist')
const DOMINIO = 'https://lacrocheteria.com'
const PUERTO = 4550

const SELECTORES_SEO = [
  'title',
  'meta[name="description"]',
  'meta[name="robots"]',
  'link[rel="canonical"]',
  'meta[property^="og:"]',
  'meta[name^="twitter:"]',
  'script[type="application/ld+json"]',
]

const rutasEstaticas = [
  { ruta: '/', changefreq: 'weekly', priority: '1.0' },
  { ruta: '/galeria', changefreq: 'weekly', priority: '0.9' },
  { ruta: '/asistente', changefreq: 'monthly', priority: '0.8' },
  { ruta: '/aprender', changefreq: 'monthly', priority: '0.8' },
  { ruta: '/disenador', changefreq: 'monthly', priority: '0.6' },
  { ruta: '/sobre-nosotras', changefreq: 'monthly', priority: '0.5' },
  { ruta: '/contacto', changefreq: 'monthly', priority: '0.5' },
]

const rutasLecciones = niveles.flatMap((nivel) =>
  nivel.lecciones.map((leccion) => ({
    ruta: `/aprender/${nivel.id}/${leccion.id}`,
    changefreq: 'monthly',
    priority: '0.6',
  }))
)

const todasLasRutas = [...rutasEstaticas, ...rutasLecciones]

async function generarSitemap() {
  const hoy = new Date().toISOString().slice(0, 10)
  const urls = todasLasRutas
    .map(
      ({ ruta, changefreq, priority }) => `  <url>
    <loc>${DOMINIO}${ruta}</loc>
    <lastmod>${hoy}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  await writeFile(path.join(DIST, 'sitemap.xml'), xml)
  console.log(`  sitemap.xml regenerado (${todasLasRutas.length} URLs)`)
}

function esperarServidor(url, intentosRestantes = 30) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(() => resolve())
      .catch(() => {
        if (intentosRestantes <= 0) return reject(new Error('El servidor de preview no arrancó a tiempo'))
        setTimeout(() => esperarServidor(url, intentosRestantes - 1).then(resolve, reject), 500)
      })
  })
}

async function main() {
  console.log('Prerender: preparando shell de fallback...')
  const shellPath = path.join(DIST, 'app-shell.html')
  await copyFile(path.join(DIST, 'index.html'), shellPath)
  const shellBase = await readFile(shellPath, 'utf-8')

  console.log('Prerender: arrancando vite preview...')
  const preview = spawn('npx', ['vite', 'preview', '--port', String(PUERTO), '--strictPort'], {
    cwd: RAIZ,
    stdio: 'inherit',
    shell: true,
  })

  const cerrarPreview = () => { try { preview.kill() } catch { /* noop */ } }
  process.on('exit', cerrarPreview)

  // Recogemos TODO en memoria antes de escribir nada a disco. Si
  // escribiéramos dist/index.html (o cualquier otra ruta) según se va
  // generando, vite preview empezaría a servir ESE archivo ya mutado como
  // fallback SPA para las rutas que aún no tienen su propio index.html —
  // contaminando su render con las etiquetas de una página distinta
  // (comprobado: así es como aparecían títulos/canonical duplicados de
  // Home en el resto de páginas). dist/index.html se queda intacto (el
  // build limpio de vite) durante todo el recorrido; solo se sobreescribe
  // al final, una vez cerrado el navegador y el preview server.
  const paginas = []

  try {
    await esperarServidor(`http://localhost:${PUERTO}/`)

    const browser = await chromium.launch()
    const context = await browser.newContext()

    for (const { ruta } of todasLasRutas) {
      const page = await context.newPage()
      await page.goto(`http://localhost:${PUERTO}${ruta}`, { waitUntil: 'load', timeout: 20000 })
      await page.waitForTimeout(300)

      const { lang, tagsSeo, rootHtml } = await page.evaluate((selectores) => ({
        lang: document.documentElement.getAttribute('lang') || 'es',
        tagsSeo: selectores
          .flatMap((sel) => Array.from(document.head.querySelectorAll(sel)))
          .map((el) => el.outerHTML)
          .join('\n    '),
        rootHtml: document.getElementById('root')?.innerHTML || '',
      }), SELECTORES_SEO)

      await page.close()
      paginas.push({ ruta, lang, tagsSeo, rootHtml })
      console.log(`  renderizado: ${ruta}`)
    }

    await browser.close()
  } finally {
    cerrarPreview()
  }

  for (const { ruta, lang, tagsSeo, rootHtml } of paginas) {
    const htmlFinal = shellBase
      .replace(/<html lang="[^"]*"/, `<html lang="${lang}"`)
      .replace('</head>', `    ${tagsSeo}\n  </head>`)
      .replace('<div id="root"></div>', `<div id="root">${rootHtml}</div>`)

    const destino = ruta === '/'
      ? path.join(DIST, 'index.html')
      : path.join(DIST, ...ruta.split('/').filter(Boolean), 'index.html')

    await mkdir(path.dirname(destino), { recursive: true })
    await writeFile(destino, htmlFinal)
    console.log(`  escrito: ${ruta}`)
  }

  await generarSitemap()
  console.log('Prerender: listo.')
}

main().catch((err) => {
  console.error('Prerender falló:', err)
  process.exit(1)
})
