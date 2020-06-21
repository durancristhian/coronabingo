import classnames from 'classnames'
import React, { Fragment } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import {
  FiCalendar,
  FiCheck,
  FiChevronDown,
  FiLink,
  FiMail,
  FiMessageSquare,
} from 'react-icons/fi'
import Anchor from '~/components/Anchor'
import Button from '~/components/Button'
import Heading from '~/components/Heading'
import useToast from '~/hooks/useToast'
import { Event, Player, Registration, RoomTicket } from '~/interfaces'
import {
  createBatch,
  getBaseUrl,
  roomsRef,
  sendWhatsApp,
  Timestamp,
} from '~/utils'
import Accordion from './Accordion'
import Tag from './Tag'

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

  const getRoomPlayerLink = (roomId: string, playerId: string) =>
    `${getBaseUrl()}/room/${roomId}/${playerId}`

  const getEventDate = (registration: EventRegistration) => {
    const registrationDate = registration.date.toDate()

    const day = registrationDate.toLocaleDateString('es-ar')
    const hour = registrationDate.toLocaleTimeString('es-ar')

    return `${day}, ${hour}`
  }

  const getMessageData = (registration: EventRegistration) => {
    return {
      name: registration.name,
      date: getEventDate(registration),
      tickets: getRoomPlayerLink(
        event.roomId,
        registration.player?.id || 'THIS SHOULD NOT HAPPEN',
      ),
      videocall: '-- PONER LINK A LA VIDEOLLAMADA --',
    }
  }

  const sendEmail = async (registration: EventRegistration) => {
    /* This shouldn't happen */
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
    /* This shouldn't happen */
    if (!registration.player) return ''

    const { name, date, tickets, videocall } = getMessageData(registration)

    return `Hola ${name},

Gracias por haberte sumado a jugar este Coronabingo solidario. 

Te recordamos que vamos a jugar el día ${date}. Ese día vamos a hacer una videollamada por la aplicación Zoom.

Tu link a los cartones para jugar es ${tickets}

El link a la videollamada de Zoom es ${videocall}

Saludos, Cris.`
  }

  const renderRow = (registration: EventRegistration) => {
    const ticketsUrl = getRoomPlayerLink(
      // eslint-disable-next-line react/prop-types
      event.roomId,
      registration.player?.id || 'THIS SHOULD NOT HAPPEN',
    )

    return (
      <div className="mb-2">
        <Accordion
          id={registration.id}
          label={
            <div
              className={classnames([
                'bg-white cursor-pointer flex items-center shadow',
                'focus:outline-none focus:shadow-outline',
                'duration-150 ease-in-out transition',
              ])}
            >
              <div className="p-4 w-3/5">
                <span className="font-medium">{registration.name}</span>
              </div>
              <div className="p-4 w-1/5">
                {registration.player ? (
                  <Tag color="green">Confirmado</Tag>
                ) : (
                  <Tag color="yellow">A confirmar</Tag>
                )}
              </div>
              <div className="p-4 w-1/5">
                <div className="flex justify-end">
                  <FiChevronDown />
                </div>
              </div>
            </div>
          }
        >
          <div className="bg-gray-100 flex flex-wrap mb-2 shadow">
            <div className="p-4 w-1/5">
              <img
                src={registration.attachment}
                alt={`Comprobante de pago de ${registration.name}`}
                className="block rounded w-full"
              />
            </div>
            <div className="p-4 w-2/5">
              <div className="mb-4">
                <Heading type="h4">Detalles</Heading>
              </div>
              <div className="flex">
                <div className="mt-1">
                  <FiCalendar color="#718096" />
                </div>
                <span className="ml-2">
                  {registration.date && getEventDate(registration)}
                </span>
              </div>
              <div className="flex mt-2">
                <div className="mt-1">
                  <FaWhatsapp color="#718096" />
                </div>
                <span className="ml-2">
                  <button
                    onClick={() => {
                      sendWhatsApp(registration.tel, getMessage(registration))
                    }}
                    id="whatsapp"
                    className="focus:outline-none focus:shadow-outline font-medium text-blue-800 underline"
                  >
                    {registration.tel}
                  </button>
                </span>
              </div>
              <div className="flex mt-2">
                <div className="mt-1">
                  <FiMail color="#718096" />
                </div>
                <span className="ml-2">{registration.email}</span>
              </div>
              {registration.comment && (
                <div className="flex mt-2">
                  <div className="mt-1">
                    <FiMessageSquare color="#718096" />
                  </div>
                  <pre className="font-sans italic ml-2">
                    {registration.comment}
                  </pre>
                </div>
              )}
            </div>
            <div className="p-4 w-2/5">
              {!registration.player && (
                <Fragment>
                  <div className="mb-4">
                    <Heading type="h4">Acciones</Heading>
                  </div>
                  <Button
                    aria-label="Aprobar"
                    id="provide-access"
                    onClick={() => onProvideAccessClick(registration)}
                  >
                    <FiCheck />
                    <span className="ml-2">Aprobar</span>
                  </Button>
                </Fragment>
              )}
              {registration.player && (
                <Fragment>
                  <div className="mb-4">
                    <Heading type="h4">Cartones</Heading>
                  </div>
                  <Anchor href={ticketsUrl} id="player-link">
                    <span className="flex items-center">
                      <FiLink />
                      <span className="ml-2">
                        {registration.player.tickets}
                      </span>
                    </span>
                  </Anchor>
                  <div className="my-4">
                    <Heading type="h4">Acciones</Heading>
                  </div>
                  <div className="flex flex-wrap">
                    <Button
                      aria-label="Enviar mail"
                      id="send-email"
                      onClick={() => sendEmail(registration)}
                      className="mb-4 mr-4"
                    >
                      <FiMail />
                      <span className="ml-2">Enviar mail</span>
                    </Button>
                    <Button
                      aria-label="Mandar WhatsApp"
                      id="send-whatsapp"
                      color="green"
                      onClick={() =>
                        sendWhatsApp(registration.tel, getMessage(registration))
                      }
                      className="mb-4 mr-4"
                    >
                      <FaWhatsapp />
                      <span className="ml-2">WhatsApp</span>
                    </Button>
                  </div>
                </Fragment>
              )}
            </div>
          </div>
        </Accordion>
      </div>
    )
  }

  return <Fragment>{registrationList.map(renderRow)}</Fragment>
}
