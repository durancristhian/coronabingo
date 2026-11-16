import useTranslation from 'next-translate/useTranslation'
import React, { Fragment } from 'react'
import Anchor from '~/components/Anchor'
import Heading from '~/components/Heading'

interface NewsPost {
  id: string
  /** Quoted post text: it stays in the post's language in every locale. */
  alt: string
  height: number
}

// Rendered once with @xeet/core 0.1.0 (web-detail, light, 275px at 2x).
const NEWS_POSTS: NewsPost[] = [
  {
    id: '1266490485650198528',
    alt:
      'Post de Canal Siete (@CanalSieteOk) del 29 de mayo de 2020: «@CaroloVazquez nos presenta un juego ideal para esta #cuarentena: @corona_bingo. En @altavozatv conversamos con su creador @DuranCristhian y conocemos las reglas del juego». Incluye un video de 3 minutos y 45 segundos.',
    height: 465,
  },
  {
    id: '1267934678784389121',
    alt:
      'Post de CoronaBingo (@corona_bingo) del 2 de junio de 2020: «Les comparto la grabación de anoche en #SensacionalExito donde @DuranCristhian habló de como me creó por si no pudieron escucharlo», con un enlace a la grabación en Google Drive. Cita otro post de @corona_bingo: «Es hora de salir en vivooo! @DuranCristhian hablando de mi en #SensacionalExito @Metro951», con una foto de @DuranCristhian hablando frente a su notebook.',
    height: 667,
  },
  {
    id: '1246110709005660163',
    alt:
      'Post de Clarín Tecnología (@clarintecno) del 3 de abril de 2020: «Tutti frutti, T.E.G, Bingo y más aplicaciones para jugar durante la cuarentena por coronavirus», con un enlace a la nota en clarin.com. La imagen de la nota muestra cartones de Coronabingo junto a una videollamada grupal.',
    height: 405,
  },
  {
    id: '1279431298990379012',
    alt:
      'Post de Tomás Balmaceda (@capitanintriga) del 4 de julio de 2020: «El bingo tiene más de 500 años y vivió muchas vidas. Ahora tiene nuevas encarnaciones digitales y lúdicas gracias a argentinos sagaces en plena cuarentena. Escribí sobre @corona_bingo y @BingoPandemia en La Nación», con un enlace a la nota en lanacion.com.ar.',
    height: 412,
  },
]

const POST_WIDTH = 275

export default function News() {
  const { t } = useTranslation()

  return (
    <Fragment>
      <Heading textAlign="center" type="h2">
        {t('common:news')}
      </Heading>
      <ul className="flex flex-wrap justify-center items-start my-4 -mx-2">
        {NEWS_POSTS.map(post => (
          <li key={post.id} className="m-2">
            <Anchor
              href={`https://twitter.com/i/web/status/${post.id}`}
              id={`news-${post.id}`}
              display="block"
            >
              <img
                src={`/news/${post.id}.webp`}
                alt={post.alt}
                lang="es"
                width={POST_WIDTH}
                height={post.height}
                loading="lazy"
                decoding="async"
                className="block rounded-lg border border-gray-300"
              />
            </Anchor>
          </li>
        ))}
      </ul>
    </Fragment>
  )
}
