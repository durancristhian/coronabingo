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
import useToast from '~/hooks/useToast'
import { Registration } from '~/pages_/eventos/[eventId]/admin'
import { createBatch, roomsRef, Timestamp } from '~/utils'
import Button from './Button'
import Heading from './Heading'

interface Props {
  registrations: Registration[]
  roomId: string
}

export default function Registrations({ registrations, roomId }: Props) {
  const { createToast, dismissToast, updateToast } = useToast()

  const onProvideAccessClick = async (r: Registration) => {
    const toastId = createToast('Guardando', 'information')

    try {
      const batch = createBatch()
      const room = roomsRef.doc(roomId)
      const playerRef = room.collection('players').doc()

      batch.set(playerRef, {
        date: Timestamp.fromDate(new Date()),
        name: r.name,
        selectedNumbers: [],
        /* TODO: */
        tickets: '1,2',
      })

      await batch.commit()

      updateToast('Operación exitosa', 'success', toastId)
    } catch (error) {
      console.error(error)

      updateToast('Ups!', 'error', toastId)
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

    const toastId = createToast('Mandando mail', 'information')

    const link = getRoomPlayerLink(roomId, r.player.id)
    const body = `email=${r.email}&link=${link}`

    try {
      await fetch('https://hooks.palabra.io/js?id=96', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      })

      updateToast('Operación exitosa', 'success', toastId)
    } catch (error) {
      console.error(error)

      updateToast('Ups!', 'error', toastId)
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
                          href={`https://api.whatsapp.com/send?phone=+549${r.tel}&text=Hola, ${r.name}, `}
                          id="payment"
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
                    aria-label="Dar acceso"
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
                      href={getRoomPlayerLink(roomId, r.player.id)}
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
                        color="green"
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
