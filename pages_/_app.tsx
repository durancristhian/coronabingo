import * as Sentry from '@sentry/browser'
import App from 'next/app'
import Head from 'next/head'
import { Fragment } from 'react'
import 'typeface-inter'
import 'typeface-oswald'
import Metatags from '~/components/Metatags'
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
    const { Component, pageProps, router } = this.props

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

          <Metatags pathname={router.pathname} />
        </Head>
        <Component {...pageProps} />
      </Fragment>
    )
  }
}
