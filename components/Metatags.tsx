import { Fragment } from 'react'
import { allLanguages } from '~/i18n.json'

interface IProps {
  pathname: string
}

export default function Metatags({ pathname }: IProps) {
  const locale = pathname.split('/')?.[1]
  const lang = allLanguages.includes(locale) && locale

  return (
    <Fragment>
      {lang === 'en' && (
        <Fragment>
          <link rel="canonical" href="https://coronabingo.now.sh/en/" />
          <link
            rel="alternate"
            hrefLang="x-default"
            href="https://coronabingo.now.sh/"
          />
          <link
            rel="alternate"
            hrefLang="en-ES"
            href="https://coronabingo.now.sh/es/"
          />
          <title>Coronabingo | Bingo online</title>
          <meta name="title" content="Coronabingo | Bingo online" />
          <meta
            name="description"
            content="CoronaBingo, now you can play free bingo with boards and a turning globe. Play bingo with your friends or family. #CoronaBingo"
          />
          <meta property="og:title" content="Coronabingo | Bingo online" />
          <meta
            property="og:description"
            content="CoronaBingo, now you can play free bingo with boards and a turning globe. Play bingo with your friends or family. #CoronaBingo"
          />
          <meta
            property="twitter:url"
            content="https://coronabingo.now.sh/en/"
          />
          <meta property="twitter:title" content="Coronabingo | Bingo online" />
          <meta
            property="twitter:description"
            content="CoronaBingo, now you can play free bingo with boards and a turning globe. Play bingo with your friends or family. #CoronaBingo"
          />
          <meta property="og:url" content="https://coronabingo.now.sh/en/" />
        </Fragment>
      )}

      {lang === 'es' && (
        <Fragment>
          <link rel="canonical" href="https://coronabingo.now.sh/es/" />
          <link
            rel="alternate"
            hrefLang="x-default"
            href="https://coronabingo.now.sh/"
          />
          <link
            rel="alternate"
            hrefLang="en-US"
            href="https://coronabingo.now.sh/en/"
          />
          <title>Coronabingo | Tu juego de Bingo Online</title>
          <meta name="title" content="Coronabingo | Tu juego de Bingo Online" />
          <meta
            name="description"
            content="CoronaBingo, ahora podés jugar al bingo gratis con bolillero y cartones incluidos. Jugá al bingo con tus amigos o familia. #CoronaBingo"
          />
          <meta
            property="og:title"
            content="Coronabingo | Tu juego de Bingo Online"
          />
          <meta
            property="og:description"
            content="CoronaBingo, ahora podés jugar al bingo gratis con bolillero y cartones incluidos. Jugá al bingo con tus amigos o familia. #CoronaBingo"
          />
          <meta
            property="twitter:url"
            content="https://coronabingo.now.sh/es/"
          />
          <meta
            property="twitter:title"
            content="Coronabingo | Tu juego de Bingo Online"
          />
          <meta
            property="twitter:description"
            content="CoronaBingo, ahora podés jugar al bingo gratis con bolillero y cartones incluidos. Jugá al bingo con tus amigos o familia. #CoronaBingo"
          />
          <meta property="og:url" content="https://coronabingo.now.sh/es/" />
        </Fragment>
      )}

      {!lang && (
        <Fragment>
          <link rel="canonical" href="https://coronabingo.now.sh/" />
          <link
            rel="alternate"
            hrefLang="x-default"
            href="https://coronabingo.now.sh/"
          />
          <link
            rel="alternate"
            hrefLang="en-US"
            href="https://coronabingo.now.sh/en/"
          />
          <link
            rel="alternate"
            hrefLang="es-ES"
            href="https://coronabingo.now.sh/es/"
          />
          <title>Coronabingo | Tu juego de Bingo Online</title>
          <meta name="title" content="Coronabingo | Tu juego de Bingo Online" />
          <meta
            name="description"
            content="CoronaBingo, ahora podés jugar al bingo gratis con bolillero y cartones incluidos. Jugá al bingo con tus amigos o familia. #CoronaBingo"
          />
          <meta
            property="og:title"
            content="Coronabingo | Tu juego de Bingo Online"
          />
          <meta
            property="og:description"
            content="CoronaBingo, ahora podés jugar al bingo gratis con bolillero y cartones incluidos. Jugá al bingo con tus amigos o familia. #CoronaBingo"
          />
          <meta property="twitter:url" content="https://coronabingo.now.sh/" />
          <meta
            property="twitter:title"
            content="Coronabingo | Tu juego de Bingo Online"
          />
          <meta
            property="twitter:description"
            content="CoronaBingo, ahora podés jugar al bingo gratis con bolillero y cartones incluidos. Jugá al bingo con tus amigos o familia. #CoronaBingo"
          />
          <meta property="og:url" content="https://coronabingo.now.sh/" />
        </Fragment>
      )}

      <meta property="og:type" content="website" />
      <meta
        property="og:image"
        content="https://coronabingo.now.sh/social2.jpg"
      />
      <meta property="twitter:card" content="summary_large_image" />
      <meta
        property="twitter:image"
        content="https://coronabingo.now.sh/social2.jpg"
      />
    </Fragment>
  )
}

interface ILanguage {
  [key: string]: string
}
