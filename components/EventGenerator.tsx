import React, { FormEvent, Fragment, useState } from 'react'
import { FiCheck } from 'react-icons/fi'
import Button from '~/components/Button'
import useRandomTickets from '~/hooks/useRandomTickets'
import useToast from '~/hooks/useToast'
import { defaultRoomData } from '~/models/room'
import {
  createBatch,
  eventsRef,
  generateRoomCode,
  roomsRef,
  Timestamp,
} from '~/utils'
import InputMarkdown from './InputMarkdown'
import InputText from './InputText'
import Message from './Message'

interface Props {
  user: firebase.User
}

export default function EventGenerator({ user }: Props) {
  const { createToast, dismissToast, updateToast } = useToast()
  const [id, setId] = useState<string>()
  const [inProgress, setInProgress] = useState(false)
  const [formData, setFormData] = useState({
    content: {
      html: '<p>Hola!</p>',
      text: 'Hola!',
    },
    emailEndpoint: 'https://hooks.palabra.io/js?id=96',
    eventName: 'Coronabingo Solidario - Junio 2020',
    eventRoomAdminName: 'Cristhian',
    eventRoomName: 'Evento de prueba',
    formURL: 'https://forms.gle/FMxzniFaYw6jWLsW8',
    spreadsheetId: '1gwJIIPX2gs696_fq3HQQntXhg-mFwREVVyd831GWF8c',
    worksheetTitle: 'Respuestas de formulario 1',
  })
  const randomTickets = useRandomTickets()

  const onCreateEventSubmit = async (event: FormEvent) => {
    event.preventDefault()

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

      /* Se crea el evento */
      const eventRef = eventsRef.doc()

      batch.set(eventRef, {
        date: Timestamp.fromDate(new Date()),
        roomId: roomRef.id,
        eventName: formData.eventName,
        content: formData.content,
        emailEndpoint: formData.emailEndpoint,
        formURL: formData.formURL,
        spreadsheetId: formData.spreadsheetId,
        worksheetTitle: formData.worksheetTitle,
        userId: user.uid,
      })

      await batch.commit()

      setId(eventRef.id)

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
            label="Nombre del evento"
            value={formData.eventName}
            onChange={eventName => {
              setFormData({ ...formData, eventName })
            }}
          />
          <InputText
            id="event-room-name"
            label="Nombre de la sala"
            value={formData.eventRoomName}
            onChange={eventRoomName => {
              setFormData({ ...formData, eventRoomName })
            }}
          />
          <InputText
            id="event-admin-name"
            label="Nombre del admin de la sala"
            value={formData.eventRoomAdminName}
            onChange={eventRoomAdminName => {
              setFormData({ ...formData, eventRoomAdminName })
            }}
          />
          <InputMarkdown
            content={formData.content.text}
            label="Contenido de la página de inscripción"
            onChange={content => {
              setFormData({ ...formData, content })
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
            label="Endpoint de palabra.io para mandar los mails"
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
              type="submit"
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
