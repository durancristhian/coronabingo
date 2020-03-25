import * as Sentry from '@sentry/browser'
import App from 'next/app'
import Head from 'next/head'
import { Fragment } from 'react'
import 'typeface-inter'
import 'typeface-oswald'
import Footer from '~/components/Footer'
import Header from '~/components/Header'
import '~/public/styles.css'

Sentry.init({
  dsn: process.env.SENTRY_DSN
})

export default class Coronabingo extends App {
  // @ts-ignore
  componentDidCatch(error, errorInfo) {
    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key])
      })

      Sentry.captureException(error)
    })

    super.componentDidCatch(error, errorInfo)
  }

  render() {
    const { Component, pageProps } = this.props

    return (
      <Fragment>
        <Head>
          <link rel="icon" href="/favicon.ico" />

          {/* Primary Meta Tags */}
          <title>Coronabingo</title>
          <meta name="title" content="Coronabingo" />
          <meta
            name="description"
            content="CoronaBingo, el clásico juego del bingo para jugar en tiempos de cuarentena. #CoronaBingo"
          />

          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://coronabingo.now.sh/" />
          <meta property="og:title" content="Coronabingo" />
          <meta
            property="og:description"
            content="CoronaBingo, el clásico juego del bingo para jugar en tiempos de cuarentena. #CoronaBingo"
          />
          <meta
            property="og:image"
            content="https://coronabingo.now.sh/social2.jpg"
          />

          {/* Twitter */}
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://coronabingo.now.sh/" />
          <meta property="twitter:title" content="Coronabingo" />
          <meta
            property="twitter:description"
            content="CoronaBingo, el clásico juego del bingo para jugar en tiempos de cuarentena. #CoronaBingo"
          />
          <meta
            property="twitter:image"
            content="https://coronabingo.now.sh/social2.jpg"
          />
        </Head>
        <main className="bg-gray-200 flex flex-col font-inter leading-none min-h-screen text-gray-900">
          <Header />
          <div className="flex-auto">
            <Component {...pageProps} />
          </div>
          <Footer />
        </main>
      </Fragment>
    )
  }
}
