import classnames from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import React, { ReactNode } from 'react'
import { FiPlayCircle } from 'react-icons/fi'
import Button from '~/components/Button'
import Emoji from '~/components/Emoji'
import usePendingOperation from '~/hooks/usePendingOperation'
import { Room } from '~/interfaces/models/Room'
import {
  getSoundUsedEventParams,
  markFirstAnalyticsUseInPlay,
} from '~/utils/analyticsEvents'
import { Sound, SOUNDS, SOUNDS_EXTRAS } from '~/utils/soundCatalog'
import { logEvent as log } from '~/utils/gtag'

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
  const { pending, run } = usePendingOperation()

  const sounds = extraSounds ? SOUNDS_EXTRAS : SOUNDS

  const playSound = async ({
    analyticsCatalog,
    analyticsKey,
    url,
  }: Pick<Sound, 'analyticsCatalog' | 'analyticsKey' | 'url'>) => {
    return run(async () => {
      await room.ref.update({
        soundToPlay: url,
        soundCommandId: crypto.randomUUID(),
      })

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
    })
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
                  disabled={!!room.soundToPlay || pending}
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
