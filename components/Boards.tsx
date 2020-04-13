import classnames from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import React, { Fragment, useEffect } from 'react'
import useBoards from '~/hooks/useBoards'
import Box from './Box'
import Cells from './Cells'

interface Props {
  player: firebase.firestore.DocumentData
  setPlayerProps: (props: {}) => void
}

export default function Boards({ player, setPlayerProps }: Props) {
  const boards = useBoards(player.boards)
  const { t } = useTranslation()

  useEffect(() => {
    if (player.id) {
      try {
        const roomValues = JSON.parse(
          localStorage.getItem('roomValues') || '{}',
        )
        const playerValues = roomValues?.[player.id] || {}
        player.ref.update(playerValues)
        localStorage.removeItem('roomValues')
      } catch (e) {
        console.error(e)
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
              [board.id]: player?.[board.id] || [],
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
                selectedNumbers={player?.[board.id]}
                setSelectedNumbers={newSelectedNumbers =>
                  setPlayerProps({
                    [board.id]: newSelectedNumbers,
                  })
                }
              />
            </div>
          </Box>
        </div>
      ))}
    </Fragment>
  )
}
