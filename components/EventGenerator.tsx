import React, { FormEvent, Fragment, useState } from 'react'
import { FiCheck } from 'react-icons/fi'
import slugify from 'slugify'
import zipcelx from 'zipcelx'
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
  id: '',
  name: '',
  roomAdminName: '',
  roomName: '',
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

  const generateSpreadsheet = (filename: string, data: unknown) => {
    const config = {
      filename: filename,
      sheet: {
        data,
      },
    }

    /* Types are wrong */
    // @ts-ignore
    zipcelx(config)
  }

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
        hideNumbersMeaning: false,
        readyToPlay: true,
        locked: true,
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

      const limit = 450

      for (let index = 1; index < limit; index++) {
        const ticketRef = roomRef.collection('tickets').doc()

        batch.set(ticketRef, {
          tickets: randomTickets[index],
        })
      }

      const parsedEventName = slugify(event.id, {
        lower: true,
      })
      const eventUrl = `${window.location.host}/eventos/${parsedEventName}`
      const eventRef = eventsRef.doc(parsedEventName)

      batch.set(eventRef, {
        content: event.content,
        date: Timestamp.fromDate(new Date()),
        name: event.name,
        roomId: roomRef.id,
        userId: user.uid,
      })

      const roomUrl = `${window.location.host}/room/${roomRef.id}`

      await batch.commit()

      setId(eventUrl)

      generateSpreadsheet(event.name, [
        [
          { value: 'URL del evento', type: 'string' },
          { value: eventUrl, type: 'string' },
        ],
        [
          { value: 'URL de la sala', type: 'string' },
          { value: roomUrl, type: 'string' },
        ],
        [
          { value: 'Link admin', type: 'string' },
          { value: randomTickets[0], type: 'string' },
        ],
        ...randomTickets.slice(1, limit).map((t, i) => [
          { value: `Link Jugador #${i + 1}`, type: 'string' },
          { value: t, type: 'string' },
        ]),
        ...randomTickets.slice(limit).map((t, i) => [
          { value: `Extra Link Jugador #${i + 1}`, type: 'string' },
          { value: t, type: 'string' },
        ]),
      ])

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
          <InputText
            id="event-id"
            label="URL"
            value={event.id}
            hint={
              event.id && (
                <span className="block break-all">
                  coronabingo.com.ar/eventos/
                  {slugify(event.id, {
                    lower: true,
                  })}
                </span>
              )
            }
            onChange={id => {
              setEvent({ ...event, id })
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
          <Message type="success">
            El link del evento que creaste es {id}
          </Message>
        </div>
      )}
    </Fragment>
  )
}
