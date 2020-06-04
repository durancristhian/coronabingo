import useTranslation from 'next-translate/useTranslation'
import React, { Fragment } from 'react'
import TweetEmbed from 'react-tweet-embed'
import Heading from './Heading'

export default function News() {
  const { t } = useTranslation()

  const renderTweet = (id: string) => (
    <TweetEmbed id={id} options={{ align: 'center', width: 300 }} />
  )

  return (
    <Fragment>
      <div className="text-center">
        <Heading type="h2">{t('common:news')}</Heading>
      </div>
      <div className="sm:flex sm:flex-wrap sm:justify-center my-4 -mx-2">
        <div className="mx-2">{renderTweet('1266490485650198528')}</div>
        <div className="mx-2">{renderTweet('1267934678784389121')}</div>
        <div className="mx-2">{renderTweet('1246110709005660163')}</div>
      </div>
    </Fragment>
  )
}
