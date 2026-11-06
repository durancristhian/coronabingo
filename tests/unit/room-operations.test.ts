import { expect, test } from 'vitest'
import roomApi from '~/models/room'
import { Room } from '~/interfaces/models/Room'
import { database } from './database'
import { roomFixture } from './fixtures'

function storedRoom(initial: Room) {
  let current = initial
  database.runTransaction.mockImplementation(async operation =>
    operation({
      get: async () => ({ data: () => current }),
      update: (_ref: unknown, changes: Partial<Room>) => {
        current = { ...current, ...changes }
      },
    }),
  )
  return { read: () => current }
}

test('physical draws add at the front and allow correcting a called number', async () => {
  const room = roomFixture({
    readyToPlay: true,
    bingoSpinner: false,
    selectedNumbers: [9, 4],
  })
  const stored = storedRoom(room)
  await roomApi.changeCalledNumber(room, 9)
  expect(stored.read().selectedNumbers).toEqual([4])
  await roomApi.changeCalledNumber(room, 7)
  expect(stored.read().selectedNumbers).toEqual([7, 4])
})

test('the last online draw reaches exactly 90 and exhaustion is a no-op', async () => {
  const room = roomFixture({
    readyToPlay: true,
    selectedNumbers: Array.from({ length: 89 }, (_, index) => index + 1),
  })
  const stored = storedRoom(room)
  await roomApi.changeCalledNumber(room)
  expect(stored.read().selectedNumbers[0]).toBe(90)
  expect(new Set(stored.read().selectedNumbers).size).toBe(90)
  await roomApi.changeCalledNumber(room)
  expect(stored.read().selectedNumbers).toHaveLength(90)
})

test('a call from an old game cannot modify a new game', async () => {
  const old = roomFixture({ readyToPlay: true, bingoSpinner: false })
  const stored = storedRoom({ ...old, timesPlayed: 2 })
  await roomApi.changeCalledNumber(old, 7)
  expect(stored.read().selectedNumbers).toEqual([])
})

test('setup and invalid physical numbers cannot produce a call', async () => {
  const room = roomFixture({ readyToPlay: false, bingoSpinner: false })
  const stored = storedRoom(room)
  await roomApi.changeCalledNumber(room, 7)
  expect(stored.read().selectedNumbers).toEqual([])
  const playing = { ...room, readyToPlay: true }
  const active = storedRoom(playing)
  await roomApi.changeCalledNumber(playing, 91)
  expect(active.read().selectedNumbers).toEqual([])
})
