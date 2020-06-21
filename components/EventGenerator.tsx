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

const defaultEventData = {
  content: {
    html: '',
    text: '',
  },
  emailEndpoint: '',
  name: '',
  roomAdminName: '',
  roomName: '',
  videocall: '',
}

interface Props {
  user: firebase.User
}

export default function EventGenerator({ user }: Props) {
  const { createToast, dismissToast, updateToast } = useToast()
  const [id, setId] = useState<string>()
  const [inProgress, setInProgress] = useState(false)
  const [event, setEvent] = useState(defaultEventData)
  const randomTickets = useRandomTickets()

  const onCreateEventSubmit = async (e: FormEvent) => {
    e.preventDefault()

    /* TODO: validate */

    const toastId = createToast('Creando evento...', 'information')

    try {
      setInProgress(true)

      const batch = createBatch()

      const roomRef = roomsRef.doc()

      batch.set(roomRef, {
        ...defaultRoomData,
        activateAdminCode: true,
        bingoSpinner: false,
        code: generateRoomCode(),
        date: Timestamp.fromDate(new Date()),
        name: event.roomName,
        hideNumbersMeaning: true,
        readyToPlay: true,
      })

      const adminRef = roomRef.collection('players').doc()

      batch.set(adminRef, {
        date: Timestamp.fromDate(new Date()),
        name: event.roomAdminName,
        selectedNumbers: [],
        tickets: randomTickets[0],
      })

      batch.update(roomRef, {
        adminId: adminRef.id,
      })

      for (let index = 1; index < 350; index++) {
        const ticketRef = roomRef.collection('tickets').doc()

        batch.set(ticketRef, {
          tickets: randomTickets[index],
        })
      }

      const eventRef = eventsRef.doc()

      batch.set(eventRef, {
        content: event.content,
        date: Timestamp.fromDate(new Date()),
        emailEndpoint: event.emailEndpoint,
        eventName: event.name,
        roomId: roomRef.id,
        userId: user.uid,
        videocall: event.videocall,
      })

      await batch.commit()

      setId(eventRef.id)

      updateToast('Operación exitosa', 'success', toastId)
    } catch (error) {
      console.error(error)

      updateToast('Ups! Hubo un error', 'error', toastId)
    } finally {
      setEvent(defaultEventData)

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
            label="Nombre"
            value={event.name}
            onChange={name => {
              setEvent({ ...event, name })
            }}
          />
          <InputMarkdown
            content={event.content.text}
            label="Descripción"
            onChange={content => {
              setEvent({ ...event, content })
            }}
          />
          <InputText
            id="event-room-name"
            label="Nombre de la sala"
            value={event.roomName}
            onChange={roomName => {
              setEvent({ ...event, roomName })
            }}
          />
          <InputText
            id="event-admin-name"
            label="Nombre del admin de la sala"
            value={event.roomAdminName}
            onChange={roomAdminName => {
              setEvent({ ...event, roomAdminName })
            }}
          />
          <InputText
            id="videocall"
            label="Link a la videollamada"
            value={event.videocall}
            onChange={videocall => {
              setEvent({ ...event, videocall })
            }}
          />
          <InputText
            id="email-endpoint"
            label="Endpoint de palabra.io para mandar los mails"
            value={event.emailEndpoint}
            onChange={emailEndpoint => {
              setEvent({ ...event, emailEndpoint })
            }}
          />
          <div className="mt-8 text-center">
            <Button
              aria-label="Generar planilla"
              id="generate-spreadsheet"
              color="green"
              type="submit"
              iconLeft={<FiCheck />}
            >
              Crear evento
            </Button>
          </div>
        </fieldset>
      </form>
      {id && (
        <div className="mt-8">
          <Message type="success">El id del evento que creaste es {id}</Message>
        </div>
      )}
    </Fragment>
  )
}
