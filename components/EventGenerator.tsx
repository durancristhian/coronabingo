import React from 'react'
import { FiCheck } from 'react-icons/fi'
import Button from '~/components/Button'
import useRandomTickets from '~/hooks/useRandomTickets'
import useToast from '~/hooks/useToast'
import { defaultRoomData } from '~/models/room'
import { createBatch, generateRoomCode, roomsRef, Timestamp } from '~/utils'

export default function EventGenerator() {
  const { createToast, dismissToast, updateToast } = useToast()
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
        name: 'C3 - Jueves 11/06/2020',
        hideNumbersMeaning: true,
        readyToPlay: true,
      })

      /* Se crea el admin */
      const adminRef = roomRef.collection('players').doc()

      batch.set(adminRef, {
        date: Timestamp.fromDate(new Date()),
        name: 'Cristhian',
        selectedNumbers: [],
        tickets: randomTickets[0],
      })

      /* Se actualiza la sala con el admin id */
      batch.update(roomRef, {
        adminId: adminRef.id,
      })

      /* Se agrega el resto de personas */
      for (let index = 1; index < 350; index++) {
        const playerRef = roomRef.collection('players').doc()

        batch.set(playerRef, {
          date: Timestamp.fromDate(new Date()),
          name: `Jugador #${index + 1}`,
          selectedNumbers: [],
          tickets: randomTickets[index],
        })
      }

      await batch.commit()

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
    <div className="mt-8">
      <Button
        aria-label="Generar planilla"
        id="generate-spreadsheet"
        onClick={generateSpreadsheet}
      >
        <FiCheck />
        <span className="ml-2">Generar planilla</span>
      </Button>
    </div>
  )
}
