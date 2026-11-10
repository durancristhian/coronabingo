export const TICKETS_PER_PLAYER = 2

export function createTicketAssignments(ticketCount: number): string[] {
  if (ticketCount % TICKETS_PER_PLAYER !== 0) {
    throw new Error(
      `Ticket catalog must contain ${TICKETS_PER_PLAYER} tickets per player`,
    )
  }
  return Array.from({ length: ticketCount / TICKETS_PER_PLAYER }, (_, player) =>
    Array.from(
      { length: TICKETS_PER_PLAYER },
      (_, card) => player * TICKETS_PER_PLAYER + card + 1,
    ).join(','),
  )
}
