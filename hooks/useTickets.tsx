import { useEffect, useState } from 'react'
import { Ticket } from '~/interfaces'
import boardsData from '~/public/boards.json'

export default function useTickets(boardNumbers: string): Ticket[] {
  const [boards, setTickets] = useState<Ticket[]>([])

  const getTicket = (index: number) => ({
    id: index,
    numbers: boardsData[index - 1],
  })

  useEffect(() => {
    if (!boardNumbers) return

    setTickets(
      boardNumbers
        .split(',')
        .map(Number)
        .map(getTicket),
    )
  }, [boardNumbers])

  return boards
}
