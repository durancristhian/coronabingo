import { useEffect, useState } from 'react'
import { IPlayer } from '~/components/Players'
import { roomsRef } from '~/utils/firebase'

export default function useRoomPlayers(
  roomName: string
): [IPlayer[], Function] {
  const [players, setPlayers] = useState<IPlayer[]>([])

  const sortAndSet = (array: IPlayer[]) =>
    setPlayers(
      array.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
    )

  useEffect(() => {
    if (!roomName) return

    const unsubscribe = roomsRef
      .doc(roomName)
      .collection('players')
      .onSnapshot(snapshot => {
        sortAndSet(
          snapshot.docs.map(p => {
            const data = p.data()

            return {
              id: p.id,
              name: data.name,
              boards: data.boards,
              selectedNumbers: data.selectedNumbers
            }
          })
        )
      })

    return unsubscribe
  }, [roomName])

  return [players, sortAndSet]
}
