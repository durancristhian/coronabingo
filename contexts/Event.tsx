import { useRouter } from 'next/router'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import {
  Event,
  EventBase,
  EventContextData,
  RemoteData,
  REMOTE_DATA,
} from '~/interfaces'
import { eventsRef } from '~/utils'

const EventContext = createContext<EventContextData>({
  state: { type: REMOTE_DATA.NOT_ASKED },
})

interface Props {
  children: ReactNode
}

const EventContextProvider = ({ children }: Props) => {
  const router = useRouter()
  const eventId = router.query.eventId?.toString()
  const [state, setState] = useState<RemoteData<Error, Event>>({
    type: REMOTE_DATA.NOT_ASKED,
  })

  useEffect(() => {
    if (!eventId) return

    setState({ type: REMOTE_DATA.LOADING })

    const unsubscribe = eventsRef.doc(eventId).onSnapshot(
      snapshot => {
        if (!snapshot.exists) {
          setState({
            type: REMOTE_DATA.FAILURE,
            error: new Error('Deleted event'),
          })

          return
        }

        const eventData = snapshot.data() as EventBase
        const event = {
          ...eventData,
          id: snapshot.id,
          ref: snapshot.ref,
        }

        setState({ type: REMOTE_DATA.SUCCESS, data: event })
      },
      error => {
        setState({ type: REMOTE_DATA.FAILURE, error })

        console.error(error)
      },
    )

    return unsubscribe
  }, [eventId])

  return (
    <EventContext.Provider value={{ state }}>{children}</EventContext.Provider>
  )
}

export { EventContext, EventContextProvider }
