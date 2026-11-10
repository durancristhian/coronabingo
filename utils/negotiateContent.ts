import Negotiator from 'negotiator'

export const negotiateContent = (accept: string | undefined) =>
  new Negotiator({ headers: { accept } }).mediaType([
    'text/html',
    'text/markdown',
  ])

export const negotiatedHeaders = {
  Vary: 'Accept',
  // Do not rely on a provider-specific shared cache key for Accept variants.
  'Cache-Control': 'private, no-store',
}

export const missingMarkdown = (lang: string) =>
  lang === 'en'
    ? '# 404: Page not found\n\nThe requested page does not exist. Read the [Coronabingo agent instructions](https://coronabingo.com.ar/llms.txt) to find available pages.\n'
    : '# 404: Página no encontrada\n\nLa página solicitada no existe. Consulta las [instrucciones de Coronabingo para agentes](https://coronabingo.com.ar/llms.txt) para encontrar las páginas disponibles.\n'
