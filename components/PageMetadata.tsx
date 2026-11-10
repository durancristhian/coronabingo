import useTranslation from 'next-translate/useTranslation'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { Fragment } from 'react'
import {
  applicationSchema,
  publicUrl,
  siteOrigin,
  trustContent,
  trustPaths,
  TrustPage,
} from '~/utils/publicContent'

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
  const isTrust = trustPaths.some(path => pathname === `/${path}`)
  const isPublic = isHome || isTrust
  const pageUrl = publicUrl(pathname, lang)
  const trust = isTrust
    ? trustContent(lang)[pathname.slice(1) as TrustPage]
    : undefined

  // Route templates keep room/player identifiers out of metadata. Only the
  // public pages are indexable; error pages retain Next.js's own document title.
  const title = trust
    ? `${trust.title} | Coronabingo`
    : page
    ? t(`seo-${page}-title`)
    : undefined
  const description =
    trust?.description || (page ? t(`seo-${page}-description`) : undefined)

  return (
    <Head>
      {(page || trust) && (
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
            content={`${siteOrigin}/social.jpg`}
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
            content={`${siteOrigin}/social.jpg`}
            key="twitter:image"
          />
        </Fragment>
      )}
      {isHome && (
        <script
          type="application/ld+json"
          key="application-schema"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(applicationSchema(lang)).replace(
              /</g,
              '\\u003c',
            ),
          }}
        />
      )}
      {isPublic ? (
        <Fragment>
          <link rel="describedby" href={`${siteOrigin}/llms.txt`} key="llms" />
          <link rel="canonical" href={pageUrl} key="canonical" />
          <link
            rel="alternate"
            hrefLang="es"
            href={publicUrl(pathname, 'es')}
            key="alternate-es"
          />
          <link
            rel="alternate"
            hrefLang="en"
            href={publicUrl(pathname, 'en')}
            key="alternate-en"
          />
          <link
            rel="alternate"
            hrefLang="x-default"
            href={publicUrl(pathname, 'es')}
            key="alternate-default"
          />
          <meta property="og:url" content={pageUrl} key="og:url" />
          <meta name="twitter:url" content={pageUrl} key="twitter:url" />
        </Fragment>
      ) : (
        <meta name="robots" content="noindex" key="robots" />
      )}
    </Head>
  )
}
