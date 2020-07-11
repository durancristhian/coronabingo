import useTranslation from 'next-translate/useTranslation'
import React, { Fragment, memo } from 'react'
import TweetEmbed from 'react-tweet-embed'
import Heading from '~/components/Heading'

interface Props {
  tweetIds: string[]
}

export default memo(function News({ tweetIds }: Props) {
  const { t } = useTranslation()

  return (
    <Fragment>
      <Heading textAlign="center" type="h2">
        {t('common:news')}
      </Heading>
      <div className="sm:flex my-4 -mx-2">
        {tweetIds.map(id => (
          <div key={id} className="flex-1 mx-2">
            <TweetEmbed id={id} />
          </div>
        ))}
      </div>
    </Fragment>
  )
})
