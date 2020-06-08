import { getWorksheet } from 'gsheets'
import React, { Fragment, useEffect, useState } from 'react'
import Container from '~/components/Container'
import Heading from '~/components/Heading'
import Layout from '~/components/Layout'
import Message from '~/components/Message'
import Registrations from '~/components/Registrations'
import { Player } from '~/interfaces'
import { roomsRef } from '~/utils'

/* TODO: code smell */
const ROOM_ID = 'jQ3K1pU1OLuG7QzaZuCx'

/* TODO: move to ~/interfaces */
export interface Registration {
  comment: string
  email: string
  name: string
  paymentURL: string
  paymentImage: string
  player: Player | undefined
  tel: string
  timestamp: Date
}

/* TODO: move to utils? */
function ExcelDateToJSDate(serial: number) {
  const utc_days = Math.floor(serial - 25569)
  const utc_value = utc_days * 86400
  const date_info = new Date(utc_value * 1000)

  const fractional_day = serial - Math.floor(serial) + 0.0000001

  let total_seconds = Math.floor(86400 * fractional_day)

  const seconds = total_seconds % 60

  total_seconds -= seconds

  const hours = Math.floor(total_seconds / (60 * 60))
  const minutes = Math.floor(total_seconds / 60) % 60

  return new Date(
    date_info.getFullYear(),
    date_info.getMonth(),
    date_info.getDate(),
    hours,
    minutes,
    seconds,
  )
}

export default function EventAdmin() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [players, setPlayers] = useState<Player[]>([])

  useEffect(() => {
    getWorksheet(
      /* TODO: code smell */
      '1gwJIIPX2gs696_fq3HQQntXhg-mFwREVVyd831GWF8c',
      'Respuestas de formulario 1',
    ).then(
      res => {
        if (!res.data) return

        const data = res.data
          .map(
            d =>
              ({
                comment: d['Comentario'],
                email: d['Dirección de correo electrónico'],
                name: d['Nombre completo'],
                paymentURL: d['Comprobante de pago'],
                paymentImage: d['Comprobante de pago']
                  ?.toString()
                  .split('?id=')[1],
                tel: d['Teléfono'],
                timestamp: ExcelDateToJSDate(
                  Number(d['Marca temporal']?.toString()),
                ),
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

  const list = registrations.map(r => ({
    ...r,
    player: players.find(p => p.name === r.name),
  }))

  return (
    <Layout>
      <Container size="large">
        {!registrations.length && (
          <Message type="information">No hay inscripciones.</Message>
        )}
        {!!registrations.length && (
          <Fragment>
            <div className="text-center">
              <Heading type="h1">
                <span>Inscripciones ({list.length})</span>
              </Heading>
            </div>
            <Registrations registrations={list} roomId={ROOM_ID} />
          </Fragment>
        )}
      </Container>
    </Layout>
  )
}
