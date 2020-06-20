import React, { Fragment } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import {
  FiCheck,
  FiClock,
  FiLink,
  FiMail,
  FiMessageSquare,
} from 'react-icons/fi'
import Anchor from '~/components/Anchor'
import Box from '~/components/Box'
import Button from '~/components/Button'
import Heading from '~/components/Heading'
import useToast from '~/hooks/useToast'
import { Event, Player, Registration, RoomTicket } from '~/interfaces'
import { createBatch, roomsRef, Timestamp } from '~/utils'

interface EventRegistration extends Registration {
  player: Player | undefined
}

interface Props {
  event: Event
  players: Player[]
  registrations: Registration[]
  tickets: RoomTicket[]
}

export default function Registrations({
  event,
  players,
  registrations,
  tickets,
}: Props) {
  const { createToast, dismissToast, updateToast } = useToast()

  const registrationList: EventRegistration[] = registrations.map(
    registration => ({
      ...registration,
      player: players.find(p => p.name === registration.name),
    }),
  )

  const onProvideAccessClick = async (registration: EventRegistration) => {
    const toastId = createToast('Otorgando acceso...', 'information')

    try {
      const batch = createBatch()
      const room = roomsRef.doc(event.roomId)
      const playerRef = room.collection('players').doc()
      const ticket = tickets[0]
      const ticketsRef = room.collection('tickets').doc(ticket.id)

      batch.set(playerRef, {
        date: Timestamp.fromDate(new Date()),
        name: registration.name,
        selectedNumbers: [],
        tickets: ticket.tickets,
      })

      batch.delete(ticketsRef)

      await batch.commit()

      updateToast('Operación exitosa', 'success', toastId)
    } catch (error) {
      console.error(error)

      updateToast('Ups! Hubo un error.', 'error', toastId)
    } finally {
      setTimeout(() => {
        dismissToast(toastId)
      }, 2000)
    }
  }

  const getRoomPlayerLink = (rid: string, pid: string) =>
    `https://coronabingo.now.sh/room/${rid}/${pid}`

  const getEventDate = (registration: EventRegistration) => {
    const day = registration.date?.toDate().toLocaleDateString('es-ar')
    const hour = registration.date?.toDate().toLocaleTimeString('es-ar')

    return `${day}, ${hour}`
  }

  const sendEmail = async (registration: EventRegistration) => {
    if (!registration.player) return

    const toastId = createToast('Enviando mail...', 'information')

    const date = getEventDate(registration)
    const link = getRoomPlayerLink(event.roomId, registration.player.id)
    const videocall = '-- PONER LINK A LA VIDEOLLAMADA --'
    const body = `email=${registration.email}&date=${date}&tickets=${link}&videocall=${videocall}`

    try {
      await fetch(event.emailEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      })

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

  const getMessage = (registration: EventRegistration) => {
    if (!registration.player) return

    const date = getEventDate(registration)
    const tickets = getRoomPlayerLink(event.roomId, registration.player.id)
    const videocall = '-- PONER LINK A LA VIDEOLLAMADA --'

    return `Hola ${registration.player.name},

Gracias por haberte sumado a jugar este Coronabingo solidario. 

Te recordamos que vamos a jugar el día ${date}. Ese día vamos a hacer una videollamada por la aplicación Zoom.

Tu link a los cartones para jugar es ${tickets}

El link a la videollamada de Zoom es ${videocall}

Saludos, Cris.`
  }

  const sendWhatsApp = (registration: EventRegistration) => {
    window.open(
      `https://api.whatsapp.com/send?phone=+549${
        registration.tel
      }&text=${getMessage(registration)}`,
    )
  }

  return (
    <Fragment>
      {registrationList.map((registration, i) => (
        <div key={i} className="mt-4">
          <Box>
            <div className="flex">
              <div className="w-1/5">
                <img
                  src={registration.attachment}
                  alt={`Comprobante de pago de ${registration.name}`}
                  className="block rounded w-full"
                />
              </div>
              <div className="w-3/5">
                <div className="mx-4">
                  <Heading type="h4">{registration.name}</Heading>
                  <div className="break-all mt-4 text-gray-700 whitespace-pre-wrap">
                    <div className="flex">
                      <div className="mt-1">
                        <FiClock />
                      </div>
                      <span className="ml-2">
                        {registration.date && getEventDate(registration)}
                      </span>
                    </div>
                    <div className="flex">
                      <div className="mt-1">
                        <FaWhatsapp />
                      </div>
                      <span className="ml-2">
                        <Anchor
                          href={`https://api.whatsapp.com/send?phone=+549${registration.tel}&text=Hola ${registration.name}, `}
                          id="whatsapp"
                        >
                          {registration.tel}
                        </Anchor>
                      </span>
                    </div>
                    <div className="flex">
                      <div className="mt-1">
                        <FiMail />
                      </div>
                      <span className="ml-2">{registration.email}</span>
                    </div>
                    {registration.comment && (
                      <div className="flex">
                        <div className="mt-1">
                          <FiMessageSquare />
                        </div>
                        <span className="ml-2">{registration.comment}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right w-1/5">
                {!registration.player && (
                  <Button
                    aria-label="Aprobar"
                    id="provide-access"
                    onClick={() => onProvideAccessClick(registration)}
                  >
                    <FiCheck />
                    <span className="ml-2">Aprobar</span>
                  </Button>
                )}
                {registration.player && (
                  <div>
                    <Anchor
                      href={getRoomPlayerLink(
                        event.roomId,
                        registration.player.id,
                      )}
                      id="player-link"
                    >
                      <span className="flex items-center">
                        <FiLink />
                        <span className="ml-2">
                          Cartones ({registration.player.tickets})
                        </span>
                      </span>
                    </Anchor>
                    <div className="mt-4">
                      <Button
                        aria-label="Mandar mail"
                        id="send-email"
                        onClick={() => sendEmail(registration)}
                      >
                        <FiMail />
                        <span className="ml-2">Email</span>
                      </Button>
                    </div>
                    <div className="mt-4">
                      <Button
                        aria-label="Mandar WhatsApp"
                        id="send-whatsapp"
                        color="green"
                        onClick={() => sendWhatsApp(registration)}
                      >
                        <FaWhatsapp />
                        <span className="ml-2">WhatsApp</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Box>
        </div>
      ))}
    </Fragment>
  )
}
