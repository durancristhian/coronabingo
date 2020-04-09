import Router from 'next-translate/Router'
import React, { useState } from 'react'
import { FiRepeat, FiX } from 'react-icons/fi'
import Modal from 'react-modal'
import useRoom from '~/hooks/useRoom'
import Box from './Box'
import Button from './Button'

export default function Restart() {
  const [showModal, setShowModal] = useState(false)
  const [room] = useRoom()

  const replay = async () => {
    await room.ref.update({
      readyToPlay: false,
    })

    Router.pushI18n('/room/[roomId]/admin', `/room/${room.id}/admin`)
  }

  return (
    <div className="text-center mt-8">
      <Button onClick={() => setShowModal(true)}>
        <FiRepeat />
        <span className="ml-4">Reiniciar sala</span>
      </Button>
      <Modal
        contentLabel="Reiniciar sala"
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        className="modal"
        overlayClassName="overlay"
      >
        <Box>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-lg md:text-xl">Reiniciar sala</h2>
            <Button color="gray" onClick={() => setShowModal(false)}>
              <FiX />
            </Button>
          </div>
          <p>
            Esta acción va a reiniciar los valores de la sala para comenzar de
            nuevo el juego. Estas segurx ?
          </p>
          <Button className="mt-8" onClick={replay}>
            Confirmar
          </Button>
        </Box>
      </Modal>
    </div>
  )
}
