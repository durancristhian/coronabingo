import React, { ReactNode } from 'react'
import { act, renderHook, waitFor } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { RoomContextProvider } from '~/contexts/Room'
import useRoom from '~/hooks/useRoom'
import { database } from './database'
import { routerFixture, Translation } from './fixtures'

function subscribeRoom() {
  let onSnapshot!: (snapshot: unknown) => void
  let onError!: (error: Error) => void
  database.doc.mockReturnValue({
    onSnapshot: (
      _options: unknown,
      next: typeof onSnapshot,
      error: typeof onError,
    ) => {
      onSnapshot = next
      onError = error
      return vi.fn()
    },
  })
  const router = routerFixture({
    pathname: '/room/[roomId]',
    query: { roomId: 'a' },
  })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Translation router={router}>
      <RoomContextProvider>{children}</RoomContextProvider>
    </Translation>
  )
  const hook = renderHook(() => useRoom(), { wrapper })
  return {
    ...hook,
    ready: () => waitFor(() => expect(onSnapshot).toBeDefined()),
    snapshot: (snapshot: Record<string, unknown>) =>
      act(() =>
        onSnapshot({ metadata: { hasPendingWrites: false }, ...snapshot }),
      ),
    fail: (error: Error) => act(() => onError(error)),
  }
}

test('a missing room is a successful lookup with no room, not a loading failure', async () => {
  const room = subscribeRoom()
  await room.ready()
  room.snapshot({ exists: false })
  expect(room.result.current).toMatchObject({
    loading: false,
    error: false,
    room: null,
  })
})

test('a failed room lookup remains a loading error', async () => {
  const room = subscribeRoom()
  await room.ready()
  vi.spyOn(console, 'error').mockImplementation(() => undefined)
  room.fail(new Error('Permission denied'))
  expect(room.result.current).toMatchObject({
    loading: false,
    error: true,
    room: null,
  })
})

test('remote room updates retain unsaved setup choices while refreshing clean fields', async () => {
  const room = subscribeRoom()
  await room.ready()
  const snapshot = (changes = {}) => ({
    exists: true,
    id: 'a',
    ref: {},
    data: () => ({
      name: 'Room',
      adminId: 'old-host',
      bingoSpinner: true,
      selectedNumbers: [],
      ...changes,
    }),
  })
  room.snapshot(snapshot())
  act(() =>
    room.result.current.updateRoom({
      adminId: 'new-host',
      bingoSpinner: false,
    }),
  )
  room.snapshot(snapshot({ selectedNumbers: [7] }))
  expect(room.result.current.room).toMatchObject({
    adminId: 'new-host',
    bingoSpinner: false,
    selectedNumbers: [7],
  })
  // After the draft is acknowledged, later remote changes become authoritative.
  room.snapshot(snapshot({ adminId: 'new-host', bingoSpinner: false }))
  room.snapshot(snapshot({ adminId: 'another-host', bingoSpinner: true }))
  expect(room.result.current.room).toMatchObject({
    adminId: 'another-host',
    bingoSpinner: true,
  })
})

test('a queued sound write is not exposed as a committed room command', async () => {
  const room = subscribeRoom()
  await room.ready()
  const base = { name: 'Room', soundToPlay: '', timesPlayed: 1 }
  room.snapshot({
    exists: true,
    id: 'a',
    ref: {},
    metadata: { hasPendingWrites: false },
    data: () => base,
  })
  room.snapshot({
    exists: true,
    id: 'a',
    ref: {},
    metadata: { hasPendingWrites: true },
    data: () => ({ ...base, soundToPlay: 'queued.mp3' }),
  })
  expect(room.result.current.room?.soundToPlay).toBe('')
  room.snapshot({
    exists: true,
    id: 'a',
    ref: {},
    metadata: { hasPendingWrites: false },
    data: () => ({ ...base, soundToPlay: 'queued.mp3' }),
  })
  expect(room.result.current.room?.soundToPlay).toBe('queued.mp3')
})
