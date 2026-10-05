import useTranslation from 'next-translate/useTranslation'
import React, { Fragment, memo, useEffect, useRef, useState } from 'react'
import TweetEmbed from '~/components/TweetEmbed'
import Heading from '~/components/Heading'

interface Props {
  tweetIds: string[]
}

export default memo(function News({ tweetIds }: Props) {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const [loadTweets, setLoadTweets] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    // Older browsers keep the existing eager-loading behavior.
    if (!('IntersectionObserver' in window)) {
      setLoadTweets(true)
      return
    }

    let active = true
    const observer = new IntersectionObserver(
      entries => {
        if (!active || !entries.some(entry => entry.isIntersecting)) return
        setLoadTweets(true)
        observer.disconnect()
      },
      { rootMargin: '100px 0px' },
    )
    observer.observe(container)

    return () => {
      active = false
      observer.disconnect()
    }
  }, [])

  return (
    <Fragment>
      <Heading textAlign="center" type="h2">
        {t('common:news')}
      </Heading>
      <div ref={containerRef} className="sm:flex sm:flex-wrap my-4 -mx-2">
        {loadTweets &&
          tweetIds.map(id => (
            <div key={id} className="mx-2">
              <TweetEmbed id={id} />
            </div>
          ))}
      </div>
    </Fragment>
  )
})
