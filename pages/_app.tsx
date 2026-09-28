import * as Sentry from '@sentry/browser'
import App from 'next/app'
import {
  Atkinson_Hyperlegible_Next,
  Bricolage_Grotesque,
} from 'next/font/google'
import Head from 'next/head'
import Router from 'next/router'
import React, { Fragment } from 'react'
import { ToastContainer } from 'react-toastify'
import Providers from '~/contexts'
import i18n from '~/i18n.json'
import { ErrorInfo } from '~/interfaces/custom/ErrorInfo'
import pkg from '~/package.json'
import '~/polyfills/promise-finally'
import '~/public/css/styles.css'
import { pageview } from '~/utils/gtag'

const version = pkg.version
const defaultLanguage = i18n.defaultLocale

const headingFont = Bricolage_Grotesque({
  display: 'swap',
  subsets: ['latin'],
  weight: '700',
})

const bodyFont = Atkinson_Hyperlegible_Next({
  adjustFontFallback: false,
  display: 'swap',
  subsets: ['latin'],
  weight: 'variable',
})

if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
  })
}

export default class Coronabingo extends App {
  private trackPageview = () => {
    // next/head updates in a passive effect; wait until after the first paint.
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() =>
        pageview({
          defaultLocale: defaultLanguage,
          locale: Router.locale,
          pathname: Router.pathname,
        }),
      )
    })
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (process.env.NODE_ENV === 'production') {
      Sentry.withScope(scope => {
        Object.keys(errorInfo).forEach(key => {
          scope.setExtra(key, errorInfo[key])
        })

        Sentry.captureException(error)
      })
    }
  }

  componentDidMount() {
    console.log(`v${version}`)
    if (process.env.GA_TRACKING_ID) {
      Router.events.on('routeChangeComplete', this.trackPageview)
      this.trackPageview()
    }
  }

  componentWillUnmount() {
    Router.events.off('routeChangeComplete', this.trackPageview)
  }

  render() {
    const { Component, pageProps, router } = this.props

    const locale = router.locale || defaultLanguage
    const lang =
      locale === defaultLanguage && router.asPath === '/' ? '' : locale

    return (
      <Fragment>
        <Head>
          <style>{`
            :root {
              --cb-font-heading: ${headingFont.style.fontFamily};
            }
            body.coronabingo-ui {
              font-family: ${bodyFont.style.fontFamily};
            }
          `}</style>
          <link rel="icon" href="/favicon.ico" />
          {lang === 'en' && (
            <Fragment>
              <title>Coronabingo | Bingo online</title>
              <link rel="canonical" href="https://coronabingo.com.ar/en/" />
              <link
                rel="alternate"
                hrefLang="x-default"
                href="https://coronabingo.com.ar/"
              />
              <link
                rel="alternate"
                hrefLang="en-ES"
                href="https://coronabingo.com.ar/es/"
              />
              <meta name="title" content="Coronabingo | Bingo online" />
              <meta
                name="description"
                content="Play bingo online for free with friends and family. Coronabingo includes bingo cards and an online caller."
              />
              <meta property="og:title" content="Coronabingo | Bingo online" />
              <meta
                property="og:description"
                content="Play bingo online for free with friends and family. Coronabingo includes bingo cards and an online caller."
              />
              <meta
                property="twitter:url"
                content="https://coronabingo.com.ar/en/"
              />
              <meta
                property="twitter:title"
                content="Coronabingo | Bingo online"
              />
              <meta
                property="twitter:description"
                content="Play bingo online for free with friends and family. Coronabingo includes bingo cards and an online caller."
              />
              <meta
                property="og:url"
                content="https://coronabingo.com.ar/en/"
              />
            </Fragment>
          )}

          {lang === 'es' && (
            <Fragment>
              <title>Coronabingo | Tu juego de Bingo Online</title>
              <link rel="canonical" href="https://coronabingo.com.ar/es/" />
              <link
                rel="alternate"
                hrefLang="x-default"
                href="https://coronabingo.com.ar/"
              />
              <link
                rel="alternate"
                hrefLang="en-US"
                href="https://coronabingo.com.ar/en/"
              />
              <meta
                name="title"
                content="Coronabingo | Tu juego de Bingo Online"
              />
              <meta
                name="description"
                content="Juega al bingo online gratis con amigos y familia. Coronabingo incluye cartones y un bolillero online."
              />
              <meta
                property="og:title"
                content="Coronabingo | Tu juego de Bingo Online"
              />
              <meta
                property="og:description"
                content="Juega al bingo online gratis con amigos y familia. Coronabingo incluye cartones y un bolillero online."
              />
              <meta
                property="twitter:url"
                content="https://coronabingo.com.ar/es/"
              />
              <meta
                property="twitter:title"
                content="Coronabingo | Tu juego de Bingo Online"
              />
              <meta
                property="twitter:description"
                content="Juega al bingo online gratis con amigos y familia. Coronabingo incluye cartones y un bolillero online."
              />
              <meta
                property="og:url"
                content="https://coronabingo.com.ar/es/"
              />
            </Fragment>
          )}

          {!lang && (
            <Fragment>
              <title>Coronabingo | Tu juego de Bingo Online</title>
              <link rel="canonical" href="https://coronabingo.com.ar/" />
              <link
                rel="alternate"
                hrefLang="x-default"
                href="https://coronabingo.com.ar/"
              />
              <link
                rel="alternate"
                hrefLang="en-US"
                href="https://coronabingo.com.ar/en/"
              />
              <link
                rel="alternate"
                hrefLang="es-ES"
                href="https://coronabingo.com.ar/es/"
              />
              <meta
                name="title"
                content="Coronabingo | Tu juego de Bingo Online"
              />
              <meta
                name="description"
                content="Juega al bingo online gratis con amigos y familia. Coronabingo incluye cartones y un bolillero online."
              />
              <meta
                property="og:title"
                content="Coronabingo | Tu juego de Bingo Online"
              />
              <meta
                property="og:description"
                content="Juega al bingo online gratis con amigos y familia. Coronabingo incluye cartones y un bolillero online."
              />
              <meta
                property="twitter:url"
                content="https://coronabingo.com.ar/"
              />
              <meta
                property="twitter:title"
                content="Coronabingo | Tu juego de Bingo Online"
              />
              <meta
                property="twitter:description"
                content="Juega al bingo online gratis con amigos y familia. Coronabingo incluye cartones y un bolillero online."
              />
              <meta property="og:url" content="https://coronabingo.com.ar/" />
            </Fragment>
          )}
          <meta property="og:type" content="website" />
          <meta
            property="og:image"
            content="https://coronabingo.com.ar/social.jpg"
          />
          <meta property="twitter:card" content="summary_large_image" />
          <meta
            property="twitter:image"
            content="https://coronabingo.com.ar/social.jpg"
          />
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1,maximum-scale=5"
          />
        </Head>
        <Providers>
          <Component {...pageProps} />
        </Providers>
        <ToastContainer />
      </Fragment>
    )
  }
}
