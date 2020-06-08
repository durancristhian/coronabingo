import { getWorksheet } from 'gsheets'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Container from '~/components/Container'
import Heading from '~/components/Heading'
import Layout from '~/components/Layout'
import Message from '~/components/Message'
import Registrations from '~/components/Registrations'
import { Player, Registration } from '~/interfaces'
import { EVENTS } from '~/pages_/eventos/[eventId]'
import { excelDateToJSDate, roomsRef } from '~/utils'

export default function EventAdmin() {
  const router = useRouter()
  const eventId = router.query.eventId?.toString()
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [players, setPlayers] = useState<Player[]>([])

  const event = EVENTS[eventId || '']

  useEffect(() => {
    if (!event) return

    getWorksheet(event.spreadsheetId, event.worksheetTitle).then(
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
                timestamp: excelDateToJSDate(
                  Number(d['Marca temporal']?.toString()),
                ),
              } as Registration),
          )
          .reverse()

        setRegistrations(data)
      },
      err => console.error(err),
    )
  }, [])

  useEffect(() => {
    if (!event) return

    return roomsRef
      .doc(event.roomId)
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

  if (!eventId || !Object.keys(EVENTS).includes(eventId || '')) {
    return (
      <Layout>
        <Container>
          <Message type="error">
            El evento que estás buscando no existe.
          </Message>
        </Container>
      </Layout>
    )
  }

  const list = registrations.map(r => ({
    ...r,
    player: players.find(p => p.name === r.name),
  }))

  return (
    <Layout>
      {!registrations.length && (
        <Container>
          <Message type="information">No hay inscripciones.</Message>
        </Container>
      )}
      {!!registrations.length && (
        <Container size="large">
          <div className="text-center">
            <Heading type="h1">
              <span>Inscripciones ({list.length})</span>
            </Heading>
          </div>
          <Registrations
            event={event}
            registrations={list}
            roomId={event.roomId}
          />
        </Container>
      )}
    </Layout>
  )
}
