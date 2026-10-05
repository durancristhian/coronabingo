import * as Sentry from '@sentry/browser'
import Document, { Head, Html, Main, NextScript } from 'next/document'
import React, { Fragment } from 'react'
import { getAnalyticsInitializationScript } from '~/utils/analyticsPageContext'
import i18n from '~/i18n.json'

const defaultLanguage = i18n.defaultLocale

if (process.env.NODE_ENV === 'production') {
  process.on('unhandledRejection', err => {
    Sentry.captureException(err)
  })

  process.on('uncaughtException', err => {
    Sentry.captureException(err)
  })
}

export default class extends Document {
  render() {
    const lang = this.props.locale || defaultLanguage
    const trackingId = process.env.GA_TRACKING_ID?.startsWith('G-')
      ? process.env.GA_TRACKING_ID
      : undefined

    return (
      <Html lang={lang}>
        <Head>
          {/* Google Search Console */}
          {process.env.NODE_ENV === 'production' && (
            <meta
              name="google-site-verification"
              content="EmqI8hufGnrAf3Liky84ItzkmjJejzCk382djGct8HA"
            />
          )}
          {/** Google Analytics: queue configuration before loading ad scripts. */}
          {trackingId && (
            <Fragment>
              <script
                dangerouslySetInnerHTML={{
                  __html: getAnalyticsInitializationScript(trackingId),
                }}
              />
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
              />
            </Fragment>
          )}
        </Head>
        <body className="coronabingo-ui font-sans leading-normal text-gray-900 text-sm md:text-base">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
