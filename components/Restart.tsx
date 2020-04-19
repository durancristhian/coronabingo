import Router from 'next-translate/Router'
import useTranslation from 'next-translate/useTranslation'
import React, { useState } from 'react'
import { FiRepeat, FiThumbsUp } from 'react-icons/fi'
import Modal from '~/components/Modal'
import { Room } from '~/interfaces'
import roomApi from '~/models/room'
import Button from './Button'

interface Props {
  room: Room
}

export default function Restart({ room }: Props) {
  const [showModal, setShowModal] = useState(false)
  const { t } = useTranslation()

  const replay = async () => {
    await roomApi.updateRoom(room.ref, { readyToPlay: false })

    Router.pushI18n('/room/[roomId]/admin', `/room/${room.id}/admin`)
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center">
      <Button id="reboot-game" onClick={() => setShowModal(true)}>
        <FiRepeat />
        <span className="ml-4">{t('jugar:replay.reboot-game')}</span>
      </Button>
      <Modal
        id="modal-restart"
        contentLabel="Reiniciar sala"
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        className="modal"
        overlayClassName="overlay"
        title={t('jugar:replay.reboot-room')}
      >
        <p>{t('jugar:replay.description')}</p>
        <div className="mt-8 text-center">
          <Button id="confirm" onClick={replay} color="green">
            <FiThumbsUp />
            <span className="ml-4">{t('jugar:replay.confirm')}</span>
          </Button>
        </div>
      </Modal>
    </div>
  )
}
