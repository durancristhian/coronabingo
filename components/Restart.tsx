import Router from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import React, { Fragment, useRef, useState } from 'react'
import { FiThumbsUp } from 'react-icons/fi'
import Button from '~/components/Button'
import { useAnalytics } from '~/hooks/useAnalytics'
import useRoomCode from '~/hooks/useRoomCode'
import { Room } from '~/interfaces/models/Room'
import roomApi from '~/models/room'
import { getRoomRestartedEventParams } from '~/utils/analyticsEvents'

interface Props {
  room: Room
}

export default function Restart({ room }: Props) {
  const { lang, t } = useTranslation()
  const log = useAnalytics()
  const { login } = useRoomCode()
  const replayInProgress = useRef(false)
  const [inProgress, setInProgress] = useState(false)

  const replay = async () => {
    if (replayInProgress.current) return

    replayInProgress.current = true
    setInProgress(true)

    try {
      await roomApi.updateRoom(room.ref, {
        readyToPlay: false,
        selectedNumbers: [],
        soundToPlay: '',
        confettiType: '',
        timesPlayed: room.timesPlayed + 1,
      })
    } catch (error) {
      replayInProgress.current = false
      setInProgress(false)
      throw error
    }

    log(
      'room_restarted',
      getRoomRestartedEventParams({
        createdAt: room.date.toDate(),
        language: lang,
        playNumber: room.timesPlayed,
      }),
    )

    if (room.activateAdminCode) {
      login()
    }

    Router.push('/room/[roomId]/admin', `/room/${room.id}/admin`)
  }

  return (
    <Fragment>
      <p>{t('playerId:replay.description')}</p>
      <div className="mt-8 text-center">
        <Button
          aria-label={t('playerId:replay.confirm')}
          id="confirm"
          onClick={replay}
          color="green"
          disabled={inProgress}
          iconLeft={<FiThumbsUp />}
        >
          {t('playerId:replay.confirm')}
        </Button>
      </div>
    </Fragment>
  )
}
