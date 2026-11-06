import React from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import Players from '~/components/Players'
import { PlayersContextProvider } from '~/contexts/Players'
import usePlayers from '~/hooks/usePlayers'
import { Player } from '~/interfaces/models/Player'
import { roomFixture, routerFixture, Translation } from './fixtures'
import { database } from './database'

test('a denied player deletion keeps the player and offers a retry', async () => {
  let snapshot!: (value: unknown) => void
  let rejectDelete!: (error: Error) => void
  const remove = vi
    .fn()
    .mockImplementationOnce(
      () =>
        new Promise<void>((_, reject) => {
          rejectDelete = reject
        }),
    )
    .mockResolvedValue(undefined)
  const player = ({
    id: 'host',
    name: 'Alice',
    tickets: '1,2',
    ref: { delete: remove },
  } as unknown) as Player
  database.doc.mockReturnValue({
    collection: () => ({
      onSnapshot: (_options: unknown, next: typeof snapshot) => {
        snapshot = next
        return vi.fn()
      },
    }),
  })
  const updateRoom = vi.fn()
  function Setup() {
    const { players, setPlayers } = usePlayers()
    return (
      <Players
        players={players}
        setPlayers={setPlayers}
        room={roomFixture({ adminId: 'host' })}
        updateRoom={updateRoom}
        isFormDisabled={false}
      />
    )
  }
  render(
    <Translation
      router={routerFixture({
        pathname: '/room/[roomId]/admin',
        query: { roomId: 'a' },
      })}
    >
      <PlayersContextProvider>
        <Setup />
      </PlayersContextProvider>
    </Translation>,
  )
  await waitFor(() => expect(snapshot).toBeDefined())
  act(() =>
    snapshot({
      metadata: { hasPendingWrites: false },
      docs: [
        {
          exists: true,
          id: player.id,
          ref: player.ref,
          data: () => ({ name: 'Alice', tickets: '1,2' }),
        },
      ],
    }),
  )
  fireEvent.click(screen.getByRole('button', { name: 'Remove player' }))
  expect(screen.getByText('Alice')).toBeVisible()
  // Firestore publishes a local deletion before the server accepts it.
  act(() => snapshot({ metadata: { hasPendingWrites: true }, docs: [] }))
  expect(screen.getByText('Alice')).toBeVisible()
  await act(async () => {
    rejectDelete(new Error('Permission denied'))
  })
  expect(screen.getByRole('alert')).toHaveTextContent(/couldn't remove/i)
  expect(updateRoom).not.toHaveBeenCalled()
  expect(screen.getByRole('button', { name: 'Remove player' })).toBeEnabled()
  fireEvent.click(screen.getByRole('button', { name: 'Remove player' }))
  await waitFor(() =>
    expect(screen.queryByText('Alice')).not.toBeInTheDocument(),
  )
})
