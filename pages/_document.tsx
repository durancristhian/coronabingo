import * as Sentry from '@sentry/browser'
import Document, { Head, Html, Main, NextScript } from 'next/document'
import React, { Fragment } from 'react'
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
          {process.env.GA_TRACKING_ID && (
            <Fragment>
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.GA_TRACKING_ID}');
                  `,
                }}
              />
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_TRACKING_ID}`}
              />
            </Fragment>
          )}
          {/** Google AdSense */}
          {process.env.NODE_ENV === 'production' &&
            process.env.UI_TESTS !== '1' && (
              <script
                data-ad-client="ca-pub-6231280485856921"
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
              />
            )}
        </Head>
        <body className="font-sans leading-normal text-gray-900 text-sm md:text-base">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
