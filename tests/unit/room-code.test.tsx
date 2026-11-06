import React, { ReactNode } from 'react'
import { act, renderHook } from '@testing-library/react'
import { expect, test } from 'vitest'
import { RoomCodeContextProvider } from '~/contexts/RoomCode'
import { RoomContext } from '~/contexts/Room'
import useRoomCode from '~/hooks/useRoomCode'
import { REMOTE_DATA } from '~/interfaces/custom/RemoteData'
import { roomFixture } from './fixtures'

test('host access belongs to one room and one game', () => {
  let room = roomFixture({ activateAdminCode: true, readyToPlay: true })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <RoomCodeContextProvider>
      <RoomContext.Provider
        value={{
          state: { type: REMOTE_DATA.SUCCESS, data: room },
          updateRoom: () => undefined,
        }}
      >
        {children}
      </RoomContext.Provider>
    </RoomCodeContextProvider>
  )
  const { result, rerender } = renderHook(() => useRoomCode(), { wrapper })
  act(() => result.current.login())
  expect(result.current.loggedIn).toBe(true)
  act(() => result.current.login())
  expect(result.current.loggedIn).toBe(true)
  room = { ...room, timesPlayed: 2 }
  rerender()
  expect(result.current.loggedIn).toBe(false)
  act(() => result.current.login())
  expect(result.current.loggedIn).toBe(true)
  room = { ...room, id: 'room-b' }
  rerender()
  expect(result.current.loggedIn).toBe(false)
})
