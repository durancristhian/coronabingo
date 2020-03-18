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
        <main className="bg-orange-300 font-sans min-h-screen">
          <div className="max-w-5xl mx-auto">
            <div className="px-4 py-8">
              <div className="flex items-center justify-center">
                <div className="crown mr-8">
                  <Corona className="h-12 sm:h-24" />
                </div>
                <h1 className="flex font-bold font-bungee-shade justify-center text-4xl sm:text-6xl">
                  <span className="title-letter">B</span>
                  <span className="ml-4 mr-2 title-letter">I</span>
                  <span className="title-letter">N</span>
                  <span className="ml-2 mr-4 title-letter">G</span>
                  <span className="title-letter">O</span>
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
