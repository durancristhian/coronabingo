/* eslint-disable @typescript-eslint/no-var-requires */
const assert = require('assert').strict
const { readFileSync } = require('fs')
const { join } = require('path')

const MAX_COINCIDES_ALLOWED = 10

type Ticket = (number | null)[]
type TicketNumbers = number[]
type Tickets = Ticket[]

const excludeEmpty = (tickets: Tickets): TicketNumbers[] =>
  // @ts-ignore
  tickets.map(ticket => {
    return ticket.filter(Boolean).sort((n1, n2) => Number(n1) - Number(n2))
  })

const ticketsPath = join(__dirname, '../public', 'tickets.json')
const tickets = JSON.parse(readFileSync(ticketsPath, 'utf-8'))
const ticketsOnlyNumbers = excludeEmpty(tickets)

/*
  For every ticket, we count the coincidences between tickets.
  The format consist of ticket number and a result object where
  keys are other tickets id and the value the amount of coincidences
  {
      ticketNumber: 1,
      result: {
          2: 5,
          3: 7
      }
  }
*/
const result = ticketsOnlyNumbers.map((ticket, index) => {
  return {
    ticketNumber: index,
    result: ticketsOnlyNumbers.reduce((acc, otherTicket, i) => {
      //  Exclude itself
      if (i === index) return acc

      Object.assign(acc, {
        [i]: ticket.reduce((coincidences, ticketNumber) => {
          if (otherTicket.includes(ticketNumber)) {
            return coincidences + 1
          }

          return coincidences
        }, 0),
      })

      return acc
    }, {}),
  }
})

/*
    We exclude those tickets that between them there are less coincidences
    than MAX_COINCIDES_ALLOWED
*/
const ticketsWithProblems = result.reduce((acc, item) => {
  const problems = Object.keys(item.result).filter(
    // @ts-ignore
    k => item.result[k] > MAX_COINCIDES_ALLOWED,
  )

  if (problems.length) {
    return Object.assign(acc, {
      [item.ticketNumber]: problems,
    })
  }

  return acc
}, {})

try {
  assert.deepEqual(ticketsWithProblems, {})

  console.log(`✅ There are no tickets with ${MAX_COINCIDES_ALLOWED} or more`)
} catch (error) {
  console.error(error)

  console.log(`❌ Tickets with problems`)
  console.log(JSON.stringify(ticketsWithProblems, null, 2))
  console.log(
    `Note: This means that some tickets detailed in the object above have at least ${MAX_COINCIDES_ALLOWED} between them`,
  )
}

export {}
