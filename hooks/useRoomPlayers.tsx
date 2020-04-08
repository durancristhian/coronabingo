import { useEffect, useState } from 'react'
import { IPlayer } from '~/components/Players'
import { roomsRef } from '~/utils/firebase'

export default function useRoomPlayers(roomId: string): [IPlayer[], Function] {
  const [players, setPlayers] = useState<IPlayer[]>([])

  const sortAndSet = (array: IPlayer[]) =>
    setPlayers(array.sort((a, b) => a.name.localeCompare(b.name)))

  useEffect(() => {
    if (!roomId) return

    const unsubscribe = roomsRef
      .doc(roomId)
      .collection('players')
      .onSnapshot(snapshot => {
        sortAndSet(
          snapshot.docs.map(p => {
            const data = p.data()

            return {
              id: p.id,
              name: data.name,
              boards: data.boards,
              selectedNumbers: data.selectedNumbers,
            }
          }),
        )
      })

    return unsubscribe
  }, [roomId])

  return [players, sortAndSet]
}
