import Router from 'next-translate/Router'
import React, { useState } from 'react'
import { FiRepeat, FiThumbsUp, FiX } from 'react-icons/fi'
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
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-medium text-lg md:text-xl">Reiniciar sala</h2>
            <Button color="gray" onClick={() => setShowModal(false)}>
              <FiX />
            </Button>
          </div>
          <p>
            Esta acción te permitirá volver a configurar la sala para que se
            adapte a un nuevo juego. Podrás editar la lista de personas que van
            a jugar, cambiar roles y redistribuir los cartones.
          </p>
          <div className="mt-8 text-center">
            <Button onClick={replay} color="green">
              <FiThumbsUp />
              <span className="ml-4">Confirmar</span>
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  )
}
