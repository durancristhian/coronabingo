import React, { useContext } from 'react'
import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { RoomContext, RoomContextProvider } from '~/contexts/Room'
import { PlayerContext, PlayerContextProvider } from '~/contexts/Player'
import { PlayersContext, PlayersContextProvider } from '~/contexts/Players'

vi.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/room/[roomId]',
    query: { roomId: 'a', playerId: 'p' },
  }),
}))
vi.mock('~/utils/firebase', () => {
  throw new Error('Chunk unavailable')
})

function State() {
  const states = [
    useContext(RoomContext),
    useContext(PlayerContext),
    useContext(PlayersContext),
  ]
  return <output>{states.map(({ state }) => state.type).join(',')}</output>
}

test('a failed lazy database import reaches every subscribed provider as an error', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => undefined)
  render(
    <RoomContextProvider>
      <PlayerContextProvider>
        <PlayersContextProvider>
          <State />
        </PlayersContextProvider>
      </PlayerContextProvider>
    </RoomContextProvider>,
  )
  expect(await screen.findByText('FAILURE,FAILURE,FAILURE')).toBeVisible()
})
