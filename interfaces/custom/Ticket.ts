export interface Ticket {
  id: number
  numbers: TicketNumbers
}

export type TicketNumbers = (number | null)[]
