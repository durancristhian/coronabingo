import { Fragment, useEffect } from 'react'
import useTranslation from 'next-translate/useTranslation'
import useBoards from '~/hooks/useBoards'
import { roomsRef } from '~/utils/firebase'
import Cells from './Cells'

interface IProps {
  player: firebase.firestore.DocumentData
  room: firebase.firestore.DocumentData
  setPlayerProps: (props: {}) => void
}

export default function Boards({ player, room, setPlayerProps }: IProps) {
  const boards = useBoards(player.boards)
  const { t } = useTranslation()

  useEffect(() => {
    if (room && player) {
      try {
        const roomValues = JSON.parse(localStorage.getItem('roomValues') || '')
        const playerValues = roomValues?.[player.id] || {}
        roomsRef
          .doc(room.id)
          .collection('players')
          .doc(player.id)
          .update(playerValues)
        localStorage.removeItem('roomValues')
      } catch (e) {}

      const saveOnLeave = (e: BeforeUnloadEvent | PopStateEvent) => {
        localStorage.setItem(
          'roomValues',
          JSON.stringify({
            [player.id]: boards.reduce(
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
  }, [boards, player, room])

  return (
    <Fragment>
      {boards.map((board, i) => (
        <div
          key={i}
          className="bg-white mb-8 p-4 border-2 border-gray-900 shadow cursor-poroto"
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
