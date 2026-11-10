import assert from 'assert'
import { TicketNumbers } from '../interfaces/custom/Ticket'
import { TICKETS_PER_PLAYER } from '../utils/cardAllocation'

const MAX_SHARED_NUMBERS = 10

export function validateTicketCatalog(
  tickets: TicketNumbers[],
  metadata: { ticketCount: number; maxPlayers: number },
) {
  assert.strictEqual(
    metadata.ticketCount,
    tickets.length,
    'Ticket metadata count must match the catalog',
  )
  assert.strictEqual(
    tickets.length % TICKETS_PER_PLAYER,
    0,
    `Ticket catalog must contain ${TICKETS_PER_PLAYER} tickets per player`,
  )
  assert.strictEqual(
    metadata.maxPlayers,
    tickets.length / TICKETS_PER_PLAYER,
    'Ticket metadata capacity must match the catalog',
  )

  const numbers = tickets.map(ticket =>
    ticket.filter((number): number is number => number !== null),
  )
  const violations: string[] = []
  for (let first = 0; first < numbers.length; first++) {
    for (let second = first + 1; second < numbers.length; second++) {
      const shared = numbers[first].filter(number =>
        numbers[second].includes(number),
      ).length
      if (shared > MAX_SHARED_NUMBERS) {
        violations.push(`${first + 1} and ${second + 1}: ${shared}`)
      }
    }
  }
  assert.strictEqual(
    violations.length,
    0,
    `Cards sharing more than ${MAX_SHARED_NUMBERS} numbers:\n${violations.join(
      '\n',
    )}`,
  )
}
