import useTranslation from 'next-translate/useTranslation'
import React, { useRef, useState } from 'react'
import Anchor from '~/components/Anchor'
import { getTutorialEventParams } from '~/utils/analyticsEvents'
import { tutorials } from '~/utils/tutorials'
import { getWatchedFraction } from '~/utils/videoProgress'
import { logEvent as log } from '~/utils/gtag'

export default function TutorialVideo() {
  const { t, lang } = useTranslation()
  const language = lang === 'en' ? 'en' : 'es'
  const tutorial = tutorials[language]
  const progress = useRef({ began: false, engaged: false, completed: false })
  const [failed, setFailed] = useState(false)
  const params = getTutorialEventParams(language)

  const recordProgress = (video: HTMLVideoElement) => {
    if (!progress.current.began) return
    const fraction = getWatchedFraction(video.played, video.duration)
    if (fraction >= 0.8 && !progress.current.engaged) {
      progress.current.engaged = true
      log('tutorial_engaged', { ...params, watched_percent: 80 })
    }
    if (video.ended && fraction >= 0.99 && !progress.current.completed) {
      progress.current.completed = true
      log('tutorial_complete', params)
    }
  }

  return (
    <div>
      {failed ? (
        <div role="alert" className="text-center">
          <p>{t('index:tutorial-load-error')}</p>
          <button
            type="button"
            className="mt-4 mr-4 font-medium text-blue-800 underline"
            onClick={() => setFailed(false)}
          >
            {t('index:tutorial-retry')}
          </button>
          <Anchor href={tutorial.src} id="tutorial-video-fallback">
            {t('index:tutorial-open-video')}
          </Anchor>
        </div>
      ) : (
        <video
          className="cb-tutorial-video"
          aria-label={t('index:how-to-play-modal-title')}
          controls
          playsInline
          preload="metadata"
          poster={tutorial.poster}
          src={tutorial.src}
          onPlaying={() => {
            if (progress.current.began) return
            progress.current.began = true
            log('tutorial_begin', params)
          }}
          onTimeUpdate={event => recordProgress(event.currentTarget)}
          onPause={event => recordProgress(event.currentTarget)}
          onEnded={event => recordProgress(event.currentTarget)}
          onError={() => {
            log('tutorial_error', params)
            setFailed(true)
          }}
        >
          <track
            kind="captions"
            src={tutorial.captions}
            srcLang={language}
            label={language === 'en' ? 'English' : 'Español'}
          />
          <a href={tutorial.src}>{t('index:tutorial-open-video')}</a>
        </video>
      )}
    </div>
  )
}
