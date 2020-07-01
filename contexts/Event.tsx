import { useRouter } from 'next/router'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { Event, EventContextData } from '~/interfaces'
import { eventsRef } from '~/utils'

const EventContext = createContext<EventContextData>({
  error: '',
  loading: false,
})

interface Props {
  children: ReactNode
}

const EventContextProvider = ({ children }: Props) => {
  const router = useRouter()
  const eventId = router.query.eventId?.toString()
  const [event, setEvent] = useState<Event>()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!eventId) return

    setLoading(true)

    const unsubscribe = eventsRef.doc(eventId).onSnapshot(
      snapshot => {
        const eventData = snapshot.data() as Event

        setEvent({
          ...eventData,
          id: snapshot.id,
          ref: snapshot.ref,
        })

        setLoading(false)
      },
      error => {
        setError('COULD_NOT_FETCH_EVENT')
        setLoading(false)

        console.error(error)
      },
    )

    return unsubscribe
  }, [eventId])

  return (
    <EventContext.Provider value={{ error, loading, event }}>
      {children}
    </EventContext.Provider>
  )
}

export { EventContext, EventContextProvider }
