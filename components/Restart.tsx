import Router from 'next-translate/Router'
import useTranslation from 'next-translate/useTranslation'
import React, { Fragment } from 'react'
import { FiThumbsUp } from 'react-icons/fi'
import Button from '~/components/Button'
import { Room } from '~/interfaces'
import roomApi from '~/models/room'

interface Props {
  room: Room
}

export default function Restart({ room }: Props) {
  const { t } = useTranslation()

  const replay = async () => {
    await roomApi.updateRoom(room.ref, { readyToPlay: false })

    Router.pushI18n('/room/[roomId]/admin', `/room/${room.id}/admin`)
  }

  return (
    <Fragment>
      <p>{t('playerId:replay.description')}</p>
      <div className="mt-8 text-center">
        <Button id="confirm" onClick={replay} color="green">
          <FiThumbsUp />
          <span className="ml-4">{t('playerId:replay.confirm')}</span>
        </Button>
      </div>
    </Fragment>
  )
}
