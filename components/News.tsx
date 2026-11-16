import useTranslation from 'next-translate/useTranslation'
import React, { Fragment } from 'react'
import Anchor from '~/components/Anchor'
import Heading from '~/components/Heading'

interface NewsPost {
  id: string
  /** Content-versioned file in public/news (see docs/development.md). */
  src: string
  height: number
  name: string
  handle: string
  /** Calendar date in Argentina, where the posts were published. */
  date: string
  /** Literal post text: it stays in Spanish in every locale. */
  text: string
  media: { key: string; quote?: string }
}

const NEWS_POSTS: NewsPost[] = [
  {
    id: '1266490485650198528',
    src: '/news/1266490485650198528.acf2facbd00a.webp',
    height: 465,
    name: 'Canal Siete',
    handle: 'CanalSieteOk',
    date: '2020-05-29',
    text:
      '@CaroloVazquez nos presenta un juego ideal para esta #cuarentena: @corona_bingo. En @altavozatv conversamos con su creador @DuranCristhian y conocemos las reglas del juego',
    media: { key: 'news-media-canal-siete' },
  },
  {
    id: '1267934678784389121',
    src: '/news/1267934678784389121.ca4c7edd7be4.webp',
    height: 667,
    name: 'CoronaBingo',
    handle: 'corona_bingo',
    date: '2020-06-02',
    text:
      'Les comparto la grabación de anoche en #SensacionalExito donde @DuranCristhian habló de como me creó por si no pudieron escucharlo',
    media: {
      key: 'news-media-corona-bingo',
      quote:
        'Es hora de salir en vivooo! @DuranCristhian hablando de mi en #SensacionalExito @Metro951',
    },
  },
  {
    id: '1246110709005660163',
    src: '/news/1246110709005660163.925d236c381a.webp',
    height: 405,
    name: 'Clarín Tecnología',
    handle: 'clarintecno',
    date: '2020-04-03',
    text:
      'Tutti frutti, T.E.G, Bingo y más aplicaciones para jugar durante la cuarentena por coronavirus',
    media: { key: 'news-media-clarin' },
  },
  {
    id: '1279431298990379012',
    src: '/news/1279431298990379012.6cb0d1520a50.webp',
    height: 412,
    name: 'Tomás Balmaceda',
    handle: 'capitanintriga',
    date: '2020-07-04',
    text:
      'El bingo tiene más de 500 años y vivió muchas vidas. Ahora tiene nuevas encarnaciones digitales y lúdicas gracias a argentinos sagaces en plena cuarentena. Escribí sobre @corona_bingo y @BingoPandemia en La Nación',
    media: { key: 'news-media-la-nacion' },
  },
]

// Rendered once with @xeet/core 0.1.0 (web-detail, light, 275px at 2x).
const POST_WIDTH = 275

export default function News() {
  const { t, lang } = useTranslation()
  const formatDate = new Intl.DateTimeFormat(lang, {
    dateStyle: 'long',
    timeZone: 'UTC',
  })

  return (
    <Fragment>
      <Heading textAlign="center" type="h2">
        {t('common:news')}
      </Heading>
      <ul className="flex flex-wrap justify-center items-start my-4 -mx-2">
        {NEWS_POSTS.map(post => {
          const alt = [
            t('common:news-post', {
              name: post.name,
              handle: post.handle,
              date: formatDate.format(new Date(`${post.date}T12:00:00Z`)),
              text: post.text,
            }),
            t(`common:${post.media.key}`, { quote: post.media.quote }),
          ].join(' ')

          return (
            <li key={post.id} className="m-2">
              <Anchor
                href={`https://twitter.com/i/web/status/${post.id}`}
                id={`news-${post.id}`}
                variant="image"
              >
                <img
                  src={post.src}
                  alt={alt}
                  width={POST_WIDTH}
                  height={post.height}
                  loading="lazy"
                  decoding="async"
                  className="block rounded-lg border border-gray-300"
                />
              </Anchor>
            </li>
          )
        })}
      </ul>
    </Fragment>
  )
}
