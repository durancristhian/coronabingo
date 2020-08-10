import React from 'react'
import EnsureLogin from '~/components/EnsureLogin'
import Error from '~/components/Error'
import Layout from '~/components/Layout'
import Loading from '~/components/Loading'
import Message from '~/components/Message'
import Registrations from '~/components/Registrations'
import useEvent from '~/hooks/useEvent'
import useSubCollection from '~/hooks/useSubCollection'
import { Player, Registration, RoomTicket } from '~/interfaces'

export default function EventAdmin() {
  return (
    <Layout type="large">
      <EnsureLogin>
        <Content />
      </EnsureLogin>
    </Layout>
  )
}

function Content() {
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
    return <Loading />
  }

  if (eventError || registrationsError || playersError || ticketsError) {
    return (
      <Message type="error">El evento que estás buscando no existe.</Message>
    )
  }

  if (!event || !registrations || !players || !tickets) return null

  return (
    <>
      {!registrations.length && <Error message="No hay inscripciones." />}
      {!!registrations.length && (
        <Registrations
          event={event}
          players={players as Player[]}
          registrations={registrations as Registration[]}
          tickets={tickets as RoomTicket[]}
        />
      )}
    </>
  )
}
