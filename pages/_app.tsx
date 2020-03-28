import * as Sentry from '@sentry/browser'
import App from 'next/app'
import Head from 'next/head'
import { Fragment } from 'react'
import 'typeface-inter'
import 'typeface-oswald'
import Footer from '~/components/Footer'
import Header from '~/components/Header'
import { version } from '~/package.json'
import '~/public/styles.css'

// Sentry.init({
//   dsn: process.env.SENTRY_DSN
// })

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
          <title>coronabingo - por @durancristhian - v{version}</title>
          <meta
            property="description"
            content="El clásico juego del bingo para jugar en tiempos de cuarentena."
          />
          <meta
            property="og:description"
            content="El clásico juego del bingo para jugar en tiempos de cuarentena."
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:creator" content="@durancristhian" />
          <meta property="og:url" content="https://coronabingo.now.sh/" />
          <meta property="og:title" content="Coronabingo" />
          <meta
            property="og:image"
            content="https://coronabingo.now.sh/social.jpg"
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
