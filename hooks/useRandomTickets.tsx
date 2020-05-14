import { useEffect, useState } from 'react'
import { MAX_PLAYERS } from '~/utils'
const knuthShuffle = require('knuth-shuffle').knuthShuffle

const tickets: string[] = []
const limit = MAX_PLAYERS * 2 + 1

for (let index = 1; index < limit; index += 2) {
  tickets.push(`${index},${index + 1}`)
}

export default function useRandomTickets(): string[] {
  const [randomTickets, setRandomTickets] = useState([])

  useEffect(() => {
    setRandomTickets(knuthShuffle(tickets.slice(0)))
  }, [])

  return randomTickets
}
