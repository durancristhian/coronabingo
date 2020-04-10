import * as Sentry from '@sentry/browser'
import App from 'next/app'
import Head from 'next/head'
import Router from 'next/router'
import React, { Fragment } from 'react'
import { FirebaseProvider } from '~/contexts/Firebase'
import { allLanguages } from '~/i18n.json'
import { version } from '~/package.json'
import '~/public/css/styles.css'
import * as gtag from '~/utils/gtag'

if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
  })
}

if (process.env.GA_TRACKING_ID) {
  Router.events.on('routeChangeComplete', url => gtag.pageview(url))
}

export default class Coronabingo extends App {
  // @ts-ignore
  componentDidCatch(error, errorInfo) {
    if (process.env.NODE_ENV === 'production') {
      Sentry.withScope(scope => {
        Object.keys(errorInfo).forEach(key => {
          scope.setExtra(key, errorInfo[key])
        })

        Sentry.captureException(error)
      })
    }

    super.componentDidCatch(error, errorInfo)
  }

  componentDidMount() {
    console.log(`v${version}`)
  }

  render() {
    const { Component, pageProps, router } = this.props

    const locale = router.pathname.split('/')?.[1]
    const lang = allLanguages.includes(locale) && locale

    return (
      <Fragment>
        <Head>
          <link rel="icon" href="/favicon.ico" />

          {/* Google Search Console */}
          {process.env.NODE_ENV === 'production' && (
            <meta
              name="google-site-verification"
              content="EmqI8hufGnrAf3Liky84ItzkmjJejzCk382djGct8HA"
            />
          )}

          {lang === 'en' && (
            <Fragment>
              <title>Coronabingo | Bingo online</title>
              <link rel="canonical" href="https://coronabingo.now.sh/en/" />
              <link
                rel="alternate"
                hrefLang="x-default"
                href="https://coronabingo.now.sh/"
              />
              <link
                rel="alternate"
                hrefLang="en-ES"
                href="https://coronabingo.now.sh/es/"
              />
              <meta name="title" content="Coronabingo | Bingo online" />
              <meta
                name="description"
                content="CoronaBingo, now you can play free bingo with boards and a bingo spinner. Play bingo with your friends or family. #CoronaBingo"
              />
              <meta property="og:title" content="Coronabingo | Bingo online" />
              <meta
                property="og:description"
                content="CoronaBingo, now you can play free bingo with boards and a bingo spinner. Play bingo with your friends or family. #CoronaBingo"
              />
              <meta
                property="twitter:url"
                content="https://coronabingo.now.sh/en/"
              />
              <meta
                property="twitter:title"
                content="Coronabingo | Bingo online"
              />
              <meta
                property="twitter:description"
                content="CoronaBingo, now you can play free bingo with boards and a bingo spinner. Play bingo with your friends or family. #CoronaBingo"
              />
              <meta
                property="og:url"
                content="https://coronabingo.now.sh/en/"
              />
            </Fragment>
          )}

          {lang === 'es' && (
            <Fragment>
              <title>Coronabingo | Tu juego de Bingo Online</title>
              <link rel="canonical" href="https://coronabingo.now.sh/es/" />
              <link
                rel="alternate"
                hrefLang="x-default"
                href="https://coronabingo.now.sh/"
              />
              <link
                rel="alternate"
                hrefLang="en-US"
                href="https://coronabingo.now.sh/en/"
              />
              <meta
                name="title"
                content="Coronabingo | Tu juego de Bingo Online"
              />
              <meta
                name="description"
                content="CoronaBingo, ahora podés jugar al bingo gratis con bolillero y cartones incluidos. Jugá al bingo con tus amigos o familia. #CoronaBingo"
              />
              <meta
                property="og:title"
                content="Coronabingo | Tu juego de Bingo Online"
              />
              <meta
                property="og:description"
                content="CoronaBingo, ahora podés jugar al bingo gratis con bolillero y cartones incluidos. Jugá al bingo con tus amigos o familia. #CoronaBingo"
              />
              <meta
                property="twitter:url"
                content="https://coronabingo.now.sh/es/"
              />
              <meta
                property="twitter:title"
                content="Coronabingo | Tu juego de Bingo Online"
              />
              <meta
                property="twitter:description"
                content="CoronaBingo, ahora podés jugar al bingo gratis con bolillero y cartones incluidos. Jugá al bingo con tus amigos o familia. #CoronaBingo"
              />
              <meta
                property="og:url"
                content="https://coronabingo.now.sh/es/"
              />
            </Fragment>
          )}

          {!lang && (
            <Fragment>
              <title>Coronabingo | Tu juego de Bingo Online</title>
              <link rel="canonical" href="https://coronabingo.now.sh/" />
              <link
                rel="alternate"
                hrefLang="x-default"
                href="https://coronabingo.now.sh/"
              />
              <link
                rel="alternate"
                hrefLang="en-US"
                href="https://coronabingo.now.sh/en/"
              />
              <link
                rel="alternate"
                hrefLang="es-ES"
                href="https://coronabingo.now.sh/es/"
              />
              <meta
                name="title"
                content="Coronabingo | Tu juego de Bingo Online"
              />
              <meta
                name="description"
                content="CoronaBingo, ahora podés jugar al bingo gratis con bolillero y cartones incluidos. Jugá al bingo con tus amigos o familia. #CoronaBingo"
              />
              <meta
                property="og:title"
                content="Coronabingo | Tu juego de Bingo Online"
              />
              <meta
                property="og:description"
                content="CoronaBingo, ahora podés jugar al bingo gratis con bolillero y cartones incluidos. Jugá al bingo con tus amigos o familia. #CoronaBingo"
              />
              <meta
                property="twitter:url"
                content="https://coronabingo.now.sh/"
              />
              <meta
                property="twitter:title"
                content="Coronabingo | Tu juego de Bingo Online"
              />
              <meta
                property="twitter:description"
                content="CoronaBingo, ahora podés jugar al bingo gratis con bolillero y cartones incluidos. Jugá al bingo con tus amigos o familia. #CoronaBingo"
              />
              <meta property="og:url" content="https://coronabingo.now.sh/" />
            </Fragment>
          )}

          <meta property="og:type" content="website" />
          <meta
            property="og:image"
            content="https://coronabingo.now.sh/social2.jpg"
          />
          <meta property="twitter:card" content="summary_large_image" />
          <meta
            property="twitter:image"
            content="https://coronabingo.now.sh/social2.jpg"
          />
        </Head>
        <FirebaseProvider routerQuery={router.query}>
          <Component {...pageProps} />
        </FirebaseProvider>
      </Fragment>
    )
  }
}
