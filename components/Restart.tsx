import Router from 'next-translate/Router'
import useTranslation from 'next-translate/useTranslation'
import React, { useState } from 'react'
import { FiRepeat, FiThumbsUp } from 'react-icons/fi'
import Modal from '~/components/Modal'
import useRoom from '~/hooks/useRoom'
import Button from './Button'

export default function Restart() {
  const [showModal, setShowModal] = useState(false)
  const { room } = useRoom()
  const { t } = useTranslation()

  /* TODO: code smell here */
  if (!room) return null

  const replay = async () => {
    Router.pushI18n('/room/[roomId]/admin', `/room/${room.id}/admin`)
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center">
      <Button onClick={() => setShowModal(true)}>
        <FiRepeat />
        <span className="ml-4">{t('jugar:replay.reboot-game')}</span>
      </Button>
      <Modal
        contentLabel="Reiniciar sala"
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        className="modal"
        overlayClassName="overlay"
        title={t('jugar:replay.reboot-room')}
      >
        <p>{t('jugar:replay.description')}</p>
        <div className="mt-8 text-center">
          <Button onClick={replay} color="green">
            <FiThumbsUp />
            <span className="ml-4">{t('jugar:replay.confirm')}</span>
          </Button>
        </div>
      </Modal>
    </div>
  )
}
