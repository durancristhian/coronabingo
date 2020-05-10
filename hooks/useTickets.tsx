import { useEffect, useState } from 'react'
import { Ticket } from '~/interfaces'
import ticketsData from '~/public/tickets.json'

export default function useTickets(ticketNumbers: string): Ticket[] {
  const [tickets, setTickets] = useState<Ticket[]>([])

  const getTicket = (index: number) => ({
    id: index,
    numbers: ticketsData[index - 1],
  })

  useEffect(() => {
    if (!ticketNumbers) return

    setTickets(
      ticketNumbers
        .split(',')
        .map(Number)
        .map(getTicket),
    )
  }, [ticketNumbers])

  return tickets
}
