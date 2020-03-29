import { useRouter } from 'next/router'
import { Fragment, useEffect } from 'react'
import useSWR from 'swr'
import fetcher from '~/utils/fetcher'
import { roomsRef } from '~/utils/firebase'
import Cells from './Cells'

interface IProps {
  player: firebase.firestore.DocumentData
  setPlayerProps: (props: {}) => void
}

export default function Boards({ player, setPlayerProps }: IProps) {
  const router = useRouter()
  const roomName = router.query.name?.toString()
  const playerId = router.query.jugador?.toString()
  const url = `/api/boards?cartones=${player.boards}`
  const { data, error } = useSWR<IBoards>(url, fetcher)

  useEffect(() => {
    const roomValues = JSON.parse(localStorage.getItem('roomValues') || '{}')

    if (roomValues[roomName]) {
      roomsRef
        .doc(roomName)
        .collection('players')
        .doc(playerId)
        .update(roomValues[roomName])

      setPlayerProps(roomValues[roomName])

      localStorage.removeItem('roomValues')
    }

    window.onbeforeunload = (e: BeforeUnloadEvent) => {
      localStorage.setItem(
        'roomValues',
        JSON.stringify({
          [roomName]: data?.boards.reduce(
            (acc, board) => ({
              ...acc,
              [board.id]: player?.[board.id]
            }),
            {}
          )
        })
      )

      return e.preventDefault()
    }
  }, [data, player, roomName])

  if (error || !data) return null

  return (
    <Fragment>
      {data.boards.map((board, i) => (
        <div
          key={i}
          className="bg-white mb-8 p-4 border-2 border-gray-900 shadow"
        >
          <p className="font-semibold uppercase">Cartón Nº {board.id}</p>
          <div className="border-l-2 border-t-2 border-gray-900 flex flex-wrap mt-2">
            <Cells
              boardNumbers={board.numbers}
              selectedNumbers={player?.[board.id]}
              setSelectedNumbers={newSelectedNumbers =>
                setPlayerProps({
                  [board.id]: newSelectedNumbers
                })
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
