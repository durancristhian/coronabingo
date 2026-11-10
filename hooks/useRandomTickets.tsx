import { useEffect, useState } from 'react'
import ticketsMetadata from '~/public/tickets-metadata.json'
import { createTicketAssignments } from '~/utils/cardAllocation'
import { knuthShuffle } from 'knuth-shuffle'

const tickets = createTicketAssignments(ticketsMetadata.ticketCount)

export default function useRandomTickets(): string[] {
  const [randomTickets, setRandomTickets] = useState<string[]>([])

  useEffect(() => {
    setRandomTickets(knuthShuffle(tickets.slice(0)))
  }, [])

  return randomTickets
}
