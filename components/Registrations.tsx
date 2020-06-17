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
import { Event, EventTicket, Registration } from '~/interfaces'
import { createBatch, roomsRef, Timestamp } from '~/utils'

interface Props {
  event: Event
  registrations: Registration[]
  tickets: EventTicket[]
}

export default function Registrations({
  event,
  registrations,
  tickets,
}: Props) {
  const { createToast, dismissToast, updateToast } = useToast()

  const onProvideAccessClick = async (r: Registration) => {
    const toastId = createToast('Otorgando acceso...', 'information')

    try {
      const batch = createBatch()
      const room = roomsRef.doc(event.roomId)
      const playerRef = room.collection('players').doc()
      const ticket = tickets[0]
      const ticketsRef = room.collection('tickets').doc(ticket.id)

      batch.set(playerRef, {
        date: Timestamp.fromDate(new Date()),
        name: r.name,
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

  const sendEmail = async (r: Registration) => {
    if (!r.player) return

    const toastId = createToast('Enviando mail...', 'information')

    const link = getRoomPlayerLink(event.roomId, r.player.id)
    const body = `email=${r.email}&link=${link}`

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

  return (
    <Fragment>
      {registrations.map((r, i) => (
        <div key={i} className="mt-4">
          <Box>
            <div className="flex">
              <div className="w-1/5">
                <Anchor href={r.paymentURL} id="payment" display="block">
                  <img
                    src={`https://drive.google.com/uc?export=view&id=${r.paymentImage}`}
                    alt={`Comprobante de pago de ${r.name}`}
                    className="block rounded w-full"
                  />
                </Anchor>
              </div>
              <div className="w-3/5">
                <div className="mx-4">
                  <Heading type="h4">{r.name}</Heading>
                  <div className="break-all mt-4 text-gray-700 whitespace-pre-wrap">
                    <p className="flex items-center">
                      <FiClock />
                      <span className="ml-2">
                        {r.timestamp.toLocaleDateString('es-ar')}
                        <span>, </span>
                        {r.timestamp.toLocaleTimeString('es-ar')}
                      </span>
                    </p>
                    <p className="flex items-center">
                      <FaWhatsapp />
                      <span className="ml-2">
                        <Anchor
                          href={`https://api.whatsapp.com/send?phone=+549${r.tel}&text=Hola ${r.name}, `}
                          id="whatsapp"
                        >
                          {r.tel}
                        </Anchor>
                      </span>
                    </p>
                    <p className="flex items-center">
                      <FiMail />
                      <span className="ml-2">{r.email}</span>
                    </p>
                    {r.comment && (
                      <p className="flex items-center">
                        <FiMessageSquare />
                        <span className="ml-2">{r.comment}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right w-1/5">
                {!r.player && (
                  <Button
                    aria-label="Aprobar"
                    id="provide-access"
                    onClick={() => onProvideAccessClick(r)}
                  >
                    <FiCheck />
                    <span className="ml-2">Aprobar</span>
                  </Button>
                )}
                {r.player && (
                  <div>
                    <Anchor
                      href={getRoomPlayerLink(event.roomId, r.player.id)}
                      id="player-link"
                    >
                      <span className="flex items-center">
                        <FiLink />
                        <span className="ml-2">
                          Cartones ({r.player.tickets})
                        </span>
                      </span>
                    </Anchor>
                    <div className="mt-4">
                      <Button
                        aria-label="Mandar mail"
                        id="send-email"
                        onClick={() => sendEmail(r)}
                      >
                        <FiMail />
                        <span className="ml-2">Mandar mail</span>
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
