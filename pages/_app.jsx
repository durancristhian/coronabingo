import App from 'next/app'
import Head from 'next/head'
import 'typeface-inter'
import 'typeface-oswald'
import Header from '../components/Header'
import '../public/styles.css'

class Coronabingo extends App {
  render() {
    const { Component, pageProps } = this.props

    return (
      <>
        <Head>
          <title>Coronabingo</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="bg-gray-200 font-inter leading-none min-h-screen text-gray-900">
          <Header />
          <Component {...pageProps} />
        </main>
      </>
    )
  }
}

export default Coronabingo
