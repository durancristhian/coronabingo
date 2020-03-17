import App from 'next/app'
import Head from 'next/head'
import 'typeface-bungee-shade'
import 'typeface-oswald'
import '../public/styles.css'
import Corona from '../public/corona.svg'

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props

    return (
      <>
        <Head>
          <title>Coronabingo</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="bg-orange-300 flex items-center font-sans min-h-screen">
          <div className="max-w-5xl mx-auto">
            <div className="px-4 py-8">
              <div className="flex items-center justify-center">
                <div className="crown">
                  <Corona className="h-24" />
                </div>
                <h1 className="font-bungee-shade title">
                  <span>B</span>
                  <span>I</span>
                  <span>N</span>
                  <span>G</span>
                  <span>O</span>
                </h1>
              </div>
              <Component {...pageProps} />
            </div>
          </div>
        </main>
      </>
    )
  }
}

export default MyApp
