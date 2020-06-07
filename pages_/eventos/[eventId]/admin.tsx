require('isomorphic-fetch')

import { getWorksheet } from 'gsheets'
import React, { useEffect, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { FaWhatsapp } from 'react-icons/fa'
import { FiCheck, FiInfo, FiMail } from 'react-icons/fi'
import Anchor from '~/components/Anchor'
import Box from '~/components/Box'
import Button from '~/components/Button'
import Container from '~/components/Container'
import Heading from '~/components/Heading'
import Layout from '~/components/Layout'
import useToast from '~/hooks/useToast'
import { Player } from '~/interfaces'
import { createBatch, roomsRef, Timestamp } from '~/utils'

const ROOM_ID = 'SY6xjkbUs1jaH613gx1Q'

interface Registration {
  email: string
  name: string
  paymentURL: string
  paymentImage: string
  player: Player | null
  tel: string
}

export default function EventAdmin() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const { createToast, dismissToast, updateToast } = useToast()
  const [players, setPlayers] = useState<Player[]>([])

  useEffect(() => {
    getWorksheet(
      '1gwJIIPX2gs696_fq3HQQntXhg-mFwREVVyd831GWF8c',
      'Respuestas de formulario 1',
    ).then(
      res => {
        if (!res.data) return

        const data = res.data
          .map(
            d =>
              ({
                email: d['Dirección de correo electrónico'],
                name: d['Nombre completo'],
                paymentURL: d['Comprobante de pago'],
                paymentImage: d['Comprobante de pago']
                  ?.toString()
                  .split('?id=')[1],
                tel: d['Teléfono'],
              } as Registration),
          )
          .reverse()

        setRegistrations(data)
      },
      /* TODO: improve error handling */
      err => console.error(err),
    )
  }, [])

  useEffect(() => {
    return roomsRef
      .doc(ROOM_ID)
      .collection('players')
      .onSnapshot(
        snapshot => {
          setPlayers(
            snapshot.docs.map(p => {
              const playerData = p.data() as Player

              return Object.assign(
                {},
                {
                  id: p.id,
                  exists: p.exists,
                  ref: p.ref,
                },
                playerData,
              )
            }),
          )
        },
        error => {
          console.error(error)
        },
      )
  }, [])

  const generateTemplate = (r: Registration) => `Hola ${r.name},
  
Tu link para jugar al Coronabingo Solidario es: https://coronabingo.now.sh/room/${ROOM_ID}/${r.player?.id}

Estamos en contacto por esta vía.

Saludos,
Cris`

  const onProvideAccessClick = async (r: Registration) => {
    const toastId = createToast('Guardando', 'information')

    try {
      const batch = createBatch()
      const room = roomsRef.doc(ROOM_ID)
      const playerRef = room.collection('players').doc()

      batch.set(playerRef, {
        date: Timestamp.fromDate(new Date()),
        name: r.name,
        selectedNumbers: [],
        /* TODO: */
        tickets: '1,2',
      })

      await batch.commit()

      updateToast('Vamooo', 'success', toastId)
    } catch (error) {
      console.error(error)

      updateToast('Ups!', 'error', toastId)
    } finally {
      setTimeout(() => {
        dismissToast(toastId)
      }, 2000)
    }
  }

  const sendWhatsApp = (r: Registration) => {
    window.open(`https://api.whatsapp.com/send?phone=+549${r.tel}&text=Hola, `)
  }

  const getEmailParams = (r: Registration) =>
    `&name=${r.name}&link=https://coronabingo.now.sh/room/${ROOM_ID}/${r.player?.id}`

  /* TODO: add toast */
  const sendEmail = async (r: Registration) => {
    try {
      await fetch('https://hooks.palabra.io/js?id=96', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `email=${r.email}${getEmailParams(r)}`,
      })
    } catch (error) {
      console.error(error)
    }
  }

  const renderPendingRows = (registrations: Registration[]) => {
    return registrations.map((r, i) => (
      <div className="mt-4" key={i}>
        <Box>
          <Heading type="h2">{r.name}</Heading>
          <p className="flex items-center">
            <span className="mr-2 text-gray-600">
              <FaWhatsapp />
            </span>
            <Anchor
              href={`https://api.whatsapp.com/send?phone=+549${r.tel}&text=Hola, `}
              id="payment"
            >
              {r.tel}
            </Anchor>
          </p>
          <p className="flex items-center">
            <span className="mr-2 text-gray-600">
              <FiMail />
            </span>
            <span className="text-gray-600">{r.email}</span>
          </p>
          <p className="my-2">
            <Anchor href={r.paymentURL} id="payment" display="block">
              <img
                src={`https://drive.google.com/uc?export=view&id=${r.paymentImage}`}
                alt={`Comprobante de pago de ${r.name}`}
                className="block rounded w-full"
              />
            </Anchor>
          </p>
          <div className="mt-4 text-right">
            <Button
              aria-label="Dar acceso"
              id="provide-access"
              color="green"
              onClick={() => onProvideAccessClick(r)}
            >
              <FiCheck />
              <span className="ml-2">Dar acceso</span>
            </Button>
          </div>
        </Box>
      </div>
    ))
  }

  const renderApprovedRows = (registrations: Registration[]) => {
    return registrations.map((r, i) => (
      <div className="mt-4" key={i}>
        <Box>
          <Heading type="h2">{r.name}</Heading>
          <p className="flex items-center">
            <span className="mr-2 text-gray-600">
              <FaWhatsapp />
            </span>
            <Anchor
              href={`https://api.whatsapp.com/send?phone=+549${r.tel}&text=Hola, `}
              id="payment"
            >
              {r.tel}
            </Anchor>
          </p>
          <p className="flex items-center">
            <span className="mr-2 text-gray-600">
              <FiMail />
            </span>
            <span className="text-gray-600">{r.email}</span>
          </p>
          <p className="my-2">
            <Anchor href={r.paymentURL} id="payment" display="block">
              <img
                src={`https://drive.google.com/uc?export=view&id=${r.paymentImage}`}
                alt={`Comprobante de pago de ${r.name}`}
                className="block rounded w-full"
              />
            </Anchor>
          </p>
          <div className="my-2">
            <p className="flex items-center">
              <span className="text-gray-600">
                <FiInfo />
              </span>
              <span className="mx-2 text-gray-600">
                <span>Información</span>
              </span>
              <CopyToClipboard text={generateTemplate(r)}>
                <button
                  id="copy"
                  className="focus:outline-none focus:shadow-outline font-medium text-blue-800 underline"
                >
                  Copiar
                </button>
              </CopyToClipboard>
            </p>
            <pre className="bg-gray-100 border-2 border-gray-1 my-2 p-2 rounded">
              <code className="break-all whitespace-pre-wrap">
                {generateTemplate(r)}
              </code>
            </pre>
          </div>
          <div className="flex flex-wrap items-center justify-between mt-4">
            <Button
              aria-label="Contactar por WhatsApp"
              id="send-whatsapp"
              color="green"
              onClick={() => sendWhatsApp(r)}
            >
              <FaWhatsapp />
              <span className="ml-2">Mandar WhatsApp</span>
            </Button>
            <Button
              aria-label="Mandar mail"
              id="send-email"
              onClick={() => sendEmail(r)}
            >
              <FiMail />
              <span className="ml-2">Mandar mail</span>
            </Button>
          </div>
        </Box>
      </div>
    ))
  }

  const defaultDataset: {
    pending: Registration[]
    approved: Registration[]
  } = {
    pending: [],
    approved: [],
  }
  const { pending, approved } = registrations.reduce((prev, curr) => {
    const player = players.find(p => p.name === curr.name)

    if (player) {
      prev.approved.push({
        ...curr,
        player,
      })
    } else {
      prev.pending.push(curr)
    }

    return prev
  }, defaultDataset)

  return (
    <Layout>
      <Container size="medium">
        <div className="text-center">
          <Heading type="h1">
            <span>Evento</span>
          </Heading>
        </div>
        <div className="mt-8">
          <Heading type="h2">
            <span>Pendientes de aprobación ({pending.length})</span>
          </Heading>
        </div>
        {renderPendingRows(pending)}
        <div className="mt-8">
          <Heading type="h2">
            <span>Ya están adentro ({approved.length})</span>
          </Heading>
          {renderApprovedRows(approved)}
        </div>
      </Container>
    </Layout>
  )
}
