require('isomorphic-fetch')

import { getWorksheet } from 'gsheets'
import React, { useEffect, useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { FiCheck, FiMail } from 'react-icons/fi'
import Anchor from '~/components/Anchor'
import Box from '~/components/Box'
import Button from '~/components/Button'
import Container from '~/components/Container'
import Heading from '~/components/Heading'
import Layout from '~/components/Layout'
import useToast from '~/hooks/useToast'
import { createBatch, roomsRef, Timestamp } from '~/utils'

interface Registration {
  email: string
  name: string
  paymentURL: string
  paymentImage: string
  tel: string
}

export default function EventAdmin() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const { createToast, dismissToast, updateToast } = useToast()

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

  const onProvideAccessClick = async (r: Registration) => {
    const toastId = createToast('Guardando', 'information')

    try {
      const batch = createBatch()
      const room = roomsRef.doc('SY6xjkbUs1jaH613gx1Q')
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

  const renderRows = (registrations: Registration[]) => {
    return registrations.map((r, i) => (
      <div className="mt-4" key={i}>
        <Box>
          <div className="flex items-center justify-between">
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
          </div>
          <p className="my-2">
            <Anchor href={r.paymentURL} id="payment">
              <img
                src={`https://drive.google.com/uc?export=view&id=${r.paymentImage}`}
                alt={`Comprobante de pago de ${r.name}`}
                className="block rounded w-full"
              />
            </Anchor>
          </p>
          <div className="flex items-end justify-between">
            <div className="flex items-center">
              <span className="mr-2 text-gray-600">
                <FiMail />
              </span>
              <span className="text-gray-600">{r.email}</span>
            </div>
            <div>
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
          </div>
        </Box>
      </div>
    ))
  }

  return (
    <Layout>
      <Container size="medium">
        <div className="text-center">
          <Heading type="h1">
            <span>Pendientes de aprobación</span>
            {!!registrations.length && <span> ({registrations.length})</span>}
          </Heading>
        </div>
        {!!registrations.length && renderRows(registrations)}
      </Container>
    </Layout>
  )
}
