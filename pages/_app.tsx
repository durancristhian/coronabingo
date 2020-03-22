import App from 'next/app'
import Head from 'next/head'
import { Fragment } from 'react'
import 'typeface-inter'
import 'typeface-oswald'
import Header from '~/components/Header'
import pkg from '~/package.json'
import '~/public/styles.css'

export default class Coronabingo extends App {
  render() {
    const { Component, pageProps } = this.props

    return (
      <Fragment>
        <Head>
          <title>Coronabingo v{pkg.version}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="bg-gray-200 font-inter leading-none min-h-screen text-gray-900">
          <Header />
          <Component {...pageProps} />
        </main>
      </Fragment>
    )
  }
}
