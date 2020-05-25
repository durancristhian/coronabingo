import classnames from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import React, { Fragment, useEffect } from 'react'
import Box from '~/components/Box'
import Cells from '~/components/Cells'
import useTickets from '~/hooks/useTickets'
import { Player, PlayerBase, Room } from '~/interfaces'

interface Props {
  player: Player
  room: Room
  updatePlayer: (data: Partial<PlayerBase>) => void
}

export default function Tickets({ player, room, updatePlayer }: Props) {
  const tickets = useTickets(player.tickets)
  const { t } = useTranslation()

  const setSelectedNumbers = (
    ticketId: number,
    newSelectedNumbers: number[],
  ) => {
    updatePlayer({
      [ticketId]: newSelectedNumbers,
    })
  }

  const getStorageKey = (room: Room, player: Player) => {
    return `${player.id}-${room.timesPlayed}`
  }

  useEffect(() => {
    if (player.id) {
      try {
        const values = localStorage.getItem('roomValues') || '{}'
        const roomValues = JSON.parse(values)
        const playerValues = roomValues?.[getStorageKey(room, player)] || {}

        player.ref.update(playerValues)

        localStorage.removeItem('roomValues')
      } catch (e) {
        console.error(e)
      }
    }
  }, [player.id])

  useEffect(() => {
    if (player.id && tickets) {
      localStorage.setItem(
        'roomValues',
        JSON.stringify({
          [getStorageKey(room, player)]: tickets.reduce(
            (acc, ticket) => ({
              ...acc,
              [ticket.id]: player[ticket.id] || [],
            }),
            {},
          ),
        }),
      )
    }
  }, [tickets, player])

  return (
    <Fragment>
      {tickets.map((ticket, i) => (
        <div key={i} className={classnames([i !== 0 && 'mt-4'])}>
          <Box>
            <p className="font-semibold uppercase">
              {t('common:ticket', { ticketId: ticket.id })}
            </p>
            <div className="border-l-2 border-t-2 border-gray-900 flex flex-wrap mt-2">
              <Cells
                ticketNumbers={ticket.numbers}
                selectedNumbers={player[ticket.id]}
                onSelectNumber={newSelectedNumbers => {
                  setSelectedNumbers(ticket.id, newSelectedNumbers)
                }}
              />
            </div>
          </Box>
        </div>
      ))}
    </Fragment>
  )
}
