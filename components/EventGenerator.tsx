import React, { Fragment, useState } from 'react'
import { FiCheck } from 'react-icons/fi'
import Button from '~/components/Button'
import useRandomTickets from '~/hooks/useRandomTickets'
import useToast from '~/hooks/useToast'
import { defaultRoomData } from '~/models/room'
import { createBatch, generateRoomCode, roomsRef, Timestamp } from '~/utils'
import Message from './Message'

export default function EventGenerator() {
  const { createToast, dismissToast, updateToast } = useToast()
  const [id, setId] = useState<string>()
  const randomTickets = useRandomTickets()

  const generateSpreadsheet = async () => {
    const toastId = createToast('Generando spreadsheet...', 'information')

    try {
      const batch = createBatch()

      /* Se crea la sala */
      const roomRef = roomsRef.doc()

      batch.set(roomRef, {
        ...defaultRoomData,
        activateAdminCode: true,
        bingoSpinner: false,
        code: generateRoomCode(),
        date: Timestamp.fromDate(new Date()),
        name: 'Evento de prueba',
        hideNumbersMeaning: true,
        readyToPlay: true,
      })

      /* Se crea el admin */
      const adminRef = roomRef.collection('players').doc()

      batch.set(adminRef, {
        date: Timestamp.fromDate(new Date()),
        name: 'Admin',
        selectedNumbers: [],
        tickets: randomTickets[0],
      })

      batch.update(roomRef, {
        adminId: adminRef.id,
      })

      /* Se generan los tickets aleatorios para la sala */
      for (let index = 1; index < 350; index++) {
        const ticketRef = roomRef.collection('tickets').doc()

        batch.set(ticketRef, {
          tickets: randomTickets[index],
        })
      }

      await batch.commit()

      setId(roomRef.id)

      updateToast('Operación exitosa', 'success', toastId)
    } catch (error) {
      console.error(error)

      updateToast('Ups! Hubo un error', 'error', toastId)
    } finally {
      setTimeout(() => {
        dismissToast(toastId)
      }, 2000)
    }
  }

  return (
    <Fragment>
      <div className="text-center">
        <Button
          aria-label="Generar planilla"
          id="generate-spreadsheet"
          onClick={generateSpreadsheet}
        >
          <FiCheck />
          <span className="ml-2">Crear evento</span>
        </Button>
      </div>
      {id && (
        <div className="mt-8">
          <Message type="success">El id de la sala que creaste es {id}</Message>
        </div>
      )}
    </Fragment>
  )
}
