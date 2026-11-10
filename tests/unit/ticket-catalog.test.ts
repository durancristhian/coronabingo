import { expect, test } from 'vitest'
import { validateTicketCatalog } from '../../scripts/ticket-catalog'
import { createTicketAssignments } from '../../utils/cardAllocation'

test('every catalog card is assigned once in consecutive player pairs', () => {
  expect(createTicketAssignments(6)).toEqual(['1,2', '3,4', '5,6'])
  expect(() => createTicketAssignments(3)).toThrow(/tickets per player/)
})

test('catalog validation accepts ten shared numbers and rejects eleven', () => {
  const common = Array.from({ length: 10 }, (_, index) => index + 1)
  const metadata = { ticketCount: 2, maxPlayers: 1 }
  expect(() =>
    validateTicketCatalog(
      [
        [...common, null],
        [...common, 20],
      ],
      metadata,
    ),
  ).not.toThrow()
  expect(() =>
    validateTicketCatalog(
      [
        [...common, 20],
        [...common, 20],
      ],
      metadata,
    ),
  ).toThrow(/1 and 2: 11/)
})

test('catalog validation rejects inconsistent count and player capacity', () => {
  expect(() =>
    validateTicketCatalog([[1], [2]], { ticketCount: 4, maxPlayers: 1 }),
  ).toThrow(/count must match/)
  expect(() =>
    validateTicketCatalog([[1], [2]], { ticketCount: 2, maxPlayers: 2 }),
  ).toThrow(/capacity must match/)
  expect(() =>
    validateTicketCatalog([[1]], { ticketCount: 1, maxPlayers: 1 }),
  ).toThrow(/tickets per player/)
})
