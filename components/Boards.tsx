import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import useSWR from 'swr'
import fetcher from '~/utils/fetcher'
import { roomsRef } from '~/utils/firebase'
import Cells from './Cells'

interface IProps {
  boards: string
}

export default function Boards({ boards }: IProps) {
  const router = useRouter()
  const roomName = router.query.name?.toString()
  const playerId = router.query.jugador?.toString()
  const url = `/api/boards?cartones=${boards}`
  const { data, error } = useSWR<IBoards>(url, fetcher)
  const [player, setPlayer] = useState<
    firebase.firestore.DocumentData | undefined
  >()

  useEffect(() => {
    if (!playerId || !roomName) return

    const unsubscribe = roomsRef
      .doc(roomName)
      .collection('players')
      .doc(playerId)
      .onSnapshot(doc => {
        setPlayer({
          id: doc.id,
          ...doc.data()
        })
      })

    return unsubscribe
  }, [playerId, roomName])

  if (error || !data) return null

  return (
    <Fragment>
      {data.boards.map((board, i) => (
        <div
          key={i}
          className="bg-white mt-8 p-4 border-2 border-gray-900 shadow"
        >
          <p className="font-semibold uppercase">Cartón Nº {board.id}</p>
          <div className="border-l-2 border-t-2 border-gray-900 flex flex-wrap mt-2">
            <Cells
              boardId={board.id}
              boardNumbers={board.numbers}
              selectedNumbers={
                player && player[board.id] ? player[board.id] : []
              }
            />
          </div>
        </div>
      ))}
    </Fragment>
  )
}

interface IBoards {
  boards: {
    id: number
    numbers: number[]
  }[]
}
