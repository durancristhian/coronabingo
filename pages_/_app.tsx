import * as Sentry from '@sentry/browser'
import App from 'next/app'
import Head from 'next/head'
import { Fragment } from 'react'
import 'typeface-inter'
import 'typeface-oswald'
import { version } from '~/package.json'
import '~/public/css/styles.css'

if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN
  })
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
    const { Component, pageProps } = this.props

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

          {/* Primary Meta Tags */}
          <title>Coronabingo</title>
          <meta name="title" content="Coronabingo | Tu juego de Bingo Online" />
          <meta
            name="description"
            content="CoronaBingo, ahora podés jugar al bingo gratis con bolillero y cartones incluidos. Jugá al bingo con tus amigos o familia. #CoronaBingo"
          />
          <link rel="canonical" href="https://coronabingo.now.sh/" />

          <link rel="alternate" hreflang="x-default" href="https://coronabingo.now.sh/"/>
          <link rel="alternate" hreflang="en-US" href="https://coronabingo.now.sh/en/"/>
          <link rel="alternate" hreflang="es-ES" href="https://coronabingo.now.sh/es/"/>

          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://coronabingo.now.sh/" />
          <meta property="og:title" content="Coronabingo | Tu juego de Bingo Online" />
          <meta
            property="og:description"
            content="CoronaBingo, ahora podés jugar al bingo gratis con bolillero y cartones incluidos. Jugá al bingo con tus amigos o familia. #CoronaBingo"
          />
          <meta
            property="og:image"
            content="https://coronabingo.now.sh/social2.jpg"
          />

          {/* Twitter */}
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://coronabingo.now.sh/" />
          <meta property="twitter:title" content="Coronabingo | Tu juego de Bingo Online" />
          <meta
            property="twitter:description"
            content="CoronaBingo, ahora podés jugar al bingo gratis con bolillero y cartones incluidos. Jugá al bingo con tus amigos o familia. #CoronaBingo"
          />
          <meta
            property="twitter:image"
            content="https://coronabingo.now.sh/social2.jpg"
          />
        </Head>
        <Component {...pageProps} />
      </Fragment>
    )
  }
}
