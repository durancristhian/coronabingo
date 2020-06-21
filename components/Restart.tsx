import Router from 'next-translate/Router'
import useTranslation from 'next-translate/useTranslation'
import React, { Fragment } from 'react'
import { FiThumbsUp } from 'react-icons/fi'
import Button from '~/components/Button'
import useRoomCode from '~/hooks/useRoomCode'
import { Room } from '~/interfaces'
import roomApi from '~/models/room'

interface Props {
  room: Room
}

export default function Restart({ room }: Props) {
  const { t } = useTranslation()
  const { login } = useRoomCode()

  const replay = async () => {
    await roomApi.updateRoom(room.ref, {
      readyToPlay: false,
      selectedNumbers: [],
      soundToPlay: '',
      confettiType: '',
      timesPlayed: room.timesPlayed + 1,
    })

    if (room.activateAdminCode) {
      login()
    }

    Router.pushI18n('/room/[roomId]/admin', `/room/${room.id}/admin`)
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
          iconLeft={<FiThumbsUp />}
        >
          {t('playerId:replay.confirm')}
        </Button>
      </div>
    </Fragment>
  )
}
