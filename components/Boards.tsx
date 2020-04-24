import classnames from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import React, { Fragment, useEffect } from 'react'
import Box from '~/components/Box'
import Cells from '~/components/Cells'
import useBoards from '~/hooks/useBoards'
import { Player, PlayerBase } from '~/interfaces'

interface Props {
  player: Player
  updatePlayer: (data: Partial<PlayerBase>) => void
}

export default function Boards({ player, updatePlayer }: Props) {
  const boards = useBoards(player.boards)
  const { t } = useTranslation()

  const setSelectedNumbers = (
    boardId: number,
    newSelectedNumbers: number[],
  ) => {
    updatePlayer({
      [boardId]: newSelectedNumbers,
    })
  }

  useEffect(() => {
    if (player.id) {
      try {
        const values = localStorage.getItem('roomValues') || '{}'
        const roomValues = JSON.parse(values)
        const playerValues = roomValues?.[player.id] || {}

        player.ref.update(playerValues)

        localStorage.removeItem('roomValues')
      } catch (error) {
        console.error(error)
      }
    }
  }, [player.id])

  useEffect(() => {
    if (player.id && boards) {
      localStorage.setItem(
        'roomValues',
        JSON.stringify({
          [player.id]: boards.reduce(
            (acc, board) => ({
              ...acc,
              [board.id]: player[board.id] || [],
            }),
            {},
          ),
        }),
      )
    }
  }, [boards, player])

  return (
    <Fragment>
      {boards.map((board, i) => (
        <div key={i} className={classnames([i !== 0 && 'mt-4'])}>
          <Box>
            <p className="font-semibold uppercase">
              {t('common:board', { boardId: board.id })}
            </p>
            <div className="border-l-2 border-t-2 border-gray-900 flex flex-wrap mt-2">
              <Cells
                boardNumbers={board.numbers}
                selectedNumbers={player[board.id]}
                onSelectNumber={newSelectedNumbers => {
                  setSelectedNumbers(board.id, newSelectedNumbers)
                }}
              />
            </div>
          </Box>
        </div>
      ))}
    </Fragment>
  )
}
