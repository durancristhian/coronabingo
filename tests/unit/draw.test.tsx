import React from 'react'
import { act, fireEvent, render, waitFor, within } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import RoomPlayer from '~/pages/room/[roomId]/[playerId]'
import { RoomContextProvider } from '~/contexts/Room'
import { PlayerContext } from '~/contexts/Player'
import { REMOTE_DATA } from '~/interfaces/custom/RemoteData'
import { Player } from '~/interfaces/models/Player'
import { Room } from '~/interfaces/models/Room'
import { database } from './database'
import { roomFixture, routerFixture, Translation } from './fixtures'

test('two host views calling different numbers preserve both calls', async () => {
  vi.stubGlobal('scroll', vi.fn())
  const listeners = new Set<(value: unknown) => void>()
  let current = roomFixture({
    id: 'a',
    readyToPlay: true,
    adminId: 'host',
    bingoSpinner: false,
    code: 'code',
  })
  const ref = { onSnapshot: vi.fn(), update: vi.fn() }
  const snapshot = () => ({
    exists: true,
    metadata: { hasPendingWrites: false },
    id: current.id,
    ref,
    data: () => current,
  })
  ref.onSnapshot.mockImplementation(
    (_options: unknown, next: (value: unknown) => void) => {
      listeners.add(next)
      next(snapshot())
      return () => listeners.delete(next)
    },
  )
  ref.update.mockImplementation(async (changes: Partial<Room>) => {
    current = { ...current, ...changes }
    listeners.forEach(next => next(snapshot()))
  })
  database.doc.mockReturnValue(ref)
  let queue = Promise.resolve()
  database.runTransaction.mockImplementation(operation => {
    const result = queue.then(() =>
      operation({
        get: async () => snapshot(),
        update: (_ref: unknown, changes: Partial<Room>) => ref.update(changes),
      }),
    )
    queue = result.then(() => undefined)
    return result
  })
  const player = {
    id: 'host',
    name: 'Host',
    tickets: '1,2',
    selectedNumbers: [],
    date: current.date,
    ref: {} as Player['ref'],
  } as Player
  function Host() {
    return (
      <Translation
        router={routerFixture({
          pathname: '/room/[roomId]/[playerId]',
          query: { roomId: 'a', playerId: 'host' },
        })}
      >
        <RoomContextProvider>
          <PlayerContext.Provider
            value={{ state: { type: REMOTE_DATA.SUCCESS, data: player } }}
          >
            <RoomPlayer />
          </PlayerContext.Provider>
        </RoomContextProvider>
      </Translation>
    )
  }
  const first = render(<Host />)
  const second = render(<Host />)
  await waitFor(() => {
    expect(first.container.querySelector('#ticket-numbers')).not.toBeNull()
    expect(second.container.querySelector('#ticket-numbers')).not.toBeNull()
  })
  const firstBoard = within(
    first.container.querySelector('#ticket-numbers') as HTMLElement,
  )
  const secondBoard = within(
    second.container.querySelector('#ticket-numbers') as HTMLElement,
  )
  act(() => {
    fireEvent.click(firstBoard.getByRole('button', { name: '7' }))
    fireEvent.click(secondBoard.getByRole('button', { name: '8' }))
  })
  await waitFor(() => {
    expect(firstBoard.getByRole('button', { name: '7' })).toHaveClass(
      'cb-number-board-cell--called',
    )
    expect(secondBoard.getByRole('button', { name: '8' })).toHaveClass(
      'cb-number-board-cell--called',
    )
  })
})
