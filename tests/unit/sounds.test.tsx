import React from 'react'
import { act, render } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import Sounds from '~/components/Sounds'
import { Room } from '~/interfaces/models/Room'
import { roomFixture } from './fixtures'
import { database } from './database'

function audioBoundary() {
  const sounds: {
    duration: number
    play: ReturnType<typeof vi.fn>
    pause: ReturnType<typeof vi.fn>
    remove: ReturnType<typeof vi.fn>
    volume: number
    onended: (() => void) | null
    onerror: (() => void) | null
  }[] = []
  vi.stubGlobal(
    'Audio',
    class {
      duration = sounds.length ? 10 : 1
      volume = 0
      play = vi.fn().mockResolvedValue(undefined)
      pause = vi.fn()
      remove = vi.fn()
      onended = null
      onerror = null
      constructor() {
        sounds.push(this)
      }
    },
  )
  return sounds
}

test('a retired sound cannot clear the sound of the next game', async () => {
  vi.useFakeTimers()
  const sounds = audioBoundary()
  const update = vi.fn().mockResolvedValue(undefined)
  const ref = ({ update } as unknown) as Room['ref']
  const view = render(
    <Sounds isAdmin room={roomFixture({ ref, soundToPlay: 'A' })} />,
  )
  await act(async () => {
    await Promise.resolve()
  })
  view.rerender(
    <Sounds
      isAdmin
      room={roomFixture({ ref, soundToPlay: 'B', timesPlayed: 2 })}
    />,
  )
  await act(async () => {
    await vi.advanceTimersByTimeAsync(1001)
  })
  expect(update).not.toHaveBeenCalled()
  expect(sounds[0].pause).toHaveBeenCalled()
})

test('finishing a sound only clears the command that is still current', async () => {
  const { default: roomApi } = await import('~/models/room')
  const old = roomFixture({ soundToPlay: 'A', soundCommandId: 'old' })
  let current = { ...old, soundCommandId: 'new' }
  database.runTransaction.mockImplementation(async operation =>
    operation({
      get: async () => ({ data: () => current }),
      update: (_ref: unknown, changes: Partial<Room>) => {
        current = { ...current, ...changes }
      },
    }),
  )
  await roomApi.clearSound(old)
  expect(current.soundToPlay).toBe('A')
  await roomApi.clearSound(current)
  expect(current.soundToPlay).toBe('')
})

test('media completion releases the current command and unmount pauses playback', async () => {
  const sounds = audioBoundary()
  const room = roomFixture({ soundToPlay: 'A', soundCommandId: 'current' })
  let command = room.soundToPlay
  database.runTransaction.mockImplementation(async operation =>
    operation({
      get: async () => ({ data: () => room }),
      update: (_ref: unknown, changes: Partial<Room>) => {
        command = changes.soundToPlay || ''
      },
    }),
  )
  const view = render(<Sounds isAdmin room={room} />)
  await act(async () => {
    sounds[0].onended?.()
  })
  expect(command).toBe('')
  view.unmount()
  expect(sounds[0].pause).toHaveBeenCalled()
})

test('sound completion retries after reconnecting without touching a newer command', async () => {
  const sounds = audioBoundary()
  const room = roomFixture({ soundToPlay: 'A', soundCommandId: 'current' })
  let command = 'A'
  database.runTransaction.mockRejectedValueOnce(new Error('Client offline'))
  const view = render(<Sounds isAdmin room={room} />)
  await act(async () => {
    sounds[0].onended?.()
  })
  database.runTransaction.mockImplementation(async operation =>
    operation({
      get: async () => ({ data: () => room }),
      update: (_ref: unknown, changes: Partial<Room>) => {
        command = changes.soundToPlay || ''
      },
    }),
  )
  await act(async () => {
    window.dispatchEvent(new Event('online'))
  })
  expect(command).toBe('')
  view.unmount()
  const count = database.runTransaction.mock.calls.length
  window.dispatchEvent(new Event('online'))
  expect(database.runTransaction.mock.calls).toHaveLength(count)
})
