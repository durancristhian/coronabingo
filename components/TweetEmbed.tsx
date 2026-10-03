import useTranslation from 'next-translate/useTranslation'
import React, { useEffect, useRef, useState } from 'react'
import Anchor from '~/components/Anchor'
import { loadTwitterWidgets } from '~/utils/twitterWidgets'

export default function TweetEmbed({ id }: { id: string }) {
  const targetRef = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    const target = targetRef.current
    if (!target) return
    let active = true
    setFailed(false)

    const renderTweet = async () => {
      try {
        const widgets = await loadTwitterWidgets()
        if (!active || !target.isConnected) return
        const tweet = await widgets.createTweet(id, target, {
          align: 'center',
          width: 275,
        })
        if (active && !tweet) {
          target.replaceChildren()
          setFailed(true)
        }
      } catch {
        // Optional external content must not break the room or its navigation.
        if (active) {
          target.replaceChildren()
          setFailed(true)
        }
      }
    }
    void renderTweet()

    return () => {
      active = false
      target.replaceChildren()
    }
  }, [id])

  return (
    <div>
      <div ref={targetRef} />
      {failed && (
        <Anchor
          href={`https://twitter.com/i/web/status/${id}`}
          id={`tweet-${id}`}
        >
          {t('common:view-post')}
        </Anchor>
      )}
    </div>
  )
}
