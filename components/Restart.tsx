import Router from 'next-translate/Router'
import useTranslation from 'next-translate/useTranslation'
import React, { Fragment, useState } from 'react'
import { FiRepeat, FiThumbsUp, FiX } from 'react-icons/fi'
import Modal from 'react-modal'
import useRoom from '~/hooks/useRoom'
import Box from './Box'
import Button from './Button'

Modal.setAppElement('#__next')

export default function Restart() {
  const [showModal, setShowModal] = useState(false)
  const [room] = useRoom()
  const { t } = useTranslation()

  const replay = async () => {
    Router.pushI18n('/room/[roomId]/admin', `/room/${room.id}/admin`)
  }

  return (
    <Fragment>
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
      >
        <Box>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-medium text-lg md:text-xl">
              {t('jugar:replay.reboot-room')}
            </h2>
            <Button color="gray" onClick={() => setShowModal(false)}>
              <FiX />
            </Button>
          </div>
          <p>{t('jugar:replay.description')}</p>
          <div className="mt-8 text-center">
            <Button onClick={replay} color="green">
              <FiThumbsUp />
              <span className="ml-4">{t('jugar:replay.confirm')}</span>
            </Button>
          </div>
        </Box>
      </Modal>
    </Fragment>
  )
}
