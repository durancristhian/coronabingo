import classnames from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import React, { Fragment } from 'react'
import { FiFrown, FiSmile } from 'react-icons/fi'
import Button from '~/components/Button'
import { confettiTypes } from '~/components/Confetti'
import usePendingOperation from '~/hooks/usePendingOperation'
import { Room } from '~/interfaces/models/Room'
import roomApi from '~/models/room'
import {
  getCelebrationUsedEventParams,
  markFirstAnalyticsUseInPlay,
} from '~/utils/analyticsEvents'
import { logEvent as log } from '~/utils/gtag'

interface Props {
  room: Room
}

export default function Celebrations({ room }: Props) {
  const { lang, t } = useTranslation()
  const { pending, run } = usePendingOperation()

  const updateCelebration = async (
    celebrationType: Exclude<Room['confettiType'], ''>,
  ) => {
    const isHiding = celebrationType === room.confettiType

    return run(async () => {
      await roomApi.updateRoom(room.ref, {
        confettiType: isHiding ? '' : celebrationType,
      })

      if (!isHiding) {
        log(
          'celebration_used',
          getCelebrationUsedEventParams({
            celebrationType,
            firstUseInPlay: markFirstAnalyticsUseInPlay(
              'celebration_used',
              room.id,
              room.timesPlayed,
            ),
            language: lang,
            playNumber: room.timesPlayed,
          }),
        )
      }
    })
  }

  return (
    <Fragment>
      {confettiTypes.map((ct, i) => (
        <div key={ct} className={classnames([i !== 0 && 'mt-4'])}>
          <Button
            aria-label={
              ct === room.confettiType
                ? t(`playerId:hide-${ct}`)
                : t(`playerId:show-${ct}`)
            }
            id={`click-${ct}`}
            color={ct === room.confettiType ? 'red' : 'green'}
            disabled={pending}
            onClick={() => updateCelebration(ct)}
            className="w-full"
            iconLeft={ct === room.confettiType ? <FiFrown /> : <FiSmile />}
          >
            {ct === room.confettiType ? (
              <span className="truncate">{t(`playerId:hide-${ct}`)}</span>
            ) : (
              <span className="truncate">{t(`playerId:show-${ct}`)}</span>
            )}
          </Button>
        </div>
      ))}
    </Fragment>
  )
}
