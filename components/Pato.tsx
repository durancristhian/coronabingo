import classnames from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import React, { ReactNode, useRef, useState } from 'react'
import { FiPlayCircle } from 'react-icons/fi'
import Button from '~/components/Button'
import Emoji from '~/components/Emoji'
import { useAnalytics } from '~/hooks/useAnalytics'
import {
  AnalyticsSoundCatalog,
  AnalyticsSoundKey,
} from '~/interfaces/analytics/Events'
import { Room } from '~/interfaces/models/Room'
import roomApi from '~/models/room'
import {
  getSoundUsedEventParams,
  markFirstAnalyticsUseInPlay,
} from '~/utils/analyticsEvents'
import { SOUNDS, SOUNDS_EXTRAS } from '~/utils/constants'

const emojis: { [key: string]: ReactNode } = {
  ar: <Emoji name="flag-ar" />,
  en: <Emoji name="us" />,
  world: <Emoji name="earth_americas" />,
}

interface Props {
  extraSounds: boolean
  room: Room
}

export default function Pato({ extraSounds, room }: Props) {
  const { lang, t } = useTranslation()
  const log = useAnalytics()
  const updateInProgress = useRef(false)
  const [inProgress, setInProgress] = useState(false)

  const sounds = extraSounds ? SOUNDS_EXTRAS : SOUNDS

  const playSound = async ({
    analyticsCatalog,
    analyticsKey,
    url,
  }: {
    analyticsCatalog: AnalyticsSoundCatalog
    analyticsKey: AnalyticsSoundKey
    url: string
  }) => {
    if (updateInProgress.current) return

    updateInProgress.current = true
    setInProgress(true)

    try {
      await roomApi.updateRoom(room.ref, { soundToPlay: url })
    } catch (error) {
      updateInProgress.current = false
      setInProgress(false)
      throw error
    }

    log(
      'sound_used',
      getSoundUsedEventParams({
        firstUseInPlay: markFirstAnalyticsUseInPlay(
          'sound_used',
          room.id,
          room.timesPlayed,
        ),
        language: lang,
        playNumber: room.timesPlayed,
        soundCatalog: analyticsCatalog,
        soundKey: analyticsKey,
      }),
    )

    updateInProgress.current = false
    setInProgress(false)
  }

  return (
    <div className="cb-list border-gray-300 border-t-2 -mx-4">
      {sounds.map(
        ({ analyticsCatalog, analyticsKey, language, name, url }, index) => {
          return (
            <div
              key={analyticsKey}
              className={classnames([
                'cb-list-row',
                'border-b-2 border-gray-300 flex items-center justify-between px-4 py-2',
                index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200',
                room.soundToPlay === url && 'cb-list-row--active bg-yellow-200',
              ])}
            >
              <div className="mr-4">
                <Button
                  id="play-sound"
                  aria-label={t('playerId:play-sound', { name })}
                  disabled={!!room.soundToPlay || inProgress}
                  onClick={() =>
                    playSound({ analyticsCatalog, analyticsKey, url })
                  }
                  iconLeft={<FiPlayCircle />}
                />
              </div>
              <div className="flex flex-auto items-center">
                <p className="flex items-center">
                  <span>{emojis[language]}</span>
                  <span className="ml-4">{name}</span>
                </p>
              </div>
            </div>
          )
        },
      )}
    </div>
  )
}
