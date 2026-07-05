# La CrocheterIA

Web sobre crochet e inteligencia artificial: genera patrones de crochet con IA a partir de una descripción o una foto de referencia, e incluye rutas de aprendizaje con lecciones.

## Stack

- React 19 + Vite 7, CSS puro (sin TypeScript)
- React Router v7
- Supabase (autenticación y "Mis proyectos")
- Vercel Functions (`api/patron.js`) + API de Anthropic (Claude) para generar patrones
- i18n propio (español/inglés) en `src/i18n/`

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # y rellenar las variables (ver .env.example)
npm run dev                  # http://localhost:5173
```

Otros scripts: `npm run build`, `npm run preview`, `npm run lint`.

## Variables de entorno

Ver [`.env.example`](.env.example) para el detalle de cada una (Supabase, Anthropic).

## Estructura

Ver la sección "Estructura actual" en [`CLAUDE.md`](../CLAUDE.md) para el mapa completo de páginas, componentes y la función serverless.

## Despliegue

Desplegado en Vercel. Las rewrites de SPA están en `vercel.json`. Las env vars deben configurarse también en el proyecto de Vercel (Settings → Environment Variables).
