import classnames from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import React, { Fragment, useRef, useState } from 'react'
import { FiFrown, FiSmile } from 'react-icons/fi'
import Button from '~/components/Button'
import { confettiTypes } from '~/components/Confetti'
import { useAnalytics } from '~/hooks/useAnalytics'
import { Room } from '~/interfaces/models/Room'
import roomApi from '~/models/room'
import {
  getCelebrationUsedEventParams,
  markFirstAnalyticsUseInPlay,
} from '~/utils/analyticsEvents'

interface Props {
  room: Room
}

export default function Celebrations({ room }: Props) {
  const { lang, t } = useTranslation()
  const log = useAnalytics()
  const updateInProgress = useRef(false)
  const [inProgress, setInProgress] = useState(false)

  const updateCelebration = async (
    celebrationType: Exclude<Room['confettiType'], ''>,
  ) => {
    if (updateInProgress.current) return

    updateInProgress.current = true
    setInProgress(true)
    const isHiding = celebrationType === room.confettiType

    try {
      await roomApi.updateRoom(room.ref, {
        confettiType: isHiding ? '' : celebrationType,
      })
    } catch (error) {
      updateInProgress.current = false
      setInProgress(false)
      throw error
    }

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

    updateInProgress.current = false
    setInProgress(false)
  }

  return (
    <Fragment>
      {confettiTypes.map((ct, i) => (
        <div key={ct} className={classnames([i !== 0 && 'mt-4'])}>
          <Button
            aria-label={
              room.confettiType
                ? t(`playerId:hide-${ct}`)
                : t(`playerId:show-${ct}`)
            }
            id={`click-${ct}`}
            color={ct === room.confettiType ? 'red' : 'green'}
            disabled={inProgress}
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
