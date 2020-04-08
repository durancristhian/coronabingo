import { useEffect, useState } from 'react'
import boardsData from '~/public/boards.json'

export default function useBoards(boardNumbers: string): IBoard[] {
  const [boards, setBoards] = useState<IBoard[]>([])

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

interface IBoard {
  id: number
  numbers: IBoardNumbers
}

export type IBoardNumbers = (number | null)[]
