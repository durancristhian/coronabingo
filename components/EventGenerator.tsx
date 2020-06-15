import React, { Fragment, useState } from 'react'
import { FiCheck } from 'react-icons/fi'
import Button from '~/components/Button'
import useRandomTickets from '~/hooks/useRandomTickets'
import useToast from '~/hooks/useToast'
import { defaultRoomData } from '~/models/room'
import { createBatch, generateRoomCode, roomsRef, Timestamp } from '~/utils'
import InputText from './InputText'
import Message from './Message'

export default function EventGenerator() {
  const { createToast, dismissToast, updateToast } = useToast()
  const [id, setId] = useState<string>()
  const [inProgress, setInProgress] = useState(false)
  const [formData, setFormData] = useState({
    emailEndpoint: '',
    eventRoomAdminName: '',
    eventRoomName: '',
    formURL: '',
    spreadsheetId: '',
    worksheetTitle: '',
  })
  const randomTickets = useRandomTickets()

  const onCreateEventSubmit = async () => {
    const toastId = createToast('Creando evento...', 'information')

    try {
      setInProgress(true)

      const batch = createBatch()

      /* Se crea la sala */
      const roomRef = roomsRef.doc()

      batch.set(roomRef, {
        ...defaultRoomData,
        activateAdminCode: true,
        bingoSpinner: false,
        code: generateRoomCode(),
        date: Timestamp.fromDate(new Date()),
        name: formData.eventRoomName,
        hideNumbersMeaning: true,
        readyToPlay: true,
      })

      /* Se crea el admin */
      const adminRef = roomRef.collection('players').doc()

      batch.set(adminRef, {
        date: Timestamp.fromDate(new Date()),
        name: formData.eventRoomAdminName,
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
      setInProgress(false)

      setTimeout(() => {
        dismissToast(toastId)
      }, 2000)
    }
  }

  return (
    <Fragment>
      <form onSubmit={onCreateEventSubmit}>
        <fieldset disabled={inProgress}>
          <InputText
            id="event-name"
            label="Nombre de la sala del evento"
            value={formData.eventRoomName}
            onChange={eventRoomName => {
              setFormData({ ...formData, eventRoomName })
            }}
          />
          <InputText
            id="event-admin-name"
            label="Nombre del admin de la sala del evento"
            value={formData.eventRoomAdminName}
            onChange={eventRoomAdminName => {
              setFormData({ ...formData, eventRoomAdminName })
            }}
          />
          <InputText
            id="form-url"
            label="Link al formulario de inscripciones"
            value={formData.formURL}
            onChange={formURL => {
              setFormData({ ...formData, formURL })
            }}
          />
          <InputText
            id="spreadsheet-id"
            label="Id de la planilla donde el formulario guarda de inscripciones"
            value={formData.spreadsheetId}
            onChange={spreadsheetId => {
              setFormData({ ...formData, spreadsheetId })
            }}
          />
          <InputText
            id="spreadsheet-url"
            label="Título de la hoja de la planilla donde el formulario guarda de inscripciones"
            value={formData.worksheetTitle}
            onChange={worksheetTitle => {
              setFormData({ ...formData, worksheetTitle })
            }}
          />
          <InputText
            id="email-endpoint"
            label="Endpoint de palabra.io para mandar mails"
            value={formData.emailEndpoint}
            onChange={emailEndpoint => {
              setFormData({ ...formData, emailEndpoint })
            }}
          />
          <div className="mt-8 text-center">
            <Button
              aria-label="Generar planilla"
              id="generate-spreadsheet"
              color="green"
            >
              <FiCheck />
              <span className="ml-4">Crear evento</span>
            </Button>
          </div>
        </fieldset>
      </form>
      {id && (
        <div className="mt-8">
          <Message type="success">El id de la sala que creaste es {id}</Message>
        </div>
      )}
    </Fragment>
  )
}
