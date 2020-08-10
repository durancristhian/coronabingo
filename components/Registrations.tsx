import classnames from 'classnames'
import React, { Fragment } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import {
  FiCalendar,
  FiCheck,
  FiChevronDown,
  FiLink,
  FiMessageSquare,
} from 'react-icons/fi'
import Anchor from '~/components/Anchor'
import Button from '~/components/Button'
import FirebaseImage from '~/components/FirebaseImage'
import Heading from '~/components/Heading'
import useToast from '~/hooks/useToast'
import { Event, Player, Registration, RoomTicket } from '~/interfaces'
import {
  createBatch,
  getBaseUrl,
  roomsRef,
  sendWhatsAppTo,
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

  const renderRow = (registration: EventRegistration) => {
    return (
      <div className="mb-2" key={registration.id}>
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
                  <Tag color="green">Confirmade</Tag>
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
              <FirebaseImage path={registration.attachment}>
                {(url: string) => (
                  <img
                    src={url}
                    alt={`Comprobante de pago de ${registration.name}`}
                    className="block shadow rounded w-full"
                  />
                )}
              </FirebaseImage>
            </div>
            <div className="p-4 w-2/5">
              <div className="mb-4">
                <Heading type="h4">Detalles</Heading>
              </div>
              <div className="flex">
                <div className="mt-1">
                  <FiCalendar color="#718096" />
                </div>
                <span className="ml-2">{getEventDate(registration)}</span>
              </div>
              <div className="flex mt-2">
                <div className="mt-1">
                  <FaWhatsapp color="#718096" />
                </div>
                <span className="ml-2">
                  <button
                    onClick={() => {
                      sendWhatsAppTo(
                        registration.tel,
                        `Hola ${registration.name}, `,
                      )
                    }}
                    id="whatsapp"
                    className="focus:outline-none focus:shadow-outline font-medium text-blue-800 underline"
                  >
                    {registration.tel}
                  </button>
                </span>
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
                    iconLeft={<FiCheck />}
                  >
                    Aprobar
                  </Button>
                </Fragment>
              )}
              {registration.player && (
                <Fragment>
                  <div className="mb-4">
                    <Heading type="h4">Cartones</Heading>
                  </div>
                  <Anchor
                    href={getRoomPlayerLink(
                      // eslint-disable-next-line react/prop-types
                      event.roomId,
                      registration.player?.id || 'THIS SHOULD NOT HAPPEN',
                    )}
                    id="player-link"
                  >
                    <span className="flex items-center">
                      <FiLink />
                      <span className="ml-2">
                        {registration.player.tickets}
                      </span>
                    </span>
                  </Anchor>
                </Fragment>
              )}
            </div>
          </div>
        </Accordion>
      </div>
    )
  }

  return (
    <Fragment>
      <Heading type="h1" textAlign="center">
        Inscripciones
      </Heading>
      <div className="my-4">
        <p>Total de inscripciones: {registrations.length}</p>
        <p>Confirmades: {registrationList.length}</p>
        <p>Faltan revisar: {registrations.length - registrationList.length}</p>
      </div>
      {registrationList.map(renderRow)}
    </Fragment>
  )
}
