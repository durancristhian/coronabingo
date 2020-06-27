import { useRouter } from 'next/router'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { Player, PlayerBase, PlayerContextData } from '~/interfaces'
import { roomsRef } from '~/utils'

const PlayerContext = createContext<PlayerContextData>({
  error: '',
  loading: false,
  updatePlayer: () => void 0,
})

interface Props {
  children: ReactNode
}

const PlayerContextProvider = ({ children }: Props) => {
  const router = useRouter()
  const playerId = router.query.playerId?.toString()
  const roomId = router.query.roomId?.toString()
  const [player, setPlayer] = useState<Player>()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const updatePlayer = (data: Partial<PlayerBase>) => {
    setPlayer(prev => Object.assign({}, prev, data))
  }

  useEffect(() => {
    if (!playerId) return

    setLoading(true)

    const unsubscribe = roomsRef
      .doc(`${roomId}/players/${playerId}`)
      .onSnapshot(
        snapshot => {
          let playerData

          if (snapshot.exists) {
            const data = snapshot.data() as Player

            playerData = {
              ...data,
              id: snapshot.id,
              ref: snapshot.ref,
            }
          }

          setPlayer(playerData)
          setLoading(false)
        },
        error => {
          setError('COULD_NOT_FETCH_PLAYER')
          setLoading(false)

          console.error(error)
        },
      )

    return unsubscribe
  }, [playerId])

  return (
    <PlayerContext.Provider value={{ error, loading, player, updatePlayer }}>
      {children}
    </PlayerContext.Provider>
  )
}

export { PlayerContext, PlayerContextProvider }
