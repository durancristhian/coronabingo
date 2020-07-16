import { useRouter } from 'next/router'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import {
  RemoteData,
  REMOTE_DATA,
  Room,
  RoomBase,
  RoomContextData,
} from '~/interfaces'
import { roomsRef } from '~/utils'

const RoomContext = createContext<RoomContextData>({
  state: { type: REMOTE_DATA.NOT_ASKED },
  updateRoom: () => void 0,
})

interface Props {
  children: ReactNode
}

const RoomContextProvider = ({ children }: Props) => {
  const router = useRouter()
  const roomId = router.query.roomId?.toString()
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

    const unsubscribe = roomsRef.doc(roomId).onSnapshot(
      snapshot => {
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
        setState({ type: REMOTE_DATA.FAILURE, error })

        console.error(error)
      },
    )

    return unsubscribe
  }, [roomId])

  return (
    <RoomContext.Provider value={{ state, updateRoom }}>
      {children}
    </RoomContext.Provider>
  )
}

export { RoomContext, RoomContextProvider }
