import { useEffect, useState } from 'react'
import { Board } from '~/interfaces'
import boardsData from '~/public/boards.json'

export default function useBoards(boardNumbers: string): Board[] {
  const [boards, setBoards] = useState<Board[]>([])

  const getBoard = (index: number) => ({
    id: index,
    numbers: boardsData[index - 1],
  })

  useEffect(() => {
    if (!boardNumbers) return

    setBoards(
      boardNumbers
        .split(',')
        .map(Number)
        .map(getBoard),
    )
  }, [boardNumbers])

  return boards
}
