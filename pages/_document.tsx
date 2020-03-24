import * as Sentry from '@sentry/browser'
import Document, { Head, Main, NextScript } from 'next/document'

process.on('unhandledRejection', err => {
  Sentry.captureException(err)
})

process.on('uncaughtException', err => {
  Sentry.captureException(err)
})

export default class extends Document {
  render() {
    return (
      <html>
        <Head>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${process.env.GA_TRACKING_ID}');`
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
