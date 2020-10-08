import * as Sentry from '@sentry/browser'
import Document, { Head, Html, Main, NextScript } from 'next/document'
import React, { Fragment } from 'react'
import { allLanguages, defaultLanguage } from '~/i18n.json'

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
    const langFromUrl = this.props.__NEXT_DATA__.page.substring(1, 3)
    const lang = allLanguages.includes(langFromUrl)
      ? langFromUrl
      : defaultLanguage

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
          {/** Google AdSense */}
          {process.env.NODE_ENV === 'production' && (
            <script
              data-ad-client="ca-pub-6231280485856921"
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
            />
          )}
          {/** Google Tag Manager / Google Analytics */}
          {process.env.GA_TRACKING_ID && (
            <Fragment>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_TRACKING_ID}`}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.GA_TRACKING_ID}', {
                      page_path: window.location.pathname,
                    });
                  `,
                }}
              />
            </Fragment>
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
