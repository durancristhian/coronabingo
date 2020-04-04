import { useRouter } from 'next/router'
import { Fragment, useEffect } from 'react'
import useTranslation from 'next-translate/useTranslation'
import useBoards from '~/hooks/useBoards'
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
  const boards = useBoards(player.boards)
  const { t } = useTranslation()

  useEffect(() => {
    if (roomName && playerId) {
      try {
        const roomValues = JSON.parse(localStorage.getItem('roomValues') || '')
        const playerValues = roomValues?.[playerId] || {}
        roomsRef
          .doc(roomName)
          .collection('players')
          .doc(playerId)
          .update(playerValues)
        setPlayerProps(playerValues)
        localStorage.removeItem('roomValues')
      } catch (e) {}

      const saveOnLeave = (e: BeforeUnloadEvent | PopStateEvent) => {
        localStorage.setItem(
          'roomValues',
          JSON.stringify({
            [playerId]: boards.reduce(
              (acc, board) => ({
                ...acc,
                [board.id]: player?.[board.id] || []
              }),
              {}
            )
          })
        )
        return e.preventDefault()
      }

      window.onbeforeunload = saveOnLeave
      window.onpopstate = saveOnLeave
    }
  }, [boards, player, playerId, roomName])

  return (
    <Fragment>
      {boards.map((board, i) => (
        <div
          key={i}
          className="bg-white mb-8 p-4 border-2 border-gray-900 shadow"
        >
          <p className="font-semibold uppercase">
            {t('common:board', { boardId: board.id })}
          </p>
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
