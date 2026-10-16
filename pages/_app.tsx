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
import PageMetadata from '~/components/PageMetadata'
import Providers from '~/contexts'
import { AdScriptProvider } from '~/contexts/AdScript'
import i18n from '~/i18n.json'
import { ErrorInfo } from '~/interfaces/custom/ErrorInfo'
import pkg from '~/package.json'
import '~/polyfills/promise-finally'
import '~/public/css/styles.css'
import { pageview, updateAnalyticsPageContext } from '~/utils/gtag'

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
      updateAnalyticsPageContext()
      Router.events.on('beforeHistoryChange', updateAnalyticsPageContext)
      Router.events.on('routeChangeComplete', this.trackPageview)
      this.trackPageview()
    }
  }

  componentWillUnmount() {
    Router.events.off('beforeHistoryChange', updateAnalyticsPageContext)
    Router.events.off('routeChangeComplete', this.trackPageview)
  }

  render() {
    const { Component, pageProps } = this.props

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
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1,maximum-scale=5"
          />
        </Head>
        <PageMetadata />
        <AdScriptProvider>
          <Providers>
            <Component {...pageProps} />
          </Providers>
        </AdScriptProvider>
        <ToastContainer />
      </Fragment>
    )
  }
}
