import { Ticket } from '~/interfaces/custom/Ticket'
import ticketsData from '~/public/tickets.json'

export default function useTickets(ticketNumbers: string): Ticket[] {
  return ticketNumbers
    ? ticketNumbers
        .split(',')
        .map(Number)
        .map(id => ({
          id,
          numbers: ticketsData[id - 1],
        }))
    : []
}
