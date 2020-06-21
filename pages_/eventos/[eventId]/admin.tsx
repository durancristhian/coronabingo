import { default as NextError } from 'next/error'
import React from 'react'
import Container from '~/components/Container'
import Error from '~/components/Error'
import Heading from '~/components/Heading'
import Layout from '~/components/Layout'
import Loading from '~/components/Loading'
import Message from '~/components/Message'
import Registrations from '~/components/Registrations'
import useEvent from '~/hooks/useEvent'
import useSubCollection from '~/hooks/useSubCollection'
import { Player, Registration, RoomTicket } from '~/interfaces'

interface Props {
  hidden: boolean
}

export default function EventAdmin({ hidden }: Props) {
  const { error: eventError, loading: eventLoading, event } = useEvent()
  const {
    data: registrations,
    error: registrationsError,
    loading: registrationsLoading,
  } = useSubCollection('events', event?.id, 'registrations')
  const {
    data: players,
    error: playersError,
    loading: playersLoading,
  } = useSubCollection('rooms', event?.roomId, 'players')
  const {
    data: tickets,
    error: ticketsError,
    loading: ticketsLoading,
  } = useSubCollection('rooms', event?.roomId, 'tickets')

  if (
    eventLoading ||
    registrationsLoading ||
    playersLoading ||
    ticketsLoading
  ) {
    return (
      <Layout>
        <Container>
          <Loading />
        </Container>
      </Layout>
    )
  }

  if (eventError || registrationsError || playersError || ticketsError) {
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

  if (!event || !registrations || !players || !tickets) return null

  if (hidden) {
    return <NextError statusCode={404} />
  }

  return (
    <Layout>
      {!registrations.length && (
        <Container>
          <Error message="No hay inscripciones." />
        </Container>
      )}
      {!!registrations.length && (
        <Container size="large">
          <div className="mb-4">
            <Heading type="h1" textAlign="center">
              <span>Inscripciones ({registrations.length})</span>
            </Heading>
          </div>
          <Registrations
            event={event}
            players={players as Player[]}
            registrations={registrations as Registration[]}
            tickets={tickets as RoomTicket[]}
          />
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
