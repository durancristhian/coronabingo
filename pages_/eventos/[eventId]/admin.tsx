import { getWorksheet } from 'gsheets'
import Error from 'next/error'
import React, { useEffect, useState } from 'react'
import Container from '~/components/Container'
import Heading from '~/components/Heading'
import Layout from '~/components/Layout'
import Message from '~/components/Message'
import Registrations from '~/components/Registrations'
import useEvent from '~/hooks/useEvent'
import { EventTicket, Player, Registration } from '~/interfaces'
import { excelDateToJSDate, roomsRef } from '~/utils'

interface Props {
  hidden: boolean
}

export default function EventAdmin({ hidden }: Props) {
  const { error, loading, event } = useEvent()
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [tickets, setTickets] = useState<EventTicket[]>([])

  if (loading) {
    return (
      <Layout>
        <Container>
          <Message type="information">
            Cargando información del evento...
          </Message>
        </Container>
      </Layout>
    )
  }

  if (error) {
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

  if (!event) return null

  useEffect(() => {
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
    const unsubscribeFromPlayers = roomsRef
      .doc(event.roomId)
      .collection('players')
      .onSnapshot(snapshot => {
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
      })

    const unsubscribeFromTickets = roomsRef
      .doc(event.roomId)
      .collection('tickets')
      .onSnapshot(
        snapshot => {
          setTickets(
            snapshot.docs.map(t => {
              const ticketData = t.data() as EventTicket

              return Object.assign(
                {},
                {
                  id: t.id,
                },
                ticketData,
              )
            }),
          )
        },
        error => {
          console.error(error)
        },
      )

    return () => {
      unsubscribeFromPlayers()
      unsubscribeFromTickets()
    }
  }, [])

  if (hidden) {
    return <Error statusCode={404} />
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
          <Heading type="h1">
            <span>Inscripciones ({list.length})</span>
          </Heading>
          <Registrations event={event} registrations={list} tickets={tickets} />
        </Container>
      )}
    </Layout>
  )
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  }
}

export async function getStaticProps() {
  return {
    props: {
      hidden: process.env.NODE_ENV === 'production',
    },
  }
}
