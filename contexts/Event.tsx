import { useRouter } from 'next/router'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { Event } from '~/interfaces'
import { EventContextData } from '~/interfaces/contexts/Event'
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
        if (snapshot.exists) {
          const eventData = snapshot.data() as Event

          setEvent(
            Object.assign(
              {},
              {
                id: snapshot.id,
                exists: snapshot.exists,
                ref: snapshot.ref,
              },
              eventData,
            ),
          )
        } else {
          setError('EVENT_DOES_NOT_EXIST')
        }

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
