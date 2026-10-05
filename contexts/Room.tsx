import { useRouter } from 'next/router'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { RoomContextData } from '~/interfaces/contexts/Room'
import { RemoteData, REMOTE_DATA } from '~/interfaces/custom/RemoteData'
import { Room, RoomBase } from '~/interfaces/models/Room'

const RoomContext = createContext<RoomContextData>({
  state: { type: REMOTE_DATA.NOT_ASKED },
  updateRoom: () => void 0,
})

interface Props {
  children: ReactNode
}

const RoomContextProvider = ({ children }: Props) => {
  const router = useRouter()
  const roomId = router.pathname.startsWith('/room/')
    ? router.query.roomId?.toString()
    : undefined
  const [state, setState] = useState<RemoteData<Error, Room>>({
    type: REMOTE_DATA.NOT_ASKED,
  })

  const updateRoom = (partialRoom: Partial<RoomBase>) => {
    setState(prevState => {
      if (prevState.type !== REMOTE_DATA.SUCCESS) {
        return prevState
      }

      return {
        type: REMOTE_DATA.SUCCESS,
        data: Object.assign({}, prevState.data, partialRoom),
      }
    })
  }

  useEffect(() => {
    if (!roomId) return

    setState({ type: REMOTE_DATA.LOADING })

    let active = true
    let unsubscribe: (() => void) | undefined
    void import('~/utils/firebase').then(
      ({ roomsRef }) => {
        if (!active) return

        unsubscribe = roomsRef.doc(roomId).onSnapshot(
          snapshot => {
            if (!active) return
            if (!snapshot.exists) {
              setState({
                type: REMOTE_DATA.FAILURE,
                error: new Error('Deleted room'),
              })

              return
            }

            const roomData = snapshot.data() as RoomBase
            const room = {
              ...roomData,
              id: snapshot.id,
              ref: snapshot.ref,
            }

            setState({ type: REMOTE_DATA.SUCCESS, data: room })
          },
          error => {
            if (!active) return
            setState({ type: REMOTE_DATA.FAILURE, error })

            console.error(error)
          },
        )
      },
      error => {
        if (active) setState({ type: REMOTE_DATA.FAILURE, error })
      },
    )

    return () => {
      active = false
      unsubscribe?.()
    }
  }, [roomId])

  return (
    <RoomContext.Provider value={{ state, updateRoom }}>
      {children}
    </RoomContext.Provider>
  )
}

export { RoomContext, RoomContextProvider }
