import React from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import RoomAdmin from '~/pages/room/[roomId]/admin'
import { RoomContextProvider } from '~/contexts/Room'
import { PlayersContextProvider } from '~/contexts/Players'
import { database } from './database'
import { roomFixture, routerFixture, Translation } from './fixtures'

// Keep the providers mounted as the Pages Router does during SPA navigation.
test('a deletion finishing after navigation cannot change the next room', async () => {
  let completeA!: () => void
  let completeB!: () => void
  const deletions: Record<string, Promise<void>> = {
    a: new Promise<void>(resolve => {
      completeA = resolve
    }),
    b: new Promise<void>(resolve => {
      completeB = resolve
    }),
  }
  vi.stubGlobal('scroll', vi.fn())
  const roomListeners = new Map<string, (value: unknown) => void>()
  const rosterListeners = new Map<string, (value: unknown) => void>()
  const ref = (id: string) => ({
    onSnapshot: (_options: unknown, next: (value: unknown) => void) => {
      roomListeners.set(id, next)
      return vi.fn()
    },
    collection: () => ({
      onSnapshot: (next: (value: unknown) => void) => {
        rosterListeners.set(id, next)
        return vi.fn()
      },
    }),
  })
  database.doc.mockImplementation(ref)
  let router = routerFixture({
    pathname: '/room/[roomId]/admin',
    query: { roomId: 'a' },
  })
  const tree = () => (
    <Translation router={router}>
      <RoomContextProvider>
        <PlayersContextProvider>
          <RoomAdmin />
        </PlayersContextProvider>
      </RoomContextProvider>
    </Translation>
  )
  const view = render(tree())
  const load = async (id: string) => {
    await waitFor(() => {
      expect(roomListeners.has(id)).toBe(true)
      expect(rosterListeners.has(id)).toBe(true)
    })
    act(() => {
      roomListeners.get(id)?.({
        exists: true,
        id,
        ref: {},
        metadata: { hasPendingWrites: false },
        data: () =>
          roomFixture({
            id,
            adminId: `host-${id}`,
            code: 'code',
            readyToPlay: true,
          }),
      })
      rosterListeners.get(id)?.({
        docs: [
          {
            exists: true,
            id: `host-${id}`,
            ref: { delete: () => deletions[id] },
            data: () => ({ name: `Host ${id}`, tickets: '1,2' }),
          },
        ],
      })
    })
  }
  await load('a')
  fireEvent.click(screen.getByRole('button', { name: 'Remove player' }))
  router = routerFixture({
    pathname: '/room/[roomId]/admin',
    query: { roomId: 'b' },
  })
  view.rerender(tree())
  await load('b')
  expect(screen.getByText('Host b', { selector: 'p' })).toBeVisible()
  const spinner = () =>
    screen.getByRole('checkbox', { name: 'Use online bingo caller' })
  expect(spinner()).toBeEnabled()
  fireEvent.click(screen.getByRole('button', { name: 'Remove player' }))
  expect(spinner()).toBeDisabled()
  router = routerFixture({
    pathname: '/room/[roomId]/admin',
    query: { roomId: 'a' },
  })
  view.rerender(tree())
  await load('a')
  expect(spinner()).toBeDisabled()
  router = routerFixture({
    pathname: '/room/[roomId]/admin',
    query: { roomId: 'b' },
  })
  view.rerender(tree())
  await load('b')
  await act(async () => {
    completeA()
  })
  expect(screen.getByRole('combobox', { name: 'Host' })).toHaveValue('host-b')
  expect(spinner()).toBeDisabled()
  expect(screen.getByText('Host b', { selector: 'p' })).toBeVisible()
  await act(async () => {
    completeB()
  })
})
