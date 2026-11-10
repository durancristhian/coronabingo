import esHome from '~/locales/es/index.json'
import enHome from '~/locales/en/index.json'
import esCommon from '~/locales/es/common.json'
import enCommon from '~/locales/en/common.json'
import esTrust from '~/locales/es/trust.json'
import enTrust from '~/locales/en/trust.json'

export const siteOrigin = 'https://coronabingo.com.ar'
export const trustPaths = ['about', 'contact', 'privacy'] as const
export type TrustPage = typeof trustPaths[number]
export const trustContent = (lang: string) =>
  lang === 'en' ? enTrust : esTrust
export const publicUrl = (path: string, lang: string) =>
  `${siteOrigin}${lang === 'en' ? '/en' : ''}${
    path === '/' ? (lang === 'en' ? '' : '/') : path
  }`

export function publicLinks(lang: string) {
  const content = trustContent(lang)
  return [
    { label: lang === 'en' ? 'Home' : 'Inicio', url: publicUrl('/', lang) },
    ...trustPaths.map(path => ({
      label: content[path].title,
      url: publicUrl(`/${path}`, lang),
    })),
    { label: 'Twitter', url: 'https://twitter.com/corona_bingo' },
    { label: 'Cristhian Duran', url: 'https://twitter.com/DuranCristhian' },
    {
      label: lang === 'en' ? 'Send feedback' : 'Enviar comentarios',
      url: 'https://forms.gle/egSBrsKSFnEgabff7',
    },
  ]
}

export function publicMarkdown(path: string, lang: string) {
  const en = lang === 'en'
  const links = publicLinks(lang)
    .map(link => `- [${link.label}](${link.url})`)
    .join('\n')
  if (path !== '/') {
    const page = trustContent(lang)[path.slice(1) as TrustPage]
    return `# ${page.title}\n\n${page.paragraphs.join('\n\n')}\n\n${links}\n`
  }
  const home = en ? enHome : esHome
  const steps = Object.values(home['how-to-play']).filter(
    value => typeof value !== 'string',
  ) as { title: string; description: string }[]
  const questions = Object.values(home.faq).filter(
    value => typeof value !== 'string',
  ) as { question: string; answer: string }[]
  return [
    '# Coronabingo',
    home.intro,
    home.description,
    `## ${home['how-to-play'].title}`,
    ...steps.map(step => `### ${step.title}\n\n${step.description}`),
    `## ${home.faq.title}`,
    ...questions.map(
      faq =>
        `### ${faq.question}\n\n${faq.answer.replace(
          '<0>Google Meet</0>',
          '[Google Meet](https://meet.google.com/)',
        )}`,
    ),
    links,
    `[Agent instructions](${siteOrigin}/llms.txt)`,
    '',
  ].join('\n\n')
}

export function applicationSchema(lang: string) {
  const common = lang === 'en' ? enCommon : esCommon
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${siteOrigin}/#application`,
    name: 'Coronabingo',
    description: common['seo-home-description'],
    url: publicUrl('/', lang),
    applicationCategory: 'GameApplication',
    operatingSystem: 'Web browser',
    inLanguage: ['es', 'en'],
    keywords:
      lang === 'en'
        ? 'online bingo, bingo with friends'
        : 'bingo online, bingo con amigos',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'ARS' },
    creator: {
      '@type': 'Person',
      name: 'Cristhian Duran',
      url: 'https://twitter.com/DuranCristhian',
    },
    sameAs: ['https://twitter.com/corona_bingo'],
  }
}
