import useTranslation from 'next-translate/useTranslation'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { Fragment } from 'react'

const origin = 'https://coronabingo.com.ar'
const pages: Record<string, string> = {
  '/': 'home',
  '/room/[roomId]': 'room',
  '/room/[roomId]/admin': 'admin',
  '/room/[roomId]/[playerId]': 'player',
}

export default function PageMetadata() {
  const { t, lang } = useTranslation('common')
  const { pathname } = useRouter()
  const page = pages[pathname]
  const isHome = pathname === '/'
  const homeUrl = lang === 'en' ? `${origin}/en` : `${origin}/`

  // Route templates keep room/player identifiers out of metadata. Only the
  // homepage is indexable; error pages retain Next.js's own document title.
  const title = page ? t(`seo-${page}-title`) : undefined
  const description = page ? t(`seo-${page}-description`) : undefined

  return (
    <Head>
      {page && (
        <Fragment>
          <title>{title}</title>
          <meta name="description" content={description} key="description" />
          <meta property="og:title" content={title} key="og:title" />
          <meta
            property="og:description"
            content={description}
            key="og:description"
          />
          <meta property="og:type" content="website" key="og:type" />
          <meta
            property="og:site_name"
            content="Coronabingo"
            key="og:site_name"
          />
          <meta
            property="og:image"
            content={`${origin}/social.jpg`}
            key="og:image"
          />
          <meta
            name="twitter:card"
            content="summary_large_image"
            key="twitter:card"
          />
          <meta name="twitter:title" content={title} key="twitter:title" />
          <meta
            name="twitter:description"
            content={description}
            key="twitter:description"
          />
          <meta
            name="twitter:image"
            content={`${origin}/social.jpg`}
            key="twitter:image"
          />
        </Fragment>
      )}
      {isHome ? (
        <Fragment>
          <link rel="canonical" href={homeUrl} key="canonical" />
          <link
            rel="alternate"
            hrefLang="es"
            href={`${origin}/`}
            key="alternate-es"
          />
          <link
            rel="alternate"
            hrefLang="en"
            href={`${origin}/en`}
            key="alternate-en"
          />
          <link
            rel="alternate"
            hrefLang="x-default"
            href={`${origin}/`}
            key="alternate-default"
          />
          <meta property="og:url" content={homeUrl} key="og:url" />
          <meta name="twitter:url" content={homeUrl} key="twitter:url" />
        </Fragment>
      ) : (
        <meta name="robots" content="noindex" key="robots" />
      )}
    </Head>
  )
}
